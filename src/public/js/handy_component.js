// getcss
const varCss = (name, value) => {
  //get/set css variable
  if (name[0] != "-") name = "--" + name;
  if (value) document.documentElement.style.setProperty(name, value);
  return getComputedStyle(document.documentElement).getPropertyValue(name);
};
// list color
const listColor = [
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

// get random number: return 0 đến bé hơn n truyền vào
// ex. getRandomInt(2): có thể return: 0, 1
const getRandomInt = (max) => Math.floor(Math.random() * max);
// canvas.style.backgroundColor = `${listColor[getRandomInt(listColor.length)]}`;

// chuyển đổi second -> format_time
const convertTime = (second) => {
  let time = "";
  const h = Math.floor(second / 3600);
  time += h < 10 ? `0${h}` : `${h}`;
  const m = Math.floor((second - h * 3600) / 60);
  time += m < 10 ? `:0${m}` : `:${m}`;
  const s = second - 3600 * h - 60 * m;
  time += s < 10 ? `:0${s}` : `:${s}`;
  return time; // xuất dạng 00:00:00
};

// truyen ra ngoai
export { varCss, listColor, getRandomInt, convertTime };
