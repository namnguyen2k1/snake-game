export const KEYS = {
  player1: {
    left: 37, // ⬅️
    right: 39, // ➡️
    up: 38, // ⬆️
    down: 40, // ⬇️
  },
  player2: {
    left: 65, // a
    right: 68, // d
    up: 87, // w
    down: 83, // s
  },
  space: 32,
  esc: 27,
  error: -1000,
};

export const theme = {
  dark: {
    primaryColor: "#325b97",
    secondaryColor: "#000013",
    fontColor: "#e1e1ff",
    bgColor: "#000013",
    headingColor: "#818cab",
  },
  light: {
    primaryColor: "#d9eee1",
    secondaryColor: "#d9eee1",
    fontColor: "black",
    bgColor: "#218c74",
    headingColor: "#064e48",
  },
};

export const listColor = [
  "firebrick",
  "blue",
  "green",
  "yellow",
  "orange",
  "violet",
  "lightsalmon",
  "khaki",
  "tan",
  "sandybrown",
  "olive",
];

export const AUDIO_TYPE = {
  home: '/audio/home.mp3',
  playing: '/audio/playing.mp3',
  history: '/audio/history.mp3',
  dead: '/audio/dead.mp3',
  ateBait: '/audio/ate-bait.mp3',
  ateSpecialBait: '/audio/ate-special-bait.mp3',
}