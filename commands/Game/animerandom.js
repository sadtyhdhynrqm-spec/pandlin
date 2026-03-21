export default {
  name: "انمي",
  author: "حمودي سان",
  role: "member",
  description: "صورة عشوائية من الانمي",
  async execute({ api, event }) {
    const animePics = [
      "https://i.imgur.com/55sNlYv.jpg",
      "https://i.imgur.com/ReWuiwU.jpg",
      "https://i.imgur.com/sZW2vlz.png",
    ];
    const pic = animePics[Math.floor(Math.random() * animePics.length)];
    return api.sendMessage(
      `🎨 صورة انمي عشوائية ✨\n${pic}`,
      event.threadID,
      event.messageID
    );
  },
};
