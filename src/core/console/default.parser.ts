import { ICommand } from '../types/textadventurejs.shim.js';
import { IParser } from './parser';

export class DefaultParser implements IParser {
  parse(string: string): ICommand {
    const skipWords = ['', 'a', 'an', 'at', 'in', 'on', 'the', 'to'];
    const subjectEndWords = ['on', 'with', 'and'];

    // === Prep Input for Processing ===
    const components = string.toLowerCase().split(' ');

    // === Create Necessary Variables ===
    const command: ICommand = {
      action: '',
      subject: '',
    };

    let subjectStartIndex: number | undefined;
    let objectStartIndex: number | undefined;

    // === Determine Action ===
    command.action = components[0];

    // === Determine Subject Start ===
    for (let i = 1; i < components.length; ++i) {
      if (skipWords.indexOf(components[i]) === -1) {
        command.subject = components[i];
        subjectStartIndex = i;
        break;
      }
    }

    // === Determine Subject End and Object Start ===
    for (let j = subjectStartIndex! + 1; j < components.length; ++j) {
      if (subjectEndWords.indexOf(components[j]) !== -1) {
        command.object = '';
        objectStartIndex = j + 1;
        break;
      } else if (components[j] === '') {
        continue;
      } else {
        command.subject = command.subject.concat(' ' + components[j]);
      }
    }

    command.object = components.slice(objectStartIndex).join(' ');

    return command;
  }
}
