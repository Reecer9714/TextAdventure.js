import { describe, it, expect } from 'vitest';
import { DefaultParser } from './default.parser.js';

const parser = new DefaultParser();

describe('Parser', () => {
  describe('parse', () => {
    it('should return an empty command for empty string', () => {
      const result = parser.parse('');
      expect(result).toEqual({ action: '', subject: '', object: '' });
    });

    it('should parse simple commands', () => {
      const result = parser.parse('look');
      expect(result.action).toBe('look');
      expect(result.subject).toBe('');
    });

    it('should parse commands with single parameter', () => {
      const result = parser.parse('take key');
      expect(result.action).toBe('take');
      expect(result.subject).toBe('key');
    });

    it('should parse commands with multiple parameters', () => {
      const result = parser.parse('go north');
      expect(result.action).toBe('go');
      expect(result.subject).toBe('north');
    });

    it('should parse complex commands', () => {
      const result = parser.parse('open door with key');
      expect(result.action).toBe('open');
      expect(result.subject).toBe('door');
      expect(result.object).toBe('key');
    });

    it('should handle uppercase commands', () => {
      const result = parser.parse('LOOK');
      expect(result.action).toBe('look');
    });

    it('should handle mixed case commands', () => {
      const result = parser.parse('Look at the door');
      expect(result.action).toBe('look');
      expect(result.subject).toBe('door');
    });

    it('should handle multiple spaces', () => {
      const result = parser.parse('go   north');
      expect(result.action).toBe('go');
      expect(result.subject).toBe('north');
    });
  });
});
