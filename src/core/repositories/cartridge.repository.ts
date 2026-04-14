import { ICartridge } from '../types/textadventurejs.shim.js';

export interface ICartridgeRepository {
  saveCartridgeAsync(cartridge: ICartridge): Promise<void>;
  loadCartridgeAsync(): Promise<ICartridge>;
}
