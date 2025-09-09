export const DOM = {
  /**
   * control.js
   */
  bodyEl: document.querySelector("body"),
  // theme
  toggleThemeEl: document.getElementById("toggleTheme"),
  // score
  submitScoreEl: document.getElementById("submit_score"),
  // level
  levelDisplayEl: document.getElementById("level"),
  levelButtons: {
    easy: document.getElementById("easy"),
    medium: document.getElementById("medium"),
    hard: document.getElementById("hard"),
  },
  // speed
  speedDisplayEl: document.getElementById("speed"),
  speedButtons: {
    x1: document.getElementById("speedx1"),
    x2: document.getElementById("speedx2"),
    x3: document.getElementById("speedx3"),
  },
  // player state
  playerDisplayEl: document.getElementById("player"),
  playerButtons: {
    alone: document.getElementById("state_alone"),
    partner: document.getElementById("state_partner"),
  },
  // audio
  controlAudioEl: document.getElementById("control_audio"),
  audioMainEl: document.getElementById("Audio"),
  audioBaitEl: document.getElementById("Audio_bait"),
  // box
  boxes: document.querySelectorAll(".box"),

  /**
   * app.js
   */
  canvasEl: document.getElementById("Canvas"),
  timePlayEl: document.getElementById("time_play"),
  scorePlayerEls: [
    document.getElementById("score_player_1"),
    document.getElementById("score_player_2"),
  ],
  usernameLocalEl: document.getElementById("username-local"),
  loserBoxEl: document.querySelector(".loser_box"),
  playButtonEl: document.getElementById("play"),
  playGameButtonEl: document.getElementById("play_game"),
  restartGameEls: document.querySelectorAll(".restart_game"),
  matchLocalBoxEl: document.querySelector(".match-local"),
  viewHistoryEls: document.querySelectorAll(".view_history"),
  matchServerBoxEl: document.querySelector(".match-server"),
  viewInfoPlayerEl: document.getElementById("view_infor_player"),
  tutorialButtonEl: document.getElementById("tutorial"),
};
