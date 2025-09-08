import { game, theme } from './variable.js';
import { varCss } from './handy_component.js';

let controlTheme = document.getElementById('toggleTheme');
// thay đổi theme: dark_theme and light_theme
const change_theme = stateTheme => {
  // nếu game đã run thì không thay đổi được
  if (game.is_playing) return;
  if (stateTheme === 'light') {
    game.theme = 'light';
    controlTheme.innerHTML = '<i class="fas fa-sun"></i>';
    varCss('primary-color', theme.light.primaryColor);
    varCss('secondary-color', theme.light.secondaryColor);
    varCss('bg-color', theme.light.bgColor);
    varCss('heading-color', theme.light.headingColor);
    varCss('font-color', theme.light.fontColor);
    document.querySelector('body').classList.remove('dark_theme');
    document.querySelector('body').classList.add('light_theme');
  }
  if (stateTheme === 'dark') {
    game.theme = 'dark';
    controlTheme.innerHTML = '<i class="fas fa-moon"></i>';
    varCss('primary-color', theme.dark.primaryColor);
    varCss('secondary-color', theme.dark.secondaryColor);
    varCss('bg-color', theme.dark.bgColor);
    varCss('heading-color', theme.dark.headingColor);
    varCss('font-color', theme.dark.fontColor);
    document.querySelector('body').classList.add('dark_theme');
    document.querySelector('body').classList.remove('light_theme');
  }
};

const toggleTheme = e => {
  if (e.classList.contains('light')) {
    e.innerHTML = '<i class="fas fa-moon"></i>';
    e.classList.remove('light');
    change_theme('dark');
  } else {
    e.innerHTML = '<i class="fas fa-sun"></i>';
    e.classList.add('light');
    change_theme('light');
  }
};

controlTheme.addEventListener('click', () => {
  toggleTheme(controlTheme);
});

// sent data
let matchData = document.getElementById('submit_score');
const saveScore = async e => {
  // alert('sent');
  const data = JSON.parse(localStorage['match']) || 'no match';
  console.log(data);

  // change icon
  e.classList.remove('far');
  e.classList.add('fas');

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      name: data.name,
      date: data.date,
      time: data.time,
      score: data.score
    })
  };

  // post to save in server
  await fetch('/api/match', fetchOptions)
    .then(res => {
      console.log('Request complete! response:', res);
    })
    .catch(console.error());

  // reset icon
  setTimeout(() => {
    e.classList.remove('fas');
    e.classList.add('far');
  }, 3000);
};

let index = 1;

matchData.addEventListener('click', () => {
  if (index === 1) saveScore(matchData);
});

// thay đổi chế độ chơi
const change_level = level => {
  // nếu game đã run thì không thay đổi được
  if (game.is_playing) return;
  let level_easy = document.getElementById('easy');
  level_easy.addEventListener('click', () => {
    document.getElementById('level').innerHTML = '<i class="fas fa-laugh-beam"></i> Easy';
    game.speedPlay /= 1;
    game.levelPlaying = 'easy';
  });
  let level_medium = document.getElementById('medium');
  level_medium.addEventListener('click', () => {
    document.getElementById('level').innerHTML = '<i class="fas fa-laugh"></i> Medium';
    game.speedPlay /= 2;
    game.levelPlaying = 'medium';
  });
  let level_hard = document.getElementById('hard');
  level_hard.addEventListener('click', () => {
    document.getElementById('level').innerHTML = '<i class="fas fa-tired"></i> Hard';
    game.speedPlay /= 2;
    game.levelPlaying = 'hard';
  });
  if (theme === 'easy') {
    document.getElementById('level').innerHTML = '<i class="fas fa-laugh-beam"></i> Easy';
    game.speedPlay /= 1;
    game.levelPlaying = 'easy';
  } else if (theme === 'medium') {
    document.getElementById('level').innerHTML = '<i class="fas fa-laugh"></i> Medium';
    game.speedPlay /= 2;
    game.levelPlaying = 'medium';
  } else if (theme === 'hard') {
    document.getElementById('level').innerHTML = '<i class="fas fa-tired"></i> Hard';
    game.speedPlay /= 3;
    game.levelPlaying = 'hard';
  }
};

// thay đổi tốc độ di chuyển snake
const change_speed = speed => {
  if (game.is_playing) return;
  let speedx1 = document.getElementById('speedx1');
  speedx1.addEventListener('click', () => {
    document.getElementById('speed').innerHTML = '<i class="fas fa-tachometer-alt"></i>Speed x1';
    game.speedPlay /= 1;
  });
  let speedx2 = document.getElementById('speedx2');
  speedx2.addEventListener('click', () => {
    document.getElementById('speed').innerHTML = '<i class="fas fa-tachometer-alt"></i>Speed x2';
    game.speedPlay /= 2;
  });
  let speedx3 = document.getElementById('speedx3');
  speedx3.addEventListener('click', () => {
    document.getElementById('speed').innerHTML = '<i class="fas fa-tachometer-alt"></i>Speed x3';
    game.speedPlay /= 3;
  });
  if (speed === 1) {
    document.getElementById('speed').innerHTML = '<i class="fas fa-tachometer-alt"></i>Speed x1';
    game.speedPlay /= 1;
  } else if (speed === 2) {
    document.getElementById('speed').innerHTML = '<i class="fas fa-tachometer-alt"></i>Speed x2';
    game.speedPlay /= 2;
  } else if (speed === 3) {
    document.getElementById('speed').innerHTML = '<i class="fas fa-tachometer-alt"></i>Speed x3';
    game.speedPlay /= 3;
  }
};

const change_state_player = state => {
  if (game.is_playing) return;
  let state_alone = document.getElementById('state_alone');
  state_alone.addEventListener('click', () => {
    document.getElementById('player').innerHTML = '<i class="fas fa-user"></i> Player';
    game.count_player = 1;
  });
  let state_partner = document.getElementById('state_partner');
  state_partner.addEventListener('click', () => {
    document.getElementById('player').innerHTML =
      '<i class="fas fa-user"></i> <i class="fas fa-user"></i> Player';
    game.count_player = 2;
  });
  if (state === 1) {
    document.getElementById('player').innerHTML = '<i class="fas fa-user"></i> Player';
    game.count_player = 1;
  } else if (state === 2) {
    document.getElementById('player').innerHTML =
      '<i class="fas fa-user"></i><i class="fas fa-user"></i> Player';
    game.count_player = 2;
  }
};

// change state audio
let controlAudio = document.getElementById('control_audio');

let chose_audio = audio_name => {
  let audio = document.getElementById('Audio');
  audio.src = `/audio/${audio_name}_music.mp3`;
  audio.play();
  audio.classList.remove('pause');
  controlAudio.innerHTML = '<i class="fas fa-volume-up"></i>';
};

controlAudio.addEventListener('click', () => {
  let audio = document.getElementById('Audio');
  if (audio.classList.contains('pause')) {
    audio.play();
    audio.classList.remove('pause');
    controlAudio.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else {
    audio.pause();
    audio.classList.add('pause');
    controlAudio.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
});

const ate_bait = audio_name => {
  let audio = document.getElementById('Audio_bait');
  audio.src = `/audio/${audio_name}_music.mp3`;
  audio.play();
};

const tutorial = () => {
  show_box(2); // hiện mục hướng dẫn game, register, login
};

const show_box = index => {
  let box_arr = document.querySelectorAll('.box');
  // console.log(box_arr);
  for (let i = 0; i < box_arr.length; i++) {
    box_arr[i].classList.add('display_none');
  }
  box_arr[index - 1].classList.remove('display_none');
};

// each file other file module then can run function in this. it must export to file mudule to run

export {
  change_level,
  change_theme,
  change_speed,
  change_state_player,
  tutorial,
  show_box,
  chose_audio,
  ate_bait
};
