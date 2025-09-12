import { game } from "./app.js";
import { callApiSaveMatchResult } from "./shared/api.js";
import { theme } from "./shared/constant.js";
import { APP_DOM } from "./shared/dom.js";
import { APP_ICON } from "./shared/icon.js";
import { varCss } from "./shared/utils.js";

export const changeTheme = (stateTheme) => {
  if (game.isPlaying) return;
  const applyTheme = (themeKey, icon, addClass, removeClass) => {
    game.theme = themeKey;
    APP_DOM.toggleThemeEl.innerHTML = icon;
    const colors = theme[themeKey];
    varCss("primary-color", colors.primaryColor);
    varCss("secondary-color", colors.secondaryColor);
    varCss("bg-color", colors.bgColor);
    varCss("heading-color", colors.headingColor);
    varCss("font-color", colors.fontColor);
    APP_DOM.bodyEl.classList.add(addClass);
    APP_DOM.bodyEl.classList.remove(removeClass);
  };
  if (stateTheme === "light") {
    applyTheme("light", APP_ICON.SUN, "light_theme", "dark_theme");
  } else if (stateTheme === "dark") {
    applyTheme("dark", APP_ICON.MOON, "dark_theme", "light_theme");
  }
};

const toggleThemeEl = APP_DOM.toggleThemeEl;
toggleThemeEl.addEventListener("click", () => {
  const isLight = toggleThemeEl.classList.contains("light");
  if (isLight) {
    toggleThemeEl.innerHTML = APP_ICON.MOON;
    toggleThemeEl.classList.remove("light");
    changeTheme("dark");
  } else {
    toggleThemeEl.innerHTML = APP_ICON.SUN;
    toggleThemeEl.classList.add("light");
    changeTheme("light");
  }
});

export const saveScore = async (e) => {
  const match = JSON.parse(localStorage["match"]) || "no match";
  e.classList.remove("far");
  e.classList.add("fas");
  await callApiSaveMatchResult(match);
  setTimeout(() => {
    e.classList.remove("fas");
    e.classList.add("far");
  }, 3000);
};

let index = 1;
APP_DOM.submitScoreEl.addEventListener("click", () => {
  if (index === 1) saveScore(APP_DOM.submitScoreEl);
});

export const changeLevel = (level) => {
  if (game.isPlaying) return;
  const updateLevel = (key, icon, speedFactor) => {
    APP_DOM.levelDisplayEl.innerHTML = `${icon} ${key.charAt(0).toUpperCase() + key.slice(1)}`;
    game.speedFactor /= speedFactor;
    game.difficulty = key;
  };
  const buttons = [
    { id: "easy", key: "easy", icon: APP_ICON.LV_EASY, speed: 1 },
    { id: "medium", key: "medium", icon: APP_ICON.LV_MEDIUM, speed: 2 },
    { id: "hard", key: "hard", icon: APP_ICON.LV_HARD, speed: 3 },
  ];
  buttons.forEach(({ id, key, icon, speed }) => {
    APP_DOM.levelButtons[id].addEventListener("click", () => updateLevel(key, icon, speed));
  });
  if (["easy", "medium", "hard"].includes(level)) {
    const { key, icon, speed } = buttons.find((b) => b.key === level);
    updateLevel(key, icon, speed);
  }
};

export const changeSpeed = (speed) => {
  if (game.isPlaying) return;
  const updateSpeed = (multiplier) => {
    APP_DOM.speedDisplayEl.innerHTML = `${APP_ICON.SPEED}Speed x${multiplier}`;
    game.speedFactor /= multiplier;
  };
  [1, 2, 3].forEach((multiplier) => {
    APP_DOM.speedButtons[`x${multiplier}`].addEventListener("click", () => updateSpeed(multiplier));
  });
  if ([1, 2, 3].includes(speed)) {
    updateSpeed(speed);
  }
};

export const changeStatePlayer = (state) => {
  if (game.isPlaying) return;
  const updateState = (count) => {
    const icons = count === 1 ? `${APP_ICON.USER}` : `${APP_ICON.USER} ${APP_ICON.USER}`;
    APP_DOM.playerDisplayEl.innerHTML = `${icons} Player`;
    game.playerCount = count;
  };
  APP_DOM.playerButtons.alone.addEventListener("click", () => updateState(1));
  APP_DOM.playerButtons.partner.addEventListener("click", () => updateState(2));
  if ([1, 2].includes(state)) {
    updateState(state);
  }
};

export const choseAudio = (audio_name) => {
  let audio = document.getElementById("Audio");
  audio.src = `/audio/${audio_name}_music.mp3`;
  audio.play();
  audio.classList.remove("pause");
  APP_DOM.controlAudioEl.innerHTML = APP_ICON.AUDIO_PLAY;
};

APP_DOM.controlAudioEl.addEventListener("click", () => {
  const audio = APP_DOM.audioMainEl;
  if (audio.classList.contains("pause")) {
    audio.play();
    audio.classList.remove("pause");
    APP_DOM.controlAudioEl.innerHTML = APP_ICON.AUDIO_PLAY;
  } else {
    audio.pause();
    audio.classList.add("pause");
    APP_DOM.controlAudioEl.innerHTML = APP_ICON.AUDIO_PAUSE;
  }
});

export const ateBait = (audio_name) => {
  const audio = APP_DOM.audioBaitEl;
  audio.src = `/audio/${audio_name}_music.mp3`;
  audio.play();
};

export const tutorial = () => {
  showBox(2);
};

export const showBox = (index) => {
  const boxes = APP_DOM.boxes;
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].classList.add("display_none");
  }
  boxes[index - 1].classList.remove("display_none");
};
