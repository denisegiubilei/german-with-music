const FLASH_CARD_CODE_COLORS: Record<number, string> = {
  1: "#0B64F4",
  2: "#ED2C2C",
  3: "#1FAD53",
  4: "#FFEF5C",
  5: "#8C3CDD",
  6: "#16CA34",
  7: "#33FFF1",
  8: "#42C4F0",
  9: "#8BA4F9",
  10: "#FFA35C",
  11: "#F075B3",
  12: "#CC9600",
  13: "#DEA6B8",
};

export function flashCardCodeColor(code: number): string | undefined {
  return FLASH_CARD_CODE_COLORS[code];
}
