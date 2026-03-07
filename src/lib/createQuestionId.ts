export function createQuestionId(multiplicand: number, multiplier: number): string {
  const uniqueSuffix = Math.random().toString(36).slice(2, 10);

  return `${multiplicand}x${multiplier}-${uniqueSuffix}`;
}
