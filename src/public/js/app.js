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
  boardWidth: 240, // chiều dài của game_board
  boardHeight: 100, // chiều dọc của game_board
  playerCount: 1, // số lượng rắn
  speedFactor: 1, // hệ tốc độ di chuyển của các con rắn
  difficulty: "easy", // cấp độ chơi
  isPlaying: false, // trạng thái game có đang start hay không?
  snakesFindingBait: [], // rắn đang ở trạng thái tìm mồi
  snakesDigesting: [], // trạng thái tiêu hóa của các snake
  digestingTimers: [], // thời gian chờ tiêu hỏa của từng snake
  theme: "",
  pressedKeys: [],
  coefficient: {
    last: 0,
    current: 0,
  },
  elapsedSeconds: 0,
  matchHistory: [],
  snakeLengths: [],
  specialKey: KEYS.error,
  snakes: [],
  elapsedMs: 0,
  playerStats: {
    names: [],
    addresses: [],
    scores: [],
    playTimes: [],
    playDates: [],
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
game.boardWidth = width;
game.boardHeight = height;

const initSnake = () => {
  game.snakes = [];
  for (let i = 0; i < game.playerCount; i++) {
    game.snakes[i] = [];
    for (let j = 0; j < game.snakeLengths[i].current; j++) {
      dot.color = game.snakesDigesting[i] ? bait.color : getRandomColor();
      game.snakes[i][j] = {
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
    for (let i in game.playerCount) {
      const { up, down, left, right } = KEYS[`player${i + 1}`];
      if (game.pressedKeys[i].current === up || game.pressedKeys[i].current === down) {
        Oy = dot.y + 0.5 * dot.radius;
      } else if (game.pressedKeys[i].current === left || game.pressedKeys[i].current === right) {
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
  bait.x = getRandomInt(game.boardWidth / 10) * 10;
  bait.y = getRandomInt(game.boardHeight / 10) * 10;
  // nếu bait khởi tạo đụng thành trái
  if (bait.x < bait.radius) {
    bait.x += bait.radius;
  }
  // nếu bait khởi tạo đụng thành phải
  if (bait.x > game.boardWidth) {
    bait.x -= bait.radius;
  }
  // nếu bait khởi tạo đụng thành trên
  if (bait.y < bait.radius) {
    bait.y += bait.radius;
  }
  // nếu bait khởi tạo đụng thành dưới
  if (bait.y > game.boardHeight) {
    bait.y -= bait.radius;
  }
  // vị trí mồi phải nằm ngoài các thân rắn
  for (let i = 0; i < game.playerCount; i++) {
    for (let j = 0; j < game.snakeLengths[i].current; j++) {
      if (game.snakes[i][j].x === bait.x && game.snakes[i][j].y === bait.y) {
        // get vị trí lại cho dot
        bait.x = getRandomInt(game.boardWidth / 10) * 10;
        bait.y = getRandomInt(game.boardHeight / 10) * 10;
      }
    }
  }
};

const drawSnake = () => {
  for (let i = 0; i < game.playerCount; i++) {
    for (let j = 0; j < game.snakeLengths[i].current; j++) {
      drawDot(game.snakes[i][j]);
    }
    game.snakes[i][0].color = bait.color;
    drawDot(game.snakes[i][0], "circle");
  }
};

const updateSnake = (i) => {
  for (let j = 0; j < game.snakeLengths[i].last; j++) {
    game.snakes[i][j].radius = dot.radius;
  }
  for (let j = game.snakeLengths[i].last; j < game.snakeLengths[i].current; j++) {
    game.snakes[i][j] = {
      x: 100 - 2 * j * dot.radius,
      y: 100 + 50 * i,
      radius: dot.radius,
      score: 10,
      color: "",
      head: false,
    };
  }
  for (let j = 0; j < game.snakeLengths[i].current; j++) {
    dot.color = game.snakesDigesting[i] ? bait.color : getRandomColor();
    game.snakes[i][j].color = `${dot.color}`;
  }
  game.snakeLengths[i].last = game.snakeLengths[i].current;
};

const handleWay = () => {
  for (let i = 0; i < game.playerCount; i++) {
    for (let j = game.snakeLengths[i].current - 1; j > 0; j--) {
      game.snakes[i][j].x = game.snakes[i][j - 1].x;
      game.snakes[i][j].y = game.snakes[i][j - 1].y;
    }
    const radius = game.snakes[i][0].radius;
    const playerKeys = KEYS[`player${i + 1}`];
    const currentPlayerKey = game.pressedKeys[i].current;
    if (currentPlayerKey === playerKeys.up) {
      game.snakes[i][0].y -= radius;
    } else if (currentPlayerKey === playerKeys.down) {
      game.snakes[i][0].y += radius;
    } else if (currentPlayerKey === playerKeys.left) {
      game.snakes[i][0].x -= radius;
    } else if (currentPlayerKey === playerKeys.right) {
      game.snakes[i][0].x += radius;
    }
  }
};

const timePlay = APP_DOM.timePlayEl;
const handleTime = () => {
  game.elapsedSeconds++;
  timePlay.innerText = `${convertTime(game.elapsedSeconds)}`;
};
const initTime = () => {
  clearInterval(game.elapsedMs);
  game.elapsedSeconds = 0;
  timePlay.innerText = `00:00:00`;
};

const updateScore = (i, fa = false) => {
  APP_DOM.scorePlayerEls[i].innerText = `Player ${i + 1}: ${game.playerStats.scores[i]}`;
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
  game.digestingTimers[i] = bait.coefficient;
  game.snakesDigesting[i] = true;
  game.snakesFindingBait[i] = true;
  game.snakeLengths[i].current += bait.coefficient;
  game.playerStats.scores[i] += bait.coefficient * dot.score;
  game.digestingTimers[i] = bait.coefficient;
  game.coefficient.current = Math.floor(game.playerStats.scores[i] / 100);
  if (game.coefficient.current > game.coefficient.last) {
    dot.radius += 2;
    bait.radius += 2;
    game.coefficient.last = game.coefficient.current;
  }

  if (game.playerCount === 1) {
    updateScore(i, "fa");
  } else {
    updateScore(i);
  }
  updateSnake(i);
};

const collisionWall = (current_snake) => {
  const head = game.snakes[current_snake][0];
  if (head.x <= 0 || head.x >= game.boardWidth || head.y <= 0 || head.y >= game.boardHeight) {
    return true;
  }
  return false;
};

const collisionOtherSnake = (snakeIndex) => {
  if (snakeIndex === 0) return false;
  for (let i = 0; i < game.playerCount; i++) {
    if (i !== snakeIndex) {
      for (let j = 0; j < game.snakeLengths[i].current; j++) {
        if (
          game.snakes[snakeIndex][0].x === game.snakes[i][j].x &&
          game.snakes[snakeIndex][0].y === game.snakes[i][j].y
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
  for (let i = 0; i < game.playerCount; i++) {
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
  for (let i = 0; i < game.playerCount; i++) {
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
  for (let i = 0; i < game.playerCount; i++) {
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
  for (let i = 0; i < game.playerCount; i++) {
    game.playerStats.scores[i] = 0;
    game.playerStats.playTimes[i] = "00:00:00";
    game.playerStats.playDates[i] = new Date().toLocaleString();
  }
};

const lose = (lose_player) => {
  let timePlay = convertTime(game.elapsedSeconds);
  let username = APP_DOM.usernameLocalEl;

  const saved = {
    name: `${username.innerText}`,
    score: `${game.playerStats.scores[0]}`,
    time: `${timePlay}`,
    date: `${game.playerStats.playDates[0]}`,
  };
  localStorage["match"] = JSON.stringify(saved);

  const loserBox = APP_DOM.loserBoxEl;
  loserBox.innerHTML = "<h1>Oh không, bạn đã chết!</h1>";
  choseAudio("lose");

  APP_DOM.playButtonEl.innerHTML = "Start";
  if (game.playerCount === 1) {
    showBox(4);
    let item = document.createElement("h2");
    item.classList.add("lose_player");
    item.innerHTML = `Player ${lose_player}.You got ${
      game.playerStats.scores[lose_player - 1]
    } points. Come on, let's play again!!!`;
    loserBox.appendChild(item);
    game.matchHistory[0].score.push(game.playerStats.scores[0]);
    game.matchHistory[0].date_play.push(`${game.playerStats.playDates[0]}`);
    game.matchHistory[0].time_play.push(`${timePlay}`);
    initGame();
    console.log(game.matchHistory);
  } else if (game.playerCount === 2) {
    showBox(4);
    let win_player = 0;
    for (let i = 0; i < game.playerCount; i++) {
      game.matchHistory[i].score.push(game.playerStats.scores[i]);
      game.matchHistory[i].date_play.push(`${game.playerStats.playDates[i]}`);
      game.matchHistory[i].time_play.push(`${timePlay}`);
      if (i + 1 !== lose_player) {
        win_player = i + 1;
      }
      let item = document.createElement("h2");
      item.classList.add("lose_player");
      item.innerText = `Player ${i + 1}.You got ${game.playerStats.scores[i]} points. Come on, let's play again!!!`;
      loserBox.appendChild(item);
    }
  }
};

const initGame = () => {
  game.snakeLengths = [];
  game.pressedKeys = [];
  game.specialKey = KEYS.error;
  game.speedFactor = 1;
  for (let i = 0; i < game.playerCount; i++) {
    if (game.matchHistory.length === 0) {
      let obj = {
        name: "Guest",
        score: [],
        time_play: [],
        date_play: [],
      };
      game.matchHistory.push(obj);
    }
    game.snakeLengths[i] = {
      current: 10,
      last: 10,
    };
    game.pressedKeys[i] = {
      current: KEYS[`player${i + 1}`].right,
      last: KEYS[`player${i + 1}`].right,
    };
    game.playerStats.scores[i] = 0;
    game.snakesFindingBait[i] = true;
    game.snakesDigesting[i] = false;
    game.digestingTimers[i] = 0;
    updateScore(i);
  }
  dot.score = 10;
  initSnake();
  game.elapsedSeconds = 0;
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
    if (1 <= index && index <= game.playerCount) {
      game.pressedKeys[index - 1].current = keyValid(game.pressedKeys[index - 1].last, new_key);
      game.pressedKeys[index - 1].last = game.pressedKeys[index - 1].current;
    } else if (index === 102) {
      game.specialKey = new_key;
    }
  };
  handleWay();
  drawSnake();
  for (let i = 0; i < game.playerCount; i++) {
    if (game.digestingTimers[i] === 0) {
      updateSnake(i);
      game.snakesDigesting[i] = false;
    }
    if (game.snakesFindingBait[i]) {
      createBait();
      game.snakesFindingBait[i] = false;
    }
    drawDot(bait, "circle");
    const head = game.snakes[i][0];
    if (
      head.x >= bait.x - bait.radius &&
      head.x <= bait.x + bait.radius &&
      head.y >= bait.y - bait.radius &&
      head.y <= bait.y + bait.radius
    ) {
      if (game.digestingTimers[i]) {
        game.isPlaying = false;
        lose(i + 1);
      } else if (!game.digestingTimers[i]) {
        collisionBait(i);
        const waitChangeColor = game.digestingTimers[i] * 1000;
        setTimeout(() => {
          game.digestingTimers[i] = 0;
        }, waitChangeColor);
      }
    }
    if (collisionWall(i)) {
      game.isPlaying = false;
      lose(i + 1);
    }
    if (collisionOtherSnake(i)) {
      game.isPlaying = false;
      lose(i + 1);
    }
  }
  if (game.isPlaying) {
    const speed = game.speedFactor * 100;
    setTimeout(() => {
      requestAnimationFrame(play);
    }, speed);
  }
};

const buttonPlay = APP_DOM.playButtonEl;
buttonPlay.onclick = () => {
  if (buttonPlay.innerText === "Start" && !game.isPlaying) {
    buttonPlay.innerHTML = `${APP_ICON.GAME_PAUSE} Pause`;
    game.isPlaying = true;
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
  if (buttonPlay.innerText === "Start" && !game.isPlaying) {
    buttonPlay.innerHTML = `${APP_ICON.GAME_PAUSE} Pause`;
    game.isPlaying = true;
    showBox(1);
    getInfoPlayer();
    initGame();
    game.elapsedMs = setInterval(handleTime, 1000);
    play();
    choseAudio("play");
  } else if (buttonPlay.innerHTML == `${APP_ICON.GAME_PAUSE} Pause` && game.isPlaying) {
    buttonPlay.innerHTML = `${APP_ICON.GAME_PLAY} Continue`;
    game.isPlaying = false;
  } else if (buttonPlay.innerHTML == `${APP_ICON.GAME_PLAY} Continue` && !game.isPlaying) {
    buttonPlay.innerHTML = `${APP_ICON.GAME_PAUSE} Pause`;
    game.isPlaying = true;
    requestAnimationFrame(play);
  }
};

APP_DOM.restartGameEls.forEach((element) => {
  element.addEventListener("click", () => {
    showBox(1);
    buttonPlay.innerHTML = `${APP_ICON.GAME_PAUSE} Pause`;
    game.isPlaying = true;
    getInfoPlayer();
    initGame();
    game.elapsedMs = setInterval(handleTime, 1000);
    play();
    choseAudio("play");
  });
});

APP_DOM.playGameButtonEl.addEventListener("click", () => {
  showBox(1);
  buttonPlay.innerHTML = `${APP_ICON.GAME_PAUSE} Pause`;
  game.isPlaying = true;
  getInfoPlayer();
  initGame();
  play();
  game.elapsedMs = setInterval(handleTime, 1000);
  choseAudio("play");
});

const showHistoryMatch = () => {
  let data = "";
  const length = game.matchHistory[0].score.length;
  for (let i = 0; i < length; i++) {
    let score = game.matchHistory[0].score[i];
    let time = game.matchHistory[0].time_play[i];
    let day = game.matchHistory[0].date_play[i];
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
