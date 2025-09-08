//todo _Thêm các hàm tiện tích hay dùng
import { convertTime, getRandomInt, listColor, varCss } from "./utils.js";

//todo _Thêm các biến, object game
import { bait, coefficient, dot_snake, ERROR, ESC, game, key, player, SPACE } from "./variable.js";
//todo _Thêm các hàm điều khiển game
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
import { ICONS } from "./icon.js";

//! các biến let, var không thể module hóa được??
let lenght_snake = []; // mảng chứa độ dài các thân rắn
let snake = []; // snake = là một mảng các child_snake, mỗi child_snake chưa các dot_snake
// mảng chưa key_input của từng nhóm player: gồm hai trường current và last
let key_code = [];
let history_match = [];
let sum_seconds = 0; // tính cho cả hai player
let special_key;

// game_board là một khu vực sử dụng canvas
let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext("2d");

// lấy giá trị từ biến trong css (khi website responsive)
// dạng string
const canvasWidth = `${varCss("canvas-width").slice(0, varCss("canvas-width").indexOf("px"))}`;
const canvasHeight = `${varCss("canvas-height").slice(0, varCss("canvas-height").indexOf("px"))}`;

// parse sang dạng Int
canvas.width = parseInt(`${canvasWidth}`);
canvas.height = parseInt(`${canvasHeight}`);

// gán giá trị cho object game
game.width = canvas.width;
game.height = canvas.height;

// khởi tạo các snake
const initSnake = () => {
  snake = [];
  // khởi tạo số rắn tùy theo level chơi
  for (let i = 0; i < game.count_player; i++) {
    // tạo mỗi con rắn cho mõi ô nhớ
    snake[i] = [];
    for (let j = 0; j < lenght_snake[i].current; j++) {
      // nếu đang trong thời gian tiêu hóa mồi thì sơn toàn thân bằng màu bait
      if (game.is_digesting[i]) {
        dot_snake.color = `${bait.color}`;
      }
      // nếu không trong thời gian tiêu hóa thì get color random
      else if (!game.is_digesting[i]) {
        dot_snake.color = `${listColor[getRandomInt(listColor.length)]}`;
      }
      snake[i][j] = {
        x: 100 - j * dot_snake.radius,
        y: 100 + 50 * i, // tạo các hàng rắn khác khau
        radius: dot_snake.radius,
        score: 10,
        color: `${dot_snake.color}`, // color mồi
        head: false,
      };
    }
  }
};

// hàm vẽ một điểm màu
const drawDot = (dot, index = false) => {
  ctx.beginPath();
  if (index === false) {
    ctx.fillRect(dot.x - 5, dot.y - 5, dot.radius, dot.radius);
    if (game.theme === "dark") {
      ctx.strokeStyle = "white";
    } else if (game.theme === "light") {
      ctx.strokeStyle = "black";
    }

    ctx.lineWidth = Math.floor(dot.radius * 0.3);
    ctx.strokeRect(dot.x - 5, dot.y - 5, dot.radius, dot.radius);
  } else if (index === "circle") {
    // let lastRadius = dot.radius;
    // if (key_code.la)
    let Oy = dot.y,
      Ox = dot.x;
    for (let i in game.count_player) {
      if (key_code[i].current === key[i].up || key_code[i].current === key[i].up) {
        Oy = dot.y + 0.5 * dot.radius;
      } else if (key_code[i].current === key[i].left || key_code[i].current === key[i].right) {
        Ox = dot.x + 0.5 * dot.radius;
      }
    }
    // dot.radius = bait.radius;
    ctx.arc(Ox, Oy, dot.radius, 0, Math.PI * 2);
    // ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.fillStyle = `${dot.color}`;
  ctx.fill();
  ctx.closePath();
};

// hàm vẽ bait
const createBait = () => {
  bait.color = `${listColor[getRandomInt(listColor.length)]}`;
  bait.coefficient = 1;
  bait.radius = 10;
  // lây điểm đặc biệt random
  let special = getRandomInt(10);
  if (special === 0) {
    bait.radius = 30;
    bait.color = "gold";
    bait.coefficient = 10;
  }
  // khởi tạo vị trị, màu sắc ngãu nhiên cho bait
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
    for (let j = 0; j < lenght_snake[i].current; j++) {
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
    for (let j = 0; j < lenght_snake[i].current; j++) {
      drawDot(snake[i][j]);
    }
    // cho màu đàu snake trùng màu bait
    snake[i][0].color = `${bait.color}`;
    drawDot(snake[i][0], "circle");
  }
};

// update snake thứ i
const updateSnake = (i) => {
  // nối thêm dot_snake cho snake
  // let radius = coeff*2;
  for (let j = 0; j < lenght_snake[i].last; j++) {
    snake[i][j].radius = dot_snake.radius; // cập nhập độ to cho snake
  }
  for (let j = lenght_snake[i].last; j < lenght_snake[i].current; j++) {
    snake[i][j] = {
      x: 100 - 2 * j * dot_snake.radius,
      y: 100 + 50 * i,
      radius: dot_snake.radius,
      score: 10,
      color: "", // color mồi
      head: false,
    };
  }
  // cập nhập màu sắc lại cho snake
  for (let j = 0; j < lenght_snake[i].current; j++) {
    if (game.is_digesting[i]) {
      dot_snake.color = `${bait.color}`;
    }
    // nếu không trong thời gian tiêu hóa thì get color random
    else if (!game.is_digesting[i]) {
      dot_snake.color = `${listColor[getRandomInt(listColor.length)]}`;
    }
    snake[i][j].color = `${dot_snake.color}`; // color moi
  }
  // cập nhập lại lại độ dài snake
  lenght_snake[i].last = lenght_snake[i].current;
};

// xử lý trạng thái di chuyển của rắn
const handleWay = () => {
  for (let i = 0; i < game.count_player; i++) {
    // dịch tạo độ các dot_snake lần lượt đến dot cuối
    for (let j = lenght_snake[i].current - 1; j > 0; j--) {
      snake[i][j].x = snake[i][j - 1].x;
      snake[i][j].y = snake[i][j - 1].y;
    }
    // xử lý trạng thái di chuyển của rắn snake[i][0].radius
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

//todo cập nhập điểm, thời gian play,..
// xư lý in thời gian
let time_play = document.getElementById("time_play"); // tính cho cả hai player
const handleTime = () => {
  sum_seconds++;
  time_play.innerText = `${convertTime(sum_seconds)}`;
};
let time = 0;
const initTime = () => {
  // xoa sư kiện
  clearInterval(time);
  // khởi tạo sự kiện mới
  sum_seconds = 0;
  // cap nhap lai time
  time_play.innerText = `00:00:00`;
};

// xử lý hiện điểm số
const updateScore = (i, fa = false) => {
  // truy cập và cập nhập điểm player thứ i
  let score = document.getElementById(`score_player_${i + 1}`);
  score.innerText = `Player ${i + 1}: ${player.score[i]}`;
  if (fa) {
    document.getElementById(`score_player_${1 + 1}`).innerHTML = ``;
  }
};

// đung độ snake thứ i và bait
const collisionBait = (i) => {
  if (bait.radius === 30) {
    ateBait("bait_special");
  } else {
    ateBait("bait");
  }

  // cập nhập thời gian tiêu hóa
  game.wait_digesting[i] = bait.coefficient;
  // cập nhập trạng thái tiêu hóa
  game.is_digesting[i] = true;
  // rắn chuyển sang trạng thái tìm mồi
  game.is_find_bait[i] = true;
  // tăng chiều dài thân rắn lên
  lenght_snake[i].current += bait.coefficient;
  // tăng số điểm hiện có
  player.score[i] += bait.coefficient * dot_snake.score;
  // cho thời gian giữ màu bằng với hệ số mồi
  game.wait_digesting[i] = bait.coefficient;
  // xử lý zoom Snake
  coefficient.current = Math.floor(player.score[i] / 100);
  // console.log(coefficient.current);
  if (coefficient.current > coefficient.last) {
    // tawng leen 2px
    dot_snake.radius += 2;
    bait.radius += 2;
    coefficient.last = coefficient.current;
  }

  if (game.count_player === 1) {
    // 1 player thi chi cap ban than
    updateScore(i, "fa");
  } else {
    updateScore(i);
  }
  updateSnake(i); // cập nhập thêm dot cho snake i
};

const collisionWall = (current_snake) => {
  // head_snake collision_wall -> lose()
  if (
    snake[current_snake][0].x <= 0 || // đựng thành trên
    snake[current_snake][0].x >= game.width || // đụng thành dưới
    snake[current_snake][0].y <= 0 || // đụng thành trái
    snake[current_snake][0].y >= game.height // đụng thành phải
  ) {
    return true;
  }
  return false;
};

const collisionOtherSnake = (current_snake) => {
  if (current_snake === 0) return false;
  for (let i = 0; i < game.count_player; i++) {
    // so sánh trên data của các snake khác
    if (i !== current_snake) {
      for (let j = 0; j < lenght_snake[i].current; j++) {
        //! nếu tọa độ head_current_snake == với các dot_snake khác -> lose()
        if (
          snake[current_snake][0].x === snake[i][j].x &&
          snake[current_snake][0].y === snake[i][j].y
        ) {
          return true; // trả về đụng độ
        }
      }
    }
  }
  return false; // không đụng độ
};

// lấy giá tị key phím nhập vào
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
    // nếu thuộc nhóm đặc biệt
    if (e.keyCode === SPACE || e.keyCode === ESC) {
      return e.keyCode;
    }
  }
  // nếu không thuộc bộ key nào thì trả mã lỗi
  return ERROR;
};

// phân nhóm key_input
const partition = (input) => {
  for (let i = 0; i < game.count_player; i++) {
    if (
      input === key[i].left ||
      input === key[i].right ||
      input === key[i].up ||
      input === key[i].down
    ) {
      return i + 1; // trả về nhóm key-code player
    }
    // nếu key đầu vào thuộc nhóm đặc biệt
    if (input === SPACE || input === ESC) {
      return 102;
    }
  }
};

// kiểm tra và trả về key_input hợp lệ
const keyValid = (last_key, new_key) => {
  for (let i = 0; i < game.count_player; i++) {
    //! nếu newState ngược lại với lastState -> false, trả về lastState
    if (
      (new_key === key[i].up && last_key === key[i].down) ||
      (new_key === key[i].down && last_key === key[i].up) ||
      (new_key === key[i].left && last_key === key[i].right) ||
      (new_key === key[i].right && last_key === key[i].left)
    ) {
      return last_key;
    }
  }
  return new_key;
};

// get info
const getInfoPlayer = () => {
  const day = new Date().toLocaleString();
  // const day_infor = `${day.getDay()}:${day.getMonth()}:${day.getFullYear()}`;
  for (let i = 0; i < game.count_player; i++) {
    // player.name[i] = prompt(`Name player_${i + 1}: `);
    // player.address[i] = prompt(`Address player_${i + 1}: `);
    player.score[i] = 0;
    player.time_play[i] = "00:00:00";
    player.day_play[i] = `${day}`;
  }
};
// hàm xử lý thua
const lose = (lose_player) => {
  let time_play = convertTime(sum_seconds);
  let username = document.getElementById("username-local");
  // add cache
  const saved = {
    name: `${username.innerText}`,
    score: `${player.score[0]}`,
    time: `${time_play}`,
    date: `${player.day_play[0]}`,
  };
  localStorage["match"] = JSON.stringify(saved);
  console.log(localStorage["match"]);
  let loser_box = document.querySelector(".loser_box");
  //reset match
  loser_box.innerHTML = "<h1>Oh không, bạn đã chết!</h1>";
  choseAudio("lose");
  document.getElementById("play").innerHTML = "Start";
  if (game.count_player === 1) {
    showBox(4);
    // console.log(player.score[0], player.score[1]);
    let item = document.createElement("h2");
    item.classList.add("lose_player");
    item.innerHTML = `Player ${lose_player}.You got ${
      player.score[lose_player - 1]
    } points. Come on, let's play again!!!`;
    loser_box.appendChild(item);
    // add data to history
    history_match[0].score.push(player.score[0]);
    history_match[0].date_play.push(`${player.day_play[0]}`);
    history_match[0].time_play.push(`${time_play}`);
    initGame();
    console.log(history_match);
  } else if (game.count_player === 2) {
    showBox(4);
    let win_player = 0;
    for (let i = 0; i < game.count_player; i++) {
      // add data to history
      history_match[i].score.push(player.score[i]);
      history_match[i].date_play.push(`${player.day_play[i]}`);
      history_match[i].time_play.push(`${time_play}`);
      if (i + 1 !== lose_player) {
        win_player = i + 1;
      }
      let item = document.createElement("h2");
      item.classList.add("lose_player");
      item.innerText = `Player ${i + 1}.You got ${player.score[i]} points. Come on, let's play again!!!`;
      loser_box.appendChild(item);
    }
  }
};

// xứ lý game play

// khởi tạo lại game
const initGame = () => {
  lenght_snake = [];
  key_code = [];
  special_key = ERROR;
  game.speedPlay = 1;
  for (let i = 0; i < game.count_player; i++) {
    if (history_match.length === 0) {
      let obj = {
        name: "Nguyen Anh Nam",
        score: [],
        time_play: [],
        date_play: [],
      };
      history_match.push(obj);
    }
    // khởi tạo độ dài thân các con rắn
    lenght_snake[i] = {
      current: 10,
      last: 10,
    };
    // khởi tạo bộ key_control: mặc định các snake đều đi về bên phải
    key_code[i] = {
      current: key[i].right,
      last: key[i].right,
    };
    // điểm từng snake = 0
    player.score[i] = 0;
    // trạng thái đều đang tìm mồi
    game.is_find_bait[i] = true;
    // trạng thái chưa tiêu hóa
    game.is_digesting[i] = false;
    // chưa tiêu hóa nên thời gian tiêu hóa = 0
    game.wait_digesting[i] = 0;
    // đạt lại bộ tính điểm cho các snake
    updateScore(i);
  }
  dot_snake.score = 10; // điểm mặc định mồi là 10
  // khởi tạo snake
  initSnake();
  // khởi động bộ tính giờ cho cả hai player
  sum_seconds = 0;
  initTime();
  // đặt lại hệ số zoom
  coefficient.current = 0;
  coefficient.last = 0;
  // đạt lại bán kinh snake and bait
  dot_snake.radius = 10;
  bait.radius = 10;
};

// hàm điều khiển sự kiện chính
const play = () => {
  // xóa màn hình, draw lại hình mới
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // lấy dự kiện phím khi có phím nhập vào
  document.onkeydown = (e) => {
    // lấy key mới
    const new_key = keyInput(e);
    // phân loại key_input, return mã nhóm player (1, 2,...) hoặc speacial_key
    const index = partition(new_key);
    // nếu new_key thuộc nhóm hợp lệ thì set lại key
    if (1 <= index && index <= game.count_player) {
      // kiểm tra hợp lệ của new_key
      key_code[index - 1].current = keyValid(key_code[index - 1].last, new_key);
      // cập nhập lại key_code cho từng player
      key_code[index - 1].last = key_code[index - 1].current;
    }
    // th còn lại cho vào nhóm key đặc biệt (dùng để điều khiển)
    else if (index === 102) {
      special_key = new_key;
      // ! mở rộng thêm các tính năng khác
    }
  };
  // điều chỉnh hướng dựa vào key_code[i] (luôn luôn điều kiển do snake luôn di chuyển)
  handleWay();
  // vẽ lại các rắn
  drawSnake();
  // cac logic game khác
  for (let i = 0; i < game.count_player; i++) {
    // khi hết thời gian tiêu hóa thì sẽ không còn trạng thái tiêu hóa
    if (game.wait_digesting[i] === 0) {
      updateSnake(i); // set mau random lai cho snake
      game.is_digesting[i] = false;
    }
    // nếu hết trạng thái tiêu hóa thì sẽ sinh ra mồi cho ăn tiếp
    if (game.is_find_bait[i]) {
      // tạo ra mồi mới, update object bait
      createBait();
      // chời đợi tiêu hóa tiếp
      game.is_find_bait[i] = false;
    }
    // ve bait
    drawDot(bait, "circle");
    // xử lý ăn mồi
    if (
      // tạo độ nằm trong khoản mồi
      snake[i][0].x >= bait.x - bait.radius &&
      snake[i][0].x <= bait.x + bait.radius &&
      snake[i][0].y >= bait.y - bait.radius &&
      snake[i][0].y <= bait.y + bait.radius
    ) {
      if (game.wait_digesting[i]) {
        // game kết thúc!
        game.is_playing = false;
        lose(i + 1); //! die: chưa tiêu hóa xong đã ăn tiếp
      }
      // th. hết trạng thái chời đợi, được ăn mồi tiếp
      else if (!game.wait_digesting[i]) {
        // gọi hàm xử lý sự kiện ăn mồi cho snake[i]
        collisionBait(i);
        const waitChangeColor = game.wait_digesting[i] * 1000;
        // sau thời gian wait sẽ set color lại như thường
        setTimeout(() => {
          game.wait_digesting[i] = 0;
        }, waitChangeColor);
      }
    }
    // xử lý collsion: wall and other Snake
    if (collisionWall(i)) {
      game.is_playing = false;
      // truyen vao player_lose
      lose(i + 1); //! đụng wall -> die
      // document.location.reload();
    }
    if (collisionOtherSnake(i)) {
      game.is_playing = false;
      // truyen vao player_lose
      lose(i + 1); //! đụng snake khac -> die
      // load lai web
      // document.location.reload();
    }
  }
  if (game.is_playing) {
    const speed = game.speedPlay * 100;
    setTimeout(() => {
      requestAnimationFrame(play);
    }, speed);
  }
};

// dieu khien game
//dieu khien và xử lý dự kiện play game
let buttonPlay = document.getElementById("play");
buttonPlay.onclick = () => {
  // play chỉ để start game
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
  // key space dùng để state/pause and continue game
  const key = keyInput(e);
  if (key !== SPACE) return;
  // bắt đầu game
  if (buttonPlay.innerText === "Start" && !game.is_playing) {
    buttonPlay.innerHTML = `${ICONS.GAME_PAUSE} Pause`;
    game.is_playing = true;
    showBox(1);
    getInfoPlayer();
    initGame();
    time = setInterval(handleTime, 1000);
    play();
    choseAudio("play");
  }
  // đang chơi muốn dừng lai
  else if (buttonPlay.innerHTML == `${ICONS.GAME_PAUSE} Pause` && game.is_playing) {
    buttonPlay.innerHTML = `${ICONS.GAME_PLAY} Continue`;
    game.is_playing = false;
  }
  // đang dừng muốn chơi lại
  else if (buttonPlay.innerHTML == `${ICONS.GAME_PLAY} Continue` && !game.is_playing) {
    buttonPlay.innerHTML = `${ICONS.GAME_PAUSE} Pause`;
    game.is_playing = true;
    requestAnimationFrame(play); // load tiep animation
  }
};

//todo thêm sự kiện cho các nút bấm:
/**
 * showBox(n):
 *    ->n = 1: canvas game board
 *    ->n = 2: tutorial, register, login board
 *    ->n = 3: infor board
 *    ->n = 4: loser board
 *    ->n = 5: history_match
 */
// let register = document.getElementById('register');
// let login = document.getElementById('login');
let play_game = document.getElementById("play_game");
let restart_game = document.querySelectorAll(".restart_game");
restart_game.forEach((element) => {
  element.addEventListener("click", () => {
    showBox(1);
    buttonPlay.innerHTML = `${ICONS.GAME_PAUSE} Pause`;
    game.is_playing = true;
    getInfoPlayer();
    initGame();
    // cho auto tinh gio lai
    time = setInterval(handleTime, 1000);
    play();
    choseAudio("play");
  });
});

play_game.addEventListener("click", () => {
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
  let box = document.querySelector(".match-local");
  let data = "";
  let lenght = history_match[0].score.length;
  for (let i = 0; i < lenght; i++) {
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
let view_history = document.querySelectorAll(".view_history");
view_history.forEach((element) => {
  element.addEventListener("click", () => {
    showHistoryMatch();
    choseAudio("end");
  });
});

const getAllMatch = async () => {
  let username = document.getElementById("username-local");
  let box = document.querySelector(".match-server");
  let matches = "";

  const data = await callApiGetMatchHistory({
    name: `${username.innerText}`,
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
  box.innerHTML = matches;
};

const viewInfoPlayer = document.getElementById("view_infor_player");
viewInfoPlayer.addEventListener("click", async () => {
  await getAllMatch();
  showBox(3);
});

const defaultSetting = () => {
  changeTheme("dark"); // theme: {dark, light}
  changeLevel("easy"); // level: {easy, medium, hard}
  changeStatePlayer(1); // number or player: {1 player, 2 player}
  changeSpeed(1); // speed snake {x1, x2, x3}
  showBox(2); // hiện mục tutorial
  // choseAudio('home');
  document.getElementById("tutorial").addEventListener("click", tutorial);
  // setTimeout(tutorial, 2000);
};

defaultSetting();
