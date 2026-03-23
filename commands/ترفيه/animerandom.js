export default {
  name: "انمي",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "صورة عشوائية من الانمي",
  async execute({ api, event }) {
    const animePics = [
      "https://i.imgur.com/55sNlYv.jpg",
      "https://i.imgur.com/ReWuiwU.jpg",
      "https://i.imgur.com/sZW2vlz.png",
      "https://i.imgur.com/KXtDqmB.jpg",
      "https://i.imgur.com/6Ctqwug.jpg",
      "https://i.imgur.com/JMmNkZ8.jpg",
      "https://i.imgur.com/BJfb9o6.jpg",
    ];
    const pic = animePics[Math.floor(Math.random() * animePics.length)];
    return api.sendMessage(
      `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ صـورة أنـمـي عـشـوائـيـة ⟭\n✺ ┇\n✺ ┇ ${pic}\n✺ ┇\n✧══════•❁◈❁•══════✧`,
      event.threadID,
      event.messageID
    );
  },
};
