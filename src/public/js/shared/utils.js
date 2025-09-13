import { listColor } from "./constant.js";

export const varCss = (name, value) => {
  if (name[0] != "-") name = "--" + name;
  if (value) document.documentElement.style.setProperty(name, value);
  return getComputedStyle(document.documentElement).getPropertyValue(name);
};

export const getRandomInt = (max) => Math.floor(Math.random() * max);

export const getRandomColor = () => {
  return listColor[getRandomInt(listColor.length)];
};

export const convertTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
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
