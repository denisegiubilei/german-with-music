export const FLASH_CARD_CODE_COLORS: Record<number, string> = {
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

function hexRelativeLuminance(hex: string): number {
  const parse = (pair: string) => {
    const channel = Number.parseInt(pair, 16) / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };
  const r = parse(hex.slice(1, 3));
  const g = parse(hex.slice(3, 5));
  const b = parse(hex.slice(5, 7));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function flashCardCodeColor(code: number): string | undefined {
  if (!Number.isInteger(code) || code < 1 || code > 13) return undefined;
  return FLASH_CARD_CODE_COLORS[code];
}

export function flashCardWordStyle(
  code: number,
): { backgroundColor: string; color: string } | undefined {
  const backgroundColor = flashCardCodeColor(code);
  if (!backgroundColor) return undefined;
  return {
    backgroundColor,
    color:
      hexRelativeLuminance(backgroundColor) > 0.65
        ? "var(--bs-body-color)"
        : "#fff",
  };
}
