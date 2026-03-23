import axios from "axios";
import tinyurl from "tinyurl";
import fs from "fs";
import path from "path";

export default {
  name: "ارت",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "تحويل الصورة إلى أنمي بالذكاء الاصطناعي",
  aliases: ["art", "anime_art"],
  execute: async ({ api, event, args }) => {
    if (!event.messageReply?.attachments?.[0]) {
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رد على صورة تريد تحويلها\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
    const imgurl = encodeURIComponent(event.messageReply.attachments[0].url);
    api.setMessageReaction("⏰", event.messageID, () => {}, true);
    const lado = `https://xapiz.onrender.com/i2art?url=${imgurl}`;
    const cacheDir = path.join(process.cwd(), "cache");
    const filePath = path.join(cacheDir, `art_${event.senderID}_${Date.now()}.png`);
    try {
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      const response = await axios({ url: lado, method: "GET", responseType: "stream" });
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      writer.on("finish", () => {
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        api.sendMessage({
          body: `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ الـفـن الـرقـمـي ⟭\n✺ ┇\n✺ ┇ ✅ تم تحويل صورتك إلى أنمي\n✺ ┇\n✧══════•❁◈❁•══════✧`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => { try { fs.unlinkSync(filePath); } catch (e) {} }, event.messageID);
      });
      writer.on("error", () => api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ فشل في حفظ الصورة\n✧══════•❁◈❁•══════✧", event.threadID));
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ فشل في التحويل، أعد المحاولة\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
