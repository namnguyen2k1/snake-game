import { callApiGetMatchHistory } from "./api.js";
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
import { DOM } from "./dom.js";
import { ICONS } from "./icon.js";
import { convertTime, getMountedSize, getRandomInt, listColor } from "./utils.js";
import { bait, coefficient, dot_snake, ERROR, ESC, game, key, player, SPACE } from "./variable.js";

let length_snake = [];
let snake = [];
let key_code = [];
let history_match = [];
let sum_seconds = 0;
let special_key;
let time = 0;

const canvas = DOM.canvasEl;
const ctx = canvas.getContext("2d");
const { width, height } = getMountedSize({
  widthName: "--canvas-width",
  heightName: "--canvas-height",
});
canvas.width = width;
canvas.height = height;
game.width = canvas.width;
game.height = canvas.height;

const initSnake = () => {
  snake = [];
  for (let i = 0; i < game.count_player; i++) {
    snake[i] = [];
    for (let j = 0; j < length_snake[i].current; j++) {
      dot_snake.color = game.is_digesting[i]
        ? bait.color
        : listColor[getRandomInt(listColor.length)];
      snake[i][j] = {
        x: 100 - j * dot_snake.radius,
        y: 100 + 50 * i,
        radius: dot_snake.radius,
        score: 10,
        color: dot_snake.color,
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
      if (key_code[i].current === key[i].up || key_code[i].current === key[i].up) {
        Oy = dot.y + 0.5 * dot.radius;
      } else if (key_code[i].current === key[i].left || key_code[i].current === key[i].right) {
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
  bait.color = `${listColor[getRandomInt(listColor.length)]}`;
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
    for (let j = 0; j < length_snake[i].current; j++) {
      if (snake[i][j].x === bait.x && snake[i][j].y === bait.y) {
        // get vị trí lại cho dot_snake
        bait.x = getRandomInt(game.width / 10) * 10;
        bait.y = getRandomInt(game.height / 10) * 10;
      }
    }
  }
};

const drawSnake = () => {
  for (let i = 0; i < game.count_player; i++) {
    for (let j = 0; j < length_snake[i].current; j++) {
      drawDot(snake[i][j]);
    }
    snake[i][0].color = bait.color;
    drawDot(snake[i][0], "circle");
  }
};

const updateSnake = (i) => {
  for (let j = 0; j < length_snake[i].last; j++) {
    snake[i][j].radius = dot_snake.radius;
  }
  for (let j = length_snake[i].last; j < length_snake[i].current; j++) {
    snake[i][j] = {
      x: 100 - 2 * j * dot_snake.radius,
      y: 100 + 50 * i,
      radius: dot_snake.radius,
      score: 10,
      color: "",
      head: false,
    };
  }
  for (let j = 0; j < length_snake[i].current; j++) {
    dot_snake.color = game.is_digesting[i] ? bait.color : listColor[getRandomInt(listColor.length)];
    snake[i][j].color = `${dot_snake.color}`;
  }
  length_snake[i].last = length_snake[i].current;
};

const handleWay = () => {
  for (let i = 0; i < game.count_player; i++) {
    for (let j = length_snake[i].current - 1; j > 0; j--) {
      snake[i][j].x = snake[i][j - 1].x;
      snake[i][j].y = snake[i][j - 1].y;
    }
    const radius = snake[i][0].radius;
    if (key_code[i].current === key[i].up) {
      snake[i][0].y -= radius;
    } else if (key_code[i].current === key[i].down) {
      snake[i][0].y += radius;
    } else if (key_code[i].current === key[i].left) {
      snake[i][0].x -= radius;
    } else if (key_code[i].current === key[i].right) {
      snake[i][0].x += radius;
    }
  }
};

const timePlay = DOM.timePlayEl;
const handleTime = () => {
  sum_seconds++;
  timePlay.innerText = `${convertTime(sum_seconds)}`;
};
const initTime = () => {
  clearInterval(time);
  sum_seconds = 0;
  timePlay.innerText = `00:00:00`;
};

const updateScore = (i, fa = false) => {
  DOM.scorePlayerEls[i].innerText = `Player ${i + 1}: ${player.score[i]}`;
  if (fa && DOM.scorePlayerEls[1]) {
    DOM.scorePlayerEls[1].innerHTML = ``;
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
  length_snake[i].current += bait.coefficient;
  player.score[i] += bait.coefficient * dot_snake.score;
  game.wait_digesting[i] = bait.coefficient;
  coefficient.current = Math.floor(player.score[i] / 100);
  if (coefficient.current > coefficient.last) {
    dot_snake.radius += 2;
    bait.radius += 2;
    coefficient.last = coefficient.current;
  }

  if (game.count_player === 1) {
    updateScore(i, "fa");
  } else {
    updateScore(i);
  }
  updateSnake(i);
};

const collisionWall = (current_snake) => {
  if (
    snake[current_snake][0].x <= 0 ||
    snake[current_snake][0].x >= game.width ||
    snake[current_snake][0].y <= 0 ||
    snake[current_snake][0].y >= game.height
  ) {
    return true;
  }
  return false;
};

const collisionOtherSnake = (snakeIndex) => {
  if (snakeIndex === 0) return false;
  for (let i = 0; i < game.count_player; i++) {
    if (i !== snakeIndex) {
      for (let j = 0; j < length_snake[i].current; j++) {
        if (snake[snakeIndex][0].x === snake[i][j].x && snake[snakeIndex][0].y === snake[i][j].y) {
          return true;
        }
      }
    }
  }
  return false;
};

const keyInput = (e) => {
  for (let i = 0; i < game.count_player; i++) {
    if (
      e.keyCode === key[i].left ||
      e.keyCode === key[i].right ||
      e.keyCode === key[i].up ||
      e.keyCode === key[i].down
    ) {
      return e.keyCode;
    }
    if (e.keyCode === SPACE || e.keyCode === ESC) {
      return e.keyCode;
    }
  }
  return ERROR;
};

const partition = (input) => {
  for (let i = 0; i < game.count_player; i++) {
    if (
      input === key[i].left ||
      input === key[i].right ||
      input === key[i].up ||
      input === key[i].down
    ) {
      return i + 1;
    }
    if (input === SPACE || input === ESC) {
      return 102;
    }
  }
};

const keyValid = (oldKey, newKey) => {
  for (let i = 0; i < game.count_player; i++) {
    if (
      (newKey === key[i].up && oldKey === key[i].down) ||
      (newKey === key[i].down && oldKey === key[i].up) ||
      (newKey === key[i].left && oldKey === key[i].right) ||
      (newKey === key[i].right && oldKey === key[i].left)
    ) {
      return oldKey;
    }
  }
  return newKey;
};

const getInfoPlayer = () => {
  const day = new Date().toLocaleString();
  for (let i = 0; i < game.count_player; i++) {
    player.score[i] = 0;
    player.time_play[i] = "00:00:00";
    player.day_play[i] = `${day}`;
  }
};

const lose = (lose_player) => {
  let timePlay = convertTime(sum_seconds);
  let username = DOM.usernameLocalEl;

  const saved = {
    name: `${username.innerText}`,
    score: `${player.score[0]}`,
    time: `${timePlay}`,
    date: `${player.day_play[0]}`,
  };
  localStorage["match"] = JSON.stringify(saved);

  const loserBox = DOM.loserBoxEl;
  loserBox.innerHTML = "<h1>Oh không, bạn đã chết!</h1>";
  choseAudio("lose");

  DOM.playButtonEl.innerHTML = "Start";
  if (game.count_player === 1) {
    showBox(4);
    let item = document.createElement("h2");
    item.classList.add("lose_player");
    item.innerHTML = `Player ${lose_player}.You got ${
      player.score[lose_player - 1]
    } points. Come on, let's play again!!!`;
    loserBox.appendChild(item);
    history_match[0].score.push(player.score[0]);
    history_match[0].date_play.push(`${player.day_play[0]}`);
    history_match[0].time_play.push(`${timePlay}`);
    initGame();
    console.log(history_match);
  } else if (game.count_player === 2) {
    showBox(4);
    let win_player = 0;
    for (let i = 0; i < game.count_player; i++) {
      history_match[i].score.push(player.score[i]);
      history_match[i].date_play.push(`${player.day_play[i]}`);
      history_match[i].time_play.push(`${timePlay}`);
      if (i + 1 !== lose_player) {
        win_player = i + 1;
      }
      let item = document.createElement("h2");
      item.classList.add("lose_player");
      item.innerText = `Player ${i + 1}.You got ${player.score[i]} points. Come on, let's play again!!!`;
      loserBox.appendChild(item);
    }
  }
};

const initGame = () => {
  length_snake = [];
  key_code = [];
  special_key = ERROR;
  game.speedPlay = 1;
  for (let i = 0; i < game.count_player; i++) {
    if (history_match.length === 0) {
      let obj = {
        name: "Guest",
        score: [],
        time_play: [],
        date_play: [],
      };
      history_match.push(obj);
    }
    length_snake[i] = {
      current: 10,
      last: 10,
    };
    key_code[i] = {
      current: key[i].right,
      last: key[i].right,
    };
    player.score[i] = 0;
    game.is_find_bait[i] = true;
    game.is_digesting[i] = false;
    game.wait_digesting[i] = 0;
    updateScore(i);
  }
  dot_snake.score = 10;
  initSnake();
  sum_seconds = 0;
  initTime();
  coefficient.current = 0;
  coefficient.last = 0;
  dot_snake.radius = 10;
  bait.radius = 10;
};

const play = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.onkeydown = (e) => {
    const new_key = keyInput(e);
    const index = partition(new_key);
    if (1 <= index && index <= game.count_player) {
      key_code[index - 1].current = keyValid(key_code[index - 1].last, new_key);
      key_code[index - 1].last = key_code[index - 1].current;
    } else if (index === 102) {
      special_key = new_key;
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
    if (
      snake[i][0].x >= bait.x - bait.radius &&
      snake[i][0].x <= bait.x + bait.radius &&
      snake[i][0].y >= bait.y - bait.radius &&
      snake[i][0].y <= bait.y + bait.radius
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

let buttonPlay = DOM.playButtonEl;
buttonPlay.onclick = () => {
  if (buttonPlay.innerText === "Start" && !game.is_playing) {
    buttonPlay.innerHTML = `${ICONS.GAME_PAUSE} Pause`;
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
  if (key !== SPACE) return;
  if (buttonPlay.innerText === "Start" && !game.is_playing) {
    buttonPlay.innerHTML = `${ICONS.GAME_PAUSE} Pause`;
    game.is_playing = true;
    showBox(1);
    getInfoPlayer();
    initGame();
    time = setInterval(handleTime, 1000);
    play();
    choseAudio("play");
  } else if (buttonPlay.innerHTML == `${ICONS.GAME_PAUSE} Pause` && game.is_playing) {
    buttonPlay.innerHTML = `${ICONS.GAME_PLAY} Continue`;
    game.is_playing = false;
  } else if (buttonPlay.innerHTML == `${ICONS.GAME_PLAY} Continue` && !game.is_playing) {
    buttonPlay.innerHTML = `${ICONS.GAME_PAUSE} Pause`;
    game.is_playing = true;
    requestAnimationFrame(play);
  }
};

DOM.restartGameEls.forEach((element) => {
  element.addEventListener("click", () => {
    showBox(1);
    buttonPlay.innerHTML = `${ICONS.GAME_PAUSE} Pause`;
    game.is_playing = true;
    getInfoPlayer();
    initGame();
    time = setInterval(handleTime, 1000);
    play();
    choseAudio("play");
  });
});

DOM.playGameButtonEl.addEventListener("click", () => {
  showBox(1);
  buttonPlay.innerHTML = `${ICONS.GAME_PAUSE} Pause`;
  game.is_playing = true;
  getInfoPlayer();
  initGame();
  play();
  time = setInterval(handleTime, 1000);
  choseAudio("play");
});

const showHistoryMatch = () => {
  let box = DOM.matchLocalBoxEl;
  let data = "";
  let length = history_match[0].score.length;
  for (let i = 0; i < length; i++) {
    let score = history_match[0].score[i];
    let time = history_match[0].time_play[i];
    let day = history_match[0].date_play[i];
    data += `
         <tr class="history_item">
            <td>${i + 1}</td>
            <td>${day}</td>
            <td>${score}</td>
            <td>${time}</td>
         </tr>
      `;
  }
  box.innerHTML = data;
  showBox(5);
};
DOM.viewHistoryEls.forEach((element) => {
  element.addEventListener("click", () => {
    showHistoryMatch();
    choseAudio("end");
  });
});

const getAllMatch = async () => {
  let matches = "";

  const data = await callApiGetMatchHistory({
    name: `${DOM.usernameLocalEl.innerText}`,
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
  DOM.matchServerBoxEl.innerHTML = matches;
};

DOM.viewInfoPlayerEl.addEventListener("click", async () => {
  await getAllMatch();
  showBox(3);
});
DOM.tutorialButtonEl.addEventListener("click", tutorial);

const defaultSetting = () => {
  changeTheme("dark");
  changeLevel("easy");
  changeStatePlayer(1);
  changeSpeed(1);
  showBox(2);
};

defaultSetting();
