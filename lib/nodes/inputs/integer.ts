/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Input: Integer Value
 */
export const integerInput = (params: { value: number } = { value: 0 }) => {
  return Math.round(params.value);
};
