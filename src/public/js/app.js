import {
  ateBait,
  changeLevel,
  changeSpeed,
  changeStatePlayer,
  changeTheme,
  choseAudio,
  showBox,
  tutorial,
} from "./control.js";
import { Bait } from "./models/bait.model.js";
import { Dot } from "./models/dot.model.js";
import { callApiGetMatchHistory } from "./shared/api.js";
import { KEYS } from "./shared/constant.js";
import { APP_DOM } from "./shared/dom.js";
import { APP_ICON } from "./shared/icon.js";
import { convertTime, getMountedSize, getRandomColor, getRandomInt } from "./shared/utils.js";

export const game = {
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
  key_code: [],
  coefficient: {
    last: 0,
    current: 0,
  },
  sum_seconds: 0,
  history_match: [],
  length_snake: [],
  special_key: KEYS.error,
  listSnakes: [],
  timeXX: 0,
  playerState: {
    name: [],
    address: [],
    score: [],
    time_play: [],
    day_play: [],
  },
};


const dot = new Dot();
const bait = new Bait();

const canvas = APP_DOM.canvasEl;
const ctx = canvas.getContext("2d");
const { width, height } = getMountedSize({
  widthName: "--canvas-width",
  heightName: "--canvas-height",
});
canvas.width = width;
canvas.height = height;
game.width = width;
game.height = height;

const initSnake = () => {
  game.listSnakes = [];
  for (let i = 0; i < game.count_player; i++) {
    game.listSnakes[i] = [];
    for (let j = 0; j < game.length_snake[i].current; j++) {
      dot.color = game.is_digesting[i] ? bait.color : getRandomColor();
      game.listSnakes[i][j] = {
        x: 100 - j * dot.radius,
        y: 100 + 50 * i,
        radius: dot.radius,
        score: 10,
        color: dot.color,
        head: false,
      };
    }
  }
};

const drawDot = (dot, index = false) => {
  ctx.beginPath();
  if (index === false) {
    ctx.fillRect(dot.x - 5, dot.y - 5, dot.radius, dot.radius);
    ctx.strokeStyle = game.theme === "dark" ? "white" : "black";
    ctx.lineWidth = Math.max(1, Math.floor(dot.radius * 0.3));
    ctx.strokeRect(dot.x - 5, dot.y - 5, dot.radius, dot.radius);
  } else if (index === "circle") {
    let Oy = dot.y;
    let Ox = dot.x;
    for (let i in game.count_player) {
      const { up, down, left, right } = KEYS[`player${i + 1}`];
      if (game.key_code[i].current === up || game.key_code[i].current === down) {
        Oy = dot.y + 0.5 * dot.radius;
      } else if (game.key_code[i].current === left || game.key_code[i].current === right) {
        Ox = dot.x + 0.5 * dot.radius;
      }
    }
    ctx.arc(Ox, Oy, dot.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = dot.color;
  ctx.fill();
  ctx.closePath();
};

const createBait = () => {
  bait.color = `${getRandomColor()}`;
  bait.coefficient = 1;
  bait.radius = 10;
  let special = getRandomInt(10);
  if (special === 0) {
    bait.radius = 30;
    bait.color = "gold";
    bait.coefficient = 10;
  }
  bait.x = getRandomInt(game.width / 10) * 10;
  bait.y = getRandomInt(game.height / 10) * 10;
  // nếu bait khởi tạo đụng thành trái
  if (bait.x < bait.radius) {
    bait.x += bait.radius;
  }
  // nếu bait khởi tạo đụng thành phải
  if (bait.x > game.width) {
    bait.x -= bait.radius;
  }
  // nếu bait khởi tạo đụng thành trên
  if (bait.y < bait.radius) {
    bait.y += bait.radius;
  }
  // nếu bait khởi tạo đụng thành dưới
  if (bait.y > game.height) {
    bait.y -= bait.radius;
  }
  // vị trí mồi phải nằm ngoài các thân rắn
  for (let i = 0; i < game.count_player; i++) {
    for (let j = 0; j < game.length_snake[i].current; j++) {
      if (game.listSnakes[i][j].x === bait.x && game.listSnakes[i][j].y === bait.y) {
        // get vị trí lại cho dot
        bait.x = getRandomInt(game.width / 10) * 10;
        bait.y = getRandomInt(game.height / 10) * 10;
      }
    }
  }
};

const drawSnake = () => {
  for (let i = 0; i < game.count_player; i++) {
    for (let j = 0; j < game.length_snake[i].current; j++) {
      drawDot(game.listSnakes[i][j]);
    }
    game.listSnakes[i][0].color = bait.color;
    drawDot(game.listSnakes[i][0], "circle");
  }
};

const updateSnake = (i) => {
  for (let j = 0; j < game.length_snake[i].last; j++) {
    game.listSnakes[i][j].radius = dot.radius;
  }
  for (let j = game.length_snake[i].last; j < game.length_snake[i].current; j++) {
    game.listSnakes[i][j] = {
      x: 100 - 2 * j * dot.radius,
      y: 100 + 50 * i,
      radius: dot.radius,
      score: 10,
      color: "",
      head: false,
    };
  }
  for (let j = 0; j < game.length_snake[i].current; j++) {
    dot.color = game.is_digesting[i] ? bait.color : getRandomColor();
    game.listSnakes[i][j].color = `${dot.color}`;
  }
  game.length_snake[i].last = game.length_snake[i].current;
};

const handleWay = () => {
  for (let i = 0; i < game.count_player; i++) {
    for (let j = game.length_snake[i].current - 1; j > 0; j--) {
      game.listSnakes[i][j].x = game.listSnakes[i][j - 1].x;
      game.listSnakes[i][j].y = game.listSnakes[i][j - 1].y;
    }
    const radius = game.listSnakes[i][0].radius;
    const playerKeys = KEYS[`player${i + 1}`];
    const currentPlayerKey = game.key_code[i].current;
    if (currentPlayerKey === playerKeys.up) {
      game.listSnakes[i][0].y -= radius;
    } else if (currentPlayerKey === playerKeys.down) {
      game.listSnakes[i][0].y += radius;
    } else if (currentPlayerKey === playerKeys.left) {
      game.listSnakes[i][0].x -= radius;
    } else if (currentPlayerKey === playerKeys.right) {
      game.listSnakes[i][0].x += radius;
    }
  }
};

const timePlay = APP_DOM.timePlayEl;
const handleTime = () => {
  game.sum_seconds++;
  timePlay.innerText = `${convertTime(game.sum_seconds)}`;
};
const initTime = () => {
  clearInterval(game.timeXX);
  game.sum_seconds = 0;
  timePlay.innerText = `00:00:00`;
};

const updateScore = (i, fa = false) => {
  APP_DOM.scorePlayerEls[i].innerText = `Player ${i + 1}: ${game.playerState.score[i]}`;
  if (fa && APP_DOM.scorePlayerEls[1]) {
    APP_DOM.scorePlayerEls[1].innerHTML = ``;
  }
};

const collisionBait = (i) => {
  if (bait.radius === 30) {
    ateBait("bait_special");
  } else {
    ateBait("bait");
  }
  game.wait_digesting[i] = bait.coefficient;
  game.is_digesting[i] = true;
  game.is_find_bait[i] = true;
  game.length_snake[i].current += bait.coefficient;
  game.playerState.score[i] += bait.coefficient * dot.score;
  game.wait_digesting[i] = bait.coefficient;
  game.coefficient.current = Math.floor(game.playerState.score[i] / 100);
  if (game.coefficient.current > game.coefficient.last) {
    dot.radius += 2;
    bait.radius += 2;
    game.coefficient.last = game.coefficient.current;
  }

  if (game.count_player === 1) {
    updateScore(i, "fa");
  } else {
    updateScore(i);
  }
  updateSnake(i);
};

const collisionWall = (current_snake) => {
  const head = game.listSnakes[current_snake][0];
  if (head.x <= 0 || head.x >= game.width || head.y <= 0 || head.y >= game.height) {
    return true;
  }
  return false;
};

const collisionOtherSnake = (snakeIndex) => {
  if (snakeIndex === 0) return false;
  for (let i = 0; i < game.count_player; i++) {
    if (i !== snakeIndex) {
      for (let j = 0; j < game.length_snake[i].current; j++) {
        if (
          game.listSnakes[snakeIndex][0].x === game.listSnakes[i][j].x &&
          game.listSnakes[snakeIndex][0].y === game.listSnakes[i][j].y
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

const keyInput = (e) => {
  const keyCode = e.keyCode;
  for (let i = 0; i < game.count_player; i++) {
    const { left, right, up, down } = KEYS[`player${i + 1}`];
    if ([left, right, up, down].includes(keyCode)) {
      return keyCode;
    }
    if ([KEYS.space, KEYS.esc].includes(keyCode)) {
      return keyCode;
    }
  }
  return KEYS.error;
};

const partition = (keyCode) => {
  for (let i = 0; i < game.count_player; i++) {
    const { left, right, up, down } = KEYS[`player${i + 1}`];
    if ([left, right, up, down].includes(keyCode)) {
      return i + 1;
    }
    if ([KEYS.space, KEYS.esc].includes(keyCode)) {
      return 102;
    }
  }
};

const keyValid = (oldKey, newKey) => {
  for (let i = 0; i < game.count_player; i++) {
    const { up, down, left, right } = KEYS[`player${i + 1}`];
    if (
      (newKey === up && oldKey === down) ||
      (newKey === down && oldKey === up) ||
      (newKey === left && oldKey === right) ||
      (newKey === right && oldKey === left)
    ) {
      return oldKey;
    }
  }
  return newKey;
};

const getInfoPlayer = () => {
  for (let i = 0; i < game.count_player; i++) {
    game.playerState.score[i] = 0;
    game.playerState.time_play[i] = "00:00:00";
    game.playerState.day_play[i] = new Date().toLocaleString();
  }
};

const lose = (lose_player) => {
  let timePlay = convertTime(game.sum_seconds);
  let username = APP_DOM.usernameLocalEl;

  const saved = {
    name: `${username.innerText}`,
    score: `${game.playerState.score[0]}`,
    time: `${timePlay}`,
    date: `${game.playerState.day_play[0]}`,
  };
  localStorage["match"] = JSON.stringify(saved);

  const loserBox = APP_DOM.loserBoxEl;
  loserBox.innerHTML = "<h1>Oh không, bạn đã chết!</h1>";
  choseAudio("lose");

  APP_DOM.playButtonEl.innerHTML = "Start";
  if (game.count_player === 1) {
    showBox(4);
    let item = document.createElement("h2");
    item.classList.add("lose_player");
    item.innerHTML = `Player ${lose_player}.You got ${
      game.playerState.score[lose_player - 1]
    } points. Come on, let's play again!!!`;
    loserBox.appendChild(item);
    game.history_match[0].score.push(game.playerState.score[0]);
    game.history_match[0].date_play.push(`${game.playerState.day_play[0]}`);
    game.history_match[0].time_play.push(`${timePlay}`);
    initGame();
    console.log(game.history_match);
  } else if (game.count_player === 2) {
    showBox(4);
    let win_player = 0;
    for (let i = 0; i < game.count_player; i++) {
      game.history_match[i].score.push(game.playerState.score[i]);
      game.history_match[i].date_play.push(`${game.playerState.day_play[i]}`);
      game.history_match[i].time_play.push(`${timePlay}`);
      if (i + 1 !== lose_player) {
        win_player = i + 1;
      }
      let item = document.createElement("h2");
      item.classList.add("lose_player");
      item.innerText = `Player ${i + 1}.You got ${game.playerState.score[i]} points. Come on, let's play again!!!`;
      loserBox.appendChild(item);
    }
  }
};

const initGame = () => {
  game.length_snake = [];
  game.key_code = [];
  game.special_key = KEYS.error;
  game.speedPlay = 1;
  for (let i = 0; i < game.count_player; i++) {
    if (game.history_match.length === 0) {
      let obj = {
        name: "Guest",
        score: [],
        time_play: [],
        date_play: [],
      };
      game.history_match.push(obj);
    }
    game.length_snake[i] = {
      current: 10,
      last: 10,
    };
    game.key_code[i] = {
      current: KEYS[`player${i + 1}`].right,
      last: KEYS[`player${i + 1}`].right,
    };
    game.playerState.score[i] = 0;
    game.is_find_bait[i] = true;
    game.is_digesting[i] = false;
    game.wait_digesting[i] = 0;
    updateScore(i);
  }
  dot.score = 10;
  initSnake();
  game.sum_seconds = 0;
  initTime();
  game.coefficient.current = 0;
  game.coefficient.last = 0;
  dot.radius = 10;
  bait.radius = 10;
};

const play = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.onkeydown = (e) => {
    const new_key = keyInput(e);
    const index = partition(new_key);
    if (1 <= index && index <= game.count_player) {
      game.key_code[index - 1].current = keyValid(game.key_code[index - 1].last, new_key);
      game.key_code[index - 1].last = game.key_code[index - 1].current;
    } else if (index === 102) {
      game.special_key = new_key;
    }
  };
  handleWay();
  drawSnake();
  for (let i = 0; i < game.count_player; i++) {
    if (game.wait_digesting[i] === 0) {
      updateSnake(i);
      game.is_digesting[i] = false;
    }
    if (game.is_find_bait[i]) {
      createBait();
      game.is_find_bait[i] = false;
    }
    drawDot(bait, "circle");
    const head = game.listSnakes[i][0];
    if (
      head.x >= bait.x - bait.radius &&
      head.x <= bait.x + bait.radius &&
      head.y >= bait.y - bait.radius &&
      head.y <= bait.y + bait.radius
    ) {
      if (game.wait_digesting[i]) {
        game.is_playing = false;
        lose(i + 1);
      } else if (!game.wait_digesting[i]) {
        collisionBait(i);
        const waitChangeColor = game.wait_digesting[i] * 1000;
        setTimeout(() => {
          game.wait_digesting[i] = 0;
        }, waitChangeColor);
      }
    }
    if (collisionWall(i)) {
      game.is_playing = false;
      lose(i + 1);
    }
    if (collisionOtherSnake(i)) {
      game.is_playing = false;
      lose(i + 1);
    }
  }
  if (game.is_playing) {
    const speed = game.speedPlay * 100;
    setTimeout(() => {
      requestAnimationFrame(play);
    }, speed);
  }
};

const buttonPlay = APP_DOM.playButtonEl;
buttonPlay.onclick = () => {
  if (buttonPlay.innerText === "Start" && !game.is_playing) {
    buttonPlay.innerHTML = `${APP_ICON.GAME_PAUSE} Pause`;
    game.is_playing = true;
    getInfoPlayer();
    showBox(1);
    initGame();
    play();
    choseAudio("play");
  }
};

window.onkeydown = (e) => {
  const key = keyInput(e);
  if (key !== KEYS.space) return;
  if (buttonPlay.innerText === "Start" && !game.is_playing) {
    buttonPlay.innerHTML = `${APP_ICON.GAME_PAUSE} Pause`;
    game.is_playing = true;
    showBox(1);
    getInfoPlayer();
    initGame();
    game.timeXX = setInterval(handleTime, 1000);
    play();
    choseAudio("play");
  } else if (buttonPlay.innerHTML == `${APP_ICON.GAME_PAUSE} Pause` && game.is_playing) {
    buttonPlay.innerHTML = `${APP_ICON.GAME_PLAY} Continue`;
    game.is_playing = false;
  } else if (buttonPlay.innerHTML == `${APP_ICON.GAME_PLAY} Continue` && !game.is_playing) {
    buttonPlay.innerHTML = `${APP_ICON.GAME_PAUSE} Pause`;
    game.is_playing = true;
    requestAnimationFrame(play);
  }
};

APP_DOM.restartGameEls.forEach((element) => {
  element.addEventListener("click", () => {
    showBox(1);
    buttonPlay.innerHTML = `${APP_ICON.GAME_PAUSE} Pause`;
    game.is_playing = true;
    getInfoPlayer();
    initGame();
    game.timeXX = setInterval(handleTime, 1000);
    play();
    choseAudio("play");
  });
});

APP_DOM.playGameButtonEl.addEventListener("click", () => {
  showBox(1);
  buttonPlay.innerHTML = `${APP_ICON.GAME_PAUSE} Pause`;
  game.is_playing = true;
  getInfoPlayer();
  initGame();
  play();
  game.timeXX = setInterval(handleTime, 1000);
  choseAudio("play");
});

const showHistoryMatch = () => {
  let data = "";
  const length = game.history_match[0].score.length;
  for (let i = 0; i < length; i++) {
    let score = game.history_match[0].score[i];
    let time = game.history_match[0].time_play[i];
    let day = game.history_match[0].date_play[i];
    data += `
         <tr class="history_item">
            <td>${i + 1}</td>
            <td>${day}</td>
            <td>${score}</td>
            <td>${time}</td>
         </tr>
      `;
  }
  APP_DOM.matchLocalBoxEl.innerHTML = data;
  showBox(5);
};
APP_DOM.viewHistoryEls.forEach((element) => {
  element.addEventListener("click", () => {
    showHistoryMatch();
    choseAudio("end");
  });
});

const getAllMatch = async () => {
  let matches = "";

  const data = await callApiGetMatchHistory({
    name: `${APP_DOM.usernameLocalEl.innerText}`,
  });
  for (let match of data.matches) {
    matches += `
               <tr class="history_item">
                  <td>${match.date}</td>
                  <td>${match.name}</td>
                  <td>${match.score}</td>
                  <td>${match.time}</td>
               </tr>
            `;
  }
  APP_DOM.matchServerBoxEl.innerHTML = matches;
};

APP_DOM.viewInfoPlayerEl?.addEventListener("click", async () => {
  await getAllMatch();
  showBox(3);
});
APP_DOM.tutorialButtonEl?.addEventListener("click", tutorial);

const defaultSetting = () => {
  changeTheme("dark");
  changeLevel("easy");
  changeStatePlayer(1);
  changeSpeed(1);
  showBox(2);
};

defaultSetting();
