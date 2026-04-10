/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Input: Float Value
 */
export const floatInput = (params: { value: number } = { value: 0.0 }) => {
  return parseFloat(params.value as any);
};
