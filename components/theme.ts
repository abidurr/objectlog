type HexColor = `#${string}`;
type HslaColor = `hsla(${string})`;

/** Shared design tokens used by components and pages. */
export type Theme = {
  /** Lightest primary surface color. */
  PRIMARY_200: HexColor;
  /** Light primary surface color. */
  PRIMARY_300: HexColor;
  /** Primary border and focus color. */
  PRIMARY_400: HexColor;
  /** Primary interaction color. */
  PRIMARY_500: HexColor;
  /** Mid-tone primary color. */
  PRIMARY_600: HexColor;
  /** Dark primary surface color. */
  PRIMARY_700: HexColor;
  /** Darkest primary color. */
  PRIMARY_800: HexColor;
  /** Default foreground text color. */
  BLACK_TEXT_COLOR: HexColor;
  /** Main application background color. */
  BACKGROUND_COLOR: HexColor;
  /** Responsive breakpoint used by component styles. */
  MOBILE_WIDTH: `${number}px`;
  /** Bright accent colors intended for use on dark backgrounds. */
  RAINBOW: {
    RED: HexColor;
    ORANGE: HexColor;
    YELLOW: HexColor;
    GREEN: HexColor;
    BLUE: HexColor;
  };
  /** Rainbow accent colors with translucent alpha values. */
  TRANSLUCENT: {
    RED1: HslaColor;
    RED2: HslaColor;
    ORANGE1: HslaColor;
    ORANGE2: HslaColor;
    YELLOW1: HslaColor;
    YELLOW2: HslaColor;
    GREEN1: HslaColor;
    GREEN2: HslaColor;
    BLUE1: HslaColor;
    BLUE2: HslaColor;
  };
  BOX_SHADOW: {
    ELEVATION_1: string;
    ELEVATION_2: string;
    ELEVATION_3: string;
    ELEVATION_4: string;
    ELEVATION_5: string;
    ELEVATION_8: string;
  };
};

const theme = {
  PRIMARY_200: "#edf2fb",
  PRIMARY_300: "#e2eafc",
  PRIMARY_400: "#d7e3fc",
  PRIMARY_500: "#ccdbfd",
  PRIMARY_600: "#c1d3fe",
  PRIMARY_700: "#b6ccfe",
  PRIMARY_800: "#abc4ff",
  BLACK_TEXT_COLOR: "#000066",
  BACKGROUND_COLOR: "#001852",
  MOBILE_WIDTH: "1020px",
  // Sunny Bliss: good on black
  RAINBOW: {
    RED: "#ff5714",
    ORANGE: "#ffb800",
    YELLOW: "#e4ff1a",
    GREEN: "#6eeb83",
    BLUE: "#1be7ff",
  },
  TRANSLUCENT: {
    RED1: "hsla(17.11, 100%, 53.92%, 0.8)",
    RED2: "hsla(17.11, 100%, 53.92%, 0.6)",
    ORANGE1: "hsla(43.29, 100%, 50%, 0.8)",
    ORANGE2: "hsla(43.29, 100%, 50%, 0.6)",
    YELLOW1: "hsla(67.07, 100%, 55.1%, 0.8)",
    YELLOW2: "hsla(67.07, 100%, 55.1%, 0.6)",
    GREEN1: "hsla(130.08, 75.76%, 67.65%, 0.8)",
    GREEN2: "hsla(130.08, 75.76%, 67.65%, 0.6)",
    BLUE1: "hsla(186.32, 100%, 55.29%, 0.8)",
    BLUE2: "hsla(186.32, 100%, 55.29%, 0.6)",
  },
  // https://www.joshwcomeau.com/css/designing-shadows/
  BOX_SHADOW: {
    ELEVATION_1: "0.8px 1.6px 1.6px hsl(0deg 0% 0% / 0.48)",
    ELEVATION_2: "1.6px 3.2px 3.2px hsl(0deg 0% 0% / 0.45)",
    ELEVATION_3: "2.4px 4.8px 4.8px hsl(0deg 0% 0% / 0.43)",
    ELEVATION_4: "3.2px 6.4px 6.4px hsl(0deg 0% 0% / 0.40)",
    ELEVATION_5: "4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)",
    ELEVATION_8: "6.5px 13.0px 13.0px hsl(0deg 0% 0% / 0.30)",
    ELEVATION_NAV: "8.0px 16.0px 16.0px hsl(0deg 0% 0% / 0.25)",
  },
} as const satisfies Theme;

export const COLOR_OPTIONS = [
  "ruby",
  "gray",
  "gold",
  "bronze",
  "brown",
  "yellow",
  "amber",
  "orange",
  "tomato",
  "red",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "lime",
  "mint",
  "sky",
] as const;

export type COLOR_OPTIONS = (typeof COLOR_OPTIONS)[number] | undefined;

type ColorOption = Exclude<COLOR_OPTIONS, undefined>;

const BACKGROUND_RGB = {
  ruby: [255, 185, 195],
  gray: [225, 225, 225],
  gold: [255, 235, 165],
  bronze: [230, 195, 160],
  brown: [220, 195, 175],
  yellow: [255, 255, 175],
  amber: [255, 225, 165],
  orange: [255, 205, 165],
  tomato: [255, 185, 165],
  red: [255, 185, 185],
  crimson: [255, 185, 205],
  pink: [255, 195, 220],
  plum: [235, 195, 235],
  purple: [220, 200, 245],
  violet: [220, 205, 255],
  iris: [205, 210, 255],
  indigo: [195, 205, 255],
  blue: [185, 220, 255],
  cyan: [180, 240, 250],
  teal: [180, 230, 225],
  jade: [185, 235, 210],
  green: [190, 235, 195],
  grass: [215, 245, 180],
  lime: [230, 250, 170],
  mint: [195, 245, 230],
  sky: [195, 230, 255],
} as const satisfies Record<ColorOption, readonly [number, number, number]>;

export const getBackgroundForColor = (
  color: string | null | undefined,
  opacity = 0.6,
): string => {
  if (!color || !Object.hasOwn(BACKGROUND_RGB, color)) {
    return "rgba(0, 0, 0, 0)";
  }
  const [red, green, blue] = BACKGROUND_RGB[color as ColorOption];
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

export { theme };
