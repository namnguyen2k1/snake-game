import { callApiSaveMatchResult } from "./api.js";
import { DOM } from "./dom.js";
import { ICONS } from "./icon.js";
import { varCss } from "./utils.js";
import { game, theme } from "./variable.js";

const change_theme = (stateTheme) => {
  if (game.is_playing) return;
  const applyTheme = (themeKey, icon, addClass, removeClass) => {
    game.theme = themeKey;
    DOM.toggleThemeEl.innerHTML = icon;
    const colors = theme[themeKey];
    varCss("primary-color", colors.primaryColor);
    varCss("secondary-color", colors.secondaryColor);
    varCss("bg-color", colors.bgColor);
    varCss("heading-color", colors.headingColor);
    varCss("font-color", colors.fontColor);
    DOM.bodyEl.classList.add(addClass);
    DOM.bodyEl.classList.remove(removeClass);
  };
  if (stateTheme === "light") {
    applyTheme("light", ICONS.SUN, "light_theme", "dark_theme");
  } else if (stateTheme === "dark") {
    applyTheme("dark", ICONS.MOON, "dark_theme", "light_theme");
  }
};

DOM.toggleThemeEl.addEventListener("click", () => {
  const isLight = DOM.toggleThemeEl.classList.contains("light");
  if (isLight) {
    DOM.toggleThemeEl.innerHTML = ICONS.MOON;
    DOM.toggleThemeEl.classList.remove("light");
    change_theme("dark");
  } else {
    DOM.toggleThemeEl.innerHTML = ICONS.SUN;
    DOM.toggleThemeEl.classList.add("light");
    change_theme("light");
  }
});

const saveScore = async (e) => {
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
DOM.submitScoreEl.addEventListener("click", () => {
  if (index === 1) saveScore(DOM.submitScoreEl);
});
const change_level = (level) => {
  if (game.is_playing) return;
  const updateLevel = (key, icon, speedFactor) => {
    DOM.levelDisplayEl.innerHTML = `${icon} ${key.charAt(0).toUpperCase() + key.slice(1)}`;
    game.speedPlay /= speedFactor;
    game.levelPlaying = key;
  };
  const buttons = [
    { id: "easy", key: "easy", icon: ICONS.LV_EASY, speed: 1 },
    { id: "medium", key: "medium", icon: ICONS.LV_MEDIUM, speed: 2 },
    { id: "hard", key: "hard", icon: ICONS.LV_HARD, speed: 3 },
  ];
  buttons.forEach(({ id, key, icon, speed }) => {
    const btn = DOM.levelButtons[id];
    if (btn) {
      btn.addEventListener("click", () => updateLevel(key, icon, speed));
    }
  });
  if (["easy", "medium", "hard"].includes(level)) {
    const selected = buttons.find((b) => b.key === level);
    updateLevel(selected.key, selected.icon, selected.speed);
  }
};

const change_speed = (speed) => {
  if (game.is_playing) return;
  const updateSpeed = (multiplier) => {
    DOM.speedDisplayEl.innerHTML = `${ICONS.SPEED}Speed x${multiplier}`;
    game.speedPlay /= multiplier;
  };
  [1, 2, 3].forEach((multiplier) => {
    const btn = DOM.speedButtons[`x${multiplier}`];
    if (btn) {
      btn.addEventListener("click", () => updateSpeed(multiplier));
    }
  });
  if ([1, 2, 3].includes(speed)) {
    updateSpeed(speed);
  }
};

const change_state_player = (state) => {
  if (game.is_playing) return;
  const updateState = (count) => {
    const icons = count === 1 ? `${ICONS.USER}` : `${ICONS.USER} ${ICONS.USER}`;
    DOM.playerDisplayEl.innerHTML = `${icons} Player`;
    game.count_player = count;
  };
  const aloneBtn = DOM.playerButtons.alone;
  if (aloneBtn) {
    aloneBtn.addEventListener("click", () => updateState(1));
  }
  const partnerBtn = DOM.playerButtons.partner;
  if (partnerBtn) {
    partnerBtn.addEventListener("click", () => updateState(2));
  }
  if ([1, 2].includes(state)) {
    updateState(state);
  }
};

let chose_audio = (audio_name) => {
  let audio = document.getElementById("Audio");
  audio.src = `/audio/${audio_name}_music.mp3`;
  audio.play();
  audio.classList.remove("pause");
  DOM.controlAudioEl.innerHTML = ICONS.AUDIO_PLAY;
};

DOM.controlAudioEl.addEventListener("click", () => {
  let audio = DOM.audioMainEl;
  if (audio.classList.contains("pause")) {
    audio.play();
    audio.classList.remove("pause");
    DOM.controlAudioEl.innerHTML = ICONS.AUDIO_PLAY;
  } else {
    audio.pause();
    audio.classList.add("pause");
    DOM.controlAudioEl.innerHTML = ICONS.AUDIO_PAUSE;
  }
});

const ate_bait = (audio_name) => {
  let audio = DOM.audioBaitEl;
  audio.src = `/audio/${audio_name}_music.mp3`;
  audio.play();
};

const tutorial = () => {
  show_box(2);
};

const show_box = (index) => {
  let box_arr = DOM.boxes;
  for (let i = 0; i < box_arr.length; i++) {
    box_arr[i].classList.add("display_none");
  }
  box_arr[index - 1].classList.remove("display_none");
};

export {
  ate_bait,
  change_level,
  change_speed,
  change_state_player,
  change_theme,
  chose_audio,
  show_box,
  tutorial,
};
