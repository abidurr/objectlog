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
};

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

export { theme };
