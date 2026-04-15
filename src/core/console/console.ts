import { DefaultParser } from './default.parser';
import { IParser } from './parser';
import {
  ICartridge,
  IGameData,
  IGameActions,
  ILocation,
  IGameActionResult,
  ICommand,
  DefaultConsoleActons,
  IItem,
  IExitCollection,
  IItemCollection,
} from '../types/textadventurejs.shim.js';

export interface IConsoleOptions {
  onDebugLog?: (message: string) => void;
}

export interface IConsole {
  getIntroText(): string;
  input(input: string): IConsoleInputResponse;
}

export interface IConsoleInputResponse {
  message: string;
  cartridge: ICartridge;
}

export default function createConsole(
  cartridge: ICartridge,
  consoleOptions?: IConsoleOptions,
  consoleParser?: IParser
): IConsole {
  const parser = consoleParser ?? new DefaultParser();
  const options = consoleOptions ?? {};

  function getIntroText(): string {
    return cartridge.gameData.introText;
  }

  function input(input: string): IConsoleInputResponse {
    const command = parser.parse(input);

    const gameActions = cartridge.gameActions;
    const game = cartridge.gameData;

    ++game.commandCounter;

    let returnString;

    debug(`Command no. ${game.commandCounter}`);

    if (isActionDefinedInCartridge(gameActions, command.action)) {
      debug(`Running cartridge action '${command.action}'`);
      returnString = gameActions[command.action](game, command, consoleInterface);
    } else if (isActionDefinedInConsole(actions, command.action)) {
      debug(`Running console action '${command.action}'`);
      returnString = actions[command.action](game, command).message;
    } else if (canInteractWithSubjectInCurrentLocation(game, command.action, command.subject)) {
      debug(
        `Performing interaction '${command.action}' in current location on subject ${command.subject}`
      );
      returnString = interactWithSubjectInCurrentLocation(game, command.action, command.subject);
    }

    returnString = returnString ?? "I don't know how to do that";

    const currentLocation = getCurrentLocation(game);

    if (typeof currentLocation.updateLocation === 'function') {
      const updateLocationString = currentLocation.updateLocation(command);

      if (updateLocationString) {
        returnString = updateLocationString;
      }
    }

    const checkForGameEndString = checkForGameEnd(game, returnString);

    return {
      message: checkForGameEndString,
      cartridge: {
        gameData: cartridge.gameData,
        gameActions: cartridge.gameActions,
      },
    };
  }

  // ----------------------------\
  // === Console Actions =================================================================================================
  // ----------------------------/
  var actions = {
    drop: function (game: IGameData, command: ICommand): IGameActionResult {
      if (!command.subject) {
        return { message: 'What do you want to drop?', success: false };
      }

      if (
        canInteractWithSubjectInCurrentLocation(game, DefaultConsoleActons.drop, command.subject)
      ) {
        return {
          message: interactWithSubjectInCurrentLocation(
            game,
            DefaultConsoleActons.drop,
            command.subject
          ),
          success: true,
        };
      }

      if (isItemInPlayerInventory(game, command.subject)) {
        const currentLocation = getCurrentLocation(game);

        moveItem(command.subject, game.player.inventory, currentLocation.items);

        const item = getItem(currentLocation.items, command.subject);

        item.hidden = false;

        return { message: `Dropped ${command.subject}`, success: true };
      }

      return { message: `You do not have a ${command.subject} to drop`, success: false };
    },

    go: function (game: IGameData, command: ICommand): IGameActionResult {
      if (!command.subject) {
        return { message: 'Where do you want to go?', success: false };
      }

      const currentLocation = getCurrentLocation(game);
      const exits = currentLocation.exits;

      let playerDestination: string | null = null;

      if (!exits) {
        return { message: "You can't go anywhere from this location.", success: false };
      }

      const matchingExit = Object.entries(exits).find(
        ([exitName, _]) =>
          exits[exitName].displayName &&
          exits[exitName].displayName.toLowerCase() === command.subject.toLowerCase()
      );

      if (matchingExit) {
        playerDestination = matchingExit[1].destination;
      }

      if (playerDestination === null) {
        return { message: `Unknown location '${command.subject}'.`, success: false };
      }

      currentLocation.firstVisit = false;

      if (typeof currentLocation.teardown === 'function') {
        currentLocation.teardown();
      }

      const destinationLocation = game.map[playerDestination];

      if (!destinationLocation) {
        throw new Error(`No location named ${playerDestination} has been defined`);
      }

      if (typeof destinationLocation.setup === 'function') {
        destinationLocation.setup();
      }

      game.player.currentLocation = playerDestination;

      return { message: getLocationDescription(game), success: true };
    },

    inventory: function (game: IGameData, _command: ICommand): IGameActionResult {
      var inventoryList = 'Your inventory contains:';
      for (var item in game.player.inventory) {
        var itemObject = game.player.inventory[item];
        if (!itemObject) continue;
        var itemName = itemObject.displayName;
        if (itemObject.quantity > 1) {
          itemName = itemName.concat(' x' + itemObject.quantity);
        }
        inventoryList = inventoryList.concat('\n' + itemName);
      }
      if (inventoryList === 'Your inventory contains:') {
        return { message: 'Your inventory is empty.', success: true };
      } else {
        return { message: inventoryList, success: true };
      }
    },

    look: function (game: IGameData, command: ICommand): IGameActionResult {
      if (!command.subject) {
        return { message: getLocationDescription(game, true), success: true };
      }

      var isInventoryItem = !!game.player.inventory[command.subject];

      if (isInventoryItem) {
        debug(`Subject ${command.subject} is an item in the player inventory`);
        return {
          message: getItem(game.player.inventory, command.subject).description,
          success: true,
        };
      }

      var isCurrentLocationItem = !!getCurrentLocation(game).items[command.subject];

      if (isCurrentLocationItem) {
        debug(`Subject ${command.subject} is an item in the current location`);
        return {
          message: getItem(getCurrentLocation(game).items, command.subject).description,
          success: true,
        };
      }

      let interactionMessage: string | undefined = undefined;

      if (
        canInteractWithSubjectInCurrentLocation(game, DefaultConsoleActons.look, command.subject)
      ) {
        debug(`Trying custom interaction with subject ${command.subject} in current location`);
        interactionMessage = interactWithSubjectInCurrentLocation(
          game,
          DefaultConsoleActons.look,
          command.subject
        );
      }

      if (!interactionMessage) {
        debug(
          `No interaction message specified for command 'look' and subject '${command.subject}'`
        );
        return { message: `What's a ${command.subject}?`, success: false };
      }

      return { message: interactionMessage || '', success: true };
    },

    take: function (game: IGameData, command: ICommand): IGameActionResult {
      if (!command.subject) {
        return { message: 'What do you want to take?', success: false };
      }

      if (
        canInteractWithSubjectInCurrentLocation(game, DefaultConsoleActons.take, command.subject)
      ) {
        return {
          message: interactWithSubjectInCurrentLocation(
            game,
            DefaultConsoleActons.take,
            command.subject
          ),
          success: true,
        };
      }

      if (isItemInCurrentLocation(game, command.subject)) {
        moveItem(command.subject, getCurrentLocation(game).items, game.player.inventory);

        const item = getItem(game.player.inventory, command.subject);

        if (typeof item.onTaken === 'function') {
          item.onTaken();
        }

        return { message: `Taken ${command.subject}`, success: true };
      }

      return { message: `Cannot take '${command.subject}'.`, success: false };
    },

    use: function (game: IGameData, command: ICommand): IGameActionResult {
      if (!command.subject) {
        return { message: 'What would you like to use?', success: false };
      }

      if (isItemInPlayerInventory(game, command.subject)) {
        const item = getItem(game.player.inventory, command.subject);

        if (typeof item.use === 'function') {
          return { message: item.use(command.object ?? command.subject), success: true };
        } else {
          return { message: `Can't use '${command.subject}'`, success: false };
        }
      }

      return { message: `You don't have a '${command.subject}' to use`, success: false };
    },
  };

  // ----------------------------\
  // === Helper Functions ===============================================================================================
  // ----------------------------/
  function checkForGameEnd(game: unknown, returnString: string): string {
    if ((game as Record<string, unknown>).gameOver) {
      return returnString + '\n' + (game as Record<string, unknown>).outroText;
    }
    return returnString;
  }

  function clone(obj: unknown): unknown {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    const temp = obj.constructor();
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) !== undefined) {
        (temp as Record<string, unknown>)[key] = clone(obj[key]);
      }
    }
    return temp;
  }

  function consoleInterface(game: IGameData, command: ICommand): IGameActionResult {
    return actions[command.action](game, command);
  }

  function debug(debugText: string): void {
    if (typeof options.onDebugLog === 'function') {
      options.onDebugLog(debugText);
    }
  }

  function exitsToString(exitsObject: IExitCollection): string {
    const numOfExits = Object.keys(exitsObject).length;
    if (numOfExits === 0) {
      return '';
    }
    const visibleExits: string[] = [];
    for (const exit in exitsObject) {
      const exitObject = exitsObject[exit];
      if (exitObject.hidden !== undefined && !exitObject.hidden) {
        visibleExits.push(exitObject.displayName);
      }
    }
    let exitReturnString: string;
    switch (visibleExits.length) {
      case 0:
        return '';
      case 1:
        exitReturnString = ' Exit is ';
        break;
      default:
        exitReturnString = ' Exits are ';
    }
    for (let i = 0; i < visibleExits.length; ++i) {
      exitReturnString = exitReturnString.concat(visibleExits[i]);
      if (i === visibleExits.length - 2) {
        exitReturnString = exitReturnString.concat(' and ');
      } else if (i === visibleExits.length - 1) {
        exitReturnString = exitReturnString.concat('.');
      } else {
        exitReturnString = exitReturnString.concat(', ');
      }
    }
    return exitReturnString;
  }

  function getCurrentLocation(gameData: IGameData): ILocation {
    return gameData.map[gameData.player.currentLocation];
  }

  function getLocationDescription(game: IGameData, forcedLongDescription?: boolean) {
    var currentLocation = getCurrentLocation(game);
    var description;
    if (currentLocation.firstVisit || forcedLongDescription) {
      description = currentLocation.description;
      if (currentLocation.items) {
        description = description.concat(itemsToString(currentLocation.items));
      }
      if (currentLocation.exits) {
        description = description.concat(exitsToString(currentLocation.exits));
      }
    } else {
      description = currentLocation.displayName;
    }
    return description;
  }

  function getItem(itemLocation: IItemCollection, itemName: string): IItem | undefined {
    const gotItemName = getItemName(itemLocation, itemName);
    return gotItemName ? itemLocation[gotItemName] : undefined;
  }

  function getItemName(itemLocation: IItemCollection, itemName: string): string | undefined {
    if (itemLocation[itemName] !== undefined) {
      return itemName;
    } else {
      for (var propertyName in itemLocation) {
        if (
          itemLocation[propertyName].displayName &&
          itemLocation[propertyName].displayName.toLowerCase() === itemName
        ) {
          return propertyName;
        }
      }
    }
  }

  function itemsToString(itemsObject: IItemCollection): string {
    const numOfItems = Object.keys(itemsObject).length;
    if (numOfItems === 0) {
      return '';
    }
    const visibleItems: Array<{ name: string; quantity: number }> = [];
    for (const item in itemsObject) {
      const itemObject = itemsObject[item];
      if (!itemObject.hidden) {
        visibleItems.push({ name: itemObject.displayName, quantity: itemObject.quantity });
      }
    }
    if (visibleItems.length === 0) {
      return '';
    }
    let itemsReturnString: string;
    if (visibleItems[0].quantity === 1) {
      itemsReturnString = ' There is ';
    } else {
      itemsReturnString = ' There are ';
    }
    for (let i = 0; i < visibleItems.length; ++i) {
      if (visibleItems[i].quantity > 1) {
        itemsReturnString = itemsReturnString.concat(
          visibleItems[i].quantity + ' ' + visibleItems[i].name + 's'
        );
      } else {
        itemsReturnString = itemsReturnString.concat('a ' + visibleItems[i].name);
      }
      if (i === visibleItems.length - 2) {
        itemsReturnString = itemsReturnString.concat(' and ');
      } else if (i === visibleItems.length - 1) {
        itemsReturnString = itemsReturnString.concat(' here.');
      } else {
        itemsReturnString = itemsReturnString.concat(', ');
      }
    }
    return itemsReturnString;
  }

  function interactWithSubjectInCurrentLocation(game: IGameData, interaction: string, subject: string) {
    var currentLocation = getCurrentLocation(game);
    var itemsForCurrentLocation = currentLocation.items;
    var interactablesForCurrentLocation = currentLocation.interactables ?? [];

    var subjectIsItem = !!itemsForCurrentLocation[subject];
    var subjectIsInteractable = !!interactablesForCurrentLocation[subject];

    if (subjectIsItem) {
      var item = itemsForCurrentLocation[subject];
      var customInteractionsForItem = item.interactions;

      if (!customInteractionsForItem || !customInteractionsForItem[interaction]) {
        throw new Error(
          `Item ${subject} doesn't have a custom interaction defined for ${interaction}`
        );
      }

      var customInteraction = customInteractionsForItem[interaction];

      return typeof customInteraction === 'function' ? customInteraction() : customInteraction;
    }

    if (subjectIsInteractable) {
      var interactible = interactablesForCurrentLocation[subject];
      var customInteraction = interactible[interaction];

      return typeof customInteraction === 'function' ? customInteraction() : customInteraction;
    }

    if (!subjectIsInteractable && !subjectIsItem) {
      throw new Error(
        `Subject '${subject}' is neither an interactible or an item for current location`
      );
    }

    return "";
  }

  function isItemInPlayerInventory(gameData: IGameData, itemName: any): boolean {
    return !!(gameData.player.inventory && gameData.player.inventory[itemName]);
  }

  function isItemInCurrentLocation(gameData: IGameData, itemName: any): boolean {
    const currentLocation = getCurrentLocation(gameData);

    return !!(currentLocation.items && currentLocation.items[itemName]);
  }

  function isInteractableInCurrentLocation(gameData: IGameData, interactibleName: any): boolean {
    const currentLocation = getCurrentLocation(gameData);

    return !!(currentLocation.interactables && currentLocation.interactables[interactibleName]);
  }

  function isActionDefinedInCartridge(cartridgeActions: IGameActions, actionName: string): boolean {
    return typeof cartridgeActions[actionName] === 'function';
  }

  function isActionDefinedInConsole(consoleActions: IGameActions, actionName: string): boolean {
    return typeof consoleActions[actionName] === 'function';
  }

  function canInteractWithSubjectInCurrentLocation(
    gameData: IGameData,
    actionName: string,
    subjectName: string
  ): boolean {
    return (
      (isItemInCurrentLocation(gameData, subjectName) &&
        isActionDefinedOnItemInCurrentLocation(gameData, actionName, subjectName)) ||
      (isInteractableInCurrentLocation(gameData, subjectName) &&
        isActionDefinedOnInteractableInCurrentLocation(gameData, actionName, subjectName))
    );
  }

  function isActionDefinedOnItemInCurrentLocation(
    gameData: IGameData,
    actionName: string,
    itemName: string
  ): boolean {
    const currentLocation = getCurrentLocation(gameData);
    const item = currentLocation.items ? currentLocation.items[itemName] : undefined;

    return !!(item && item.interactions && item.interactions[actionName]);
  }

  function isActionDefinedOnInteractableInCurrentLocation(
    gameData: IGameData,
    actionName: string,
    interactableName: string
  ): boolean {
    const currentLocation = getCurrentLocation(gameData);
    const interactable = currentLocation.interactables
      ? currentLocation.interactables[interactableName]
      : undefined;

    return !!(interactable && interactable[actionName]);
  }

  function moveItem(itemName: string, startLocation: IItemCollection, endLocation: IItemCollection) {
    const itemNameToMove = getItemName(startLocation, itemName);
    const itemAtOrigin = getItem(startLocation, itemName);
    if (itemAtOrigin === undefined) {
      throw 'itemDoesNotExist';
    }
    const itemAtDestination = getItem(endLocation, itemName);
    if (itemAtDestination === undefined) {
      (endLocation)[itemNameToMove] = clone(itemAtOrigin) as IItem;
      (endLocation)[itemNameToMove].quantity = 1;
    } else {
      (endLocation)[itemNameToMove].quantity++;
    }
    if (itemAtOrigin.quantity) {
      (itemAtOrigin as { quantity: number }).quantity--;
      if ((itemAtOrigin as { quantity: number }).quantity === 0) {
        delete startLocation[itemNameToMove];
      }
    }
  }

  return {
    input: input,
    getIntroText: getIntroText,
  };
}
