import { describe, it, expect } from 'vitest';
import { addNumbers } from './utils';

describe('addNumbers', () => {
  it('should add two numbers', () => {
    expect(addNumbers(2, 3)).toBe(5);
  });

  it('should handle zero', () => {
    expect(addNumbers(0, 0)).toBe(0);
  });

  it('should handle negative numbers', () => {
    expect(addNumbers(-1, 1)).toBe(0);
  });
});
