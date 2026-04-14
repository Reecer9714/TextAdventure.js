import { ICommand } from '../types/textadventurejs.shim.js';

export interface IParser {
  parse(string: string): ICommand;
}
