// Uncomment the code below and write your tests
import { simpleCalculator, Action } from './index';

describe('simpleCalculator table-driven tests', () => {
  test.each([
    { a: 2, b: 3, action: Action.Add, expected: 5 },
    { a: 5, b: 2, action: Action.Subtract, expected: 3 },
    { a: 2, b: 3, action: Action.Multiply, expected: 6 },
    { a: 6, b: 3, action: Action.Divide, expected: 2 },
    { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  ])(
    'should correctly calculate $a $action $b',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );

  test.each([
    { a: 3, b: 2, action: 'invalid', expected: null },
    { a: '3', b: 2, action: Action.Add, expected: null },
  ])('should return null for invalid input', ({ a, b, action, expected }) => {
    const result = simpleCalculator({ a, b, action });
    expect(result).toBe(expected);
  });
});
