export const varCss = (name, value) => {
  if (name[0] != "-") name = "--" + name;
  if (value) document.documentElement.style.setProperty(name, value);
  return getComputedStyle(document.documentElement).getPropertyValue(name);
};

export const listColor = [
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

export const getRandomInt = (max) => Math.floor(Math.random() * max);

export const convertTime = (second) => {
  let time = "";
  const h = Math.floor(second / 3600);
  time += h < 10 ? `0${h}` : `${h}`;
  const m = Math.floor((second - h * 3600) / 60);
  time += m < 10 ? `:0${m}` : `:${m}`;
  const s = second - 3600 * h - 60 * m;
  time += s < 10 ? `:0${s}` : `:${s}`;
  return time;
};

export function getMountedSize({ widthName, heightName }) {
  const style = getComputedStyle(document.documentElement);
  const cssWidth = style.getPropertyValue(widthName);
  const cssHeight = style.getPropertyValue(heightName);

  const temp = document.createElement("div");
  temp.style.width = cssWidth.trim();
  temp.style.minHeight = cssHeight.trim();
  document.body.appendChild(temp);

  const width = temp.offsetWidth;
  const height = temp.offsetHeight;
  document.body.removeChild(temp);

  return { width, height };
}
