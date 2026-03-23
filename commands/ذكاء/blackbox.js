import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import tinyurl from 'tinyurl';

export default {
  name: "إزالة_الخلفية",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "إزالة الخلفية من صورة",
  aliases: ["removebg", "خلفية"],

  async execute({ api, event, args }) {
    api.setMessageReaction("⏱️", event.messageID, () => {}, true);

    function isValidUrl(s) { try { new URL(s); return true; } catch { return false; } }

    let imageUrl;
    if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
      const att = event.messageReply.attachments[0];
      if (!["photo", "sticker"].includes(att.type)) {
        return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رد على صورة صحيحة\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
      }
      imageUrl = att.url;
    } else if (args[0] && isValidUrl(args[0])) {
      imageUrl = args[0];
    } else {
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رد على صورة أو أرسل رابطها\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }

    try {
      const startTime = Date.now();
      const apiUrl = `https://www.noobs-api.000.pe/dipto/4kv2?imageUrl=${encodeURIComponent(imageUrl)}`;
      const response = await axios.get(apiUrl);

      if (response?.data?.mediumLink) {
        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        const imageStream = await axios({ url: response.data.mediumLink, responseType: 'stream' });
        const filePath = path.join(process.cwd(), 'cache', `${Date.now()}_removed_bg.png`);
        const writer = fs.createWriteStream(filePath);
        imageStream.data.pipe(writer);

        writer.on('finish', () => {
          api.setMessageReaction("✅", event.messageID, () => {}, true);
          api.sendMessage({
            body: `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ إزالة الخلفية ⟭\n✺ ┇\n✺ ┇ ✅ تمت إزالة الخلفية بنجاح\n✺ ┇ ⏰ الوقت: ${timeTaken} ثانية\n✺ ┇\n✧══════•❁◈❁•══════✧`,
            attachment: fs.createReadStream(filePath)
          }, event.threadID, () => { try { fs.unlinkSync(filePath); } catch (e) {} });
        });
      } else {
        throw new Error("فشل في معالجة الصورة");
      }
    } catch (error) {
      api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ❌ خطأ: ${error.message}\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    }
  }
};
