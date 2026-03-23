import fs from "fs";
const emojiJSON = JSON.parse(fs.readFileSync("./cache12/emoji/emoji.json", "utf-8"));

export default {
  name: "ضبط_إيموجي",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 60,
  description: "تغيير إيموجي المجموعة",
  role: "admin",
  aliases: ["setemoji"],

  async execute({ api, event, args }) {
    try {
      const [emoji] = args;
      if (!emoji || !emojiJSON.includes(emoji)) {
        return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ أدخل إيموجي صالح\n✺ ┇ مثال: ضبط_إيموجي 🌸\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
      }
      await api.changeThreadEmoji(emoji, event.threadID);
      api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ✅ تم تغيير إيموجي المجموعة إلى ${emoji}\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ أثناء التغيير\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
