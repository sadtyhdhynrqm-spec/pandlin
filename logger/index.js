import chalk from "chalk";

const colors = {
  red: "#ff0000",
  green: "#00ff00",
  yellow: "#ffff00",
  blue: "#0000ff",
  magenta: "#ff00ff",
  cyan: "#00ffff",
  white: "#ffffff",
  gray: "#808080",
  ocean: "#00bfff",
};

export const log = async (messages) => {
  const logMessage = messages.map(({ message, color }) => chalk.hex(colors[color])(message)).join("");
  console.log(logMessage, "");
};

export const notifer = async (title, message) => {
  console.log(`📢 [${title}] ${message}`);
};
