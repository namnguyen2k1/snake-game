const game = {
  width: 240, // chiều dài của game_board
  height: 100, // chiều dọc của game_board
  count_player: 1, // số lượng rắn
  speedPlay: 1, // hệ tốc độ di chuyển của các con rắn
  levelPlaying: "easy", // cấp độ chơi
  is_playing: false, // trạng thái game có đang start hay không?
  is_find_bait: [], // rắn đang ở trạng thái tìm mồi
  is_digesting: [], // trạng thái tiêu hóa của các snake
  wait_digesting: [], // thời gian chờ tiêu hỏa của từng snake
  theme: "",
};

// thông số từng dot trong snake
const dot_snake = {
  x: 20, // tọa độ 0x
  y: 20, // tọa độ oy
  radius: 10,
  score: 10,
  color: "green", // color mồi
  head: false,
};

// các thông số liên quan đến mồi
const bait = {
  x: 50, // tọa độ 0x
  y: 20, // tọa độ oy
  radius: 10, // bán kính mồi
  coefficient: 1, // hệ số ăn mồi
  color: "red", // color mồi
};

// hệ sô zoom snake
let coefficient = {
  last: 0,
  current: 0,
};

// thiết lập bộ key cho từng player
const key = [
  {
    // key-code player_1 (các phím mũi tên)
    left: 37,
    right: 39,
    up: 38,
    down: 40,
  },
  {
    // key-code player_2 (các phím a, d, w, s)
    left: 65,
    right: 68,
    up: 87,
    down: 83,
  },
  // ! thêm các bộ key-code mới nếu có cho 3, 4 player
];
// Other key-code
const SPACE = 32;
const ESC = 27;
const ERROR = -1000;

const player = {
  name: [],
  address: [],
  score: [],
  time_play: [],
  day_play: [],
};

const theme = {
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

export { ERROR, ESC, SPACE, bait, coefficient, dot_snake, game, key, player, theme };
