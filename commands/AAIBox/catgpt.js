import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

export default {
  name: "جودة",
  author: "HUSSEIN YACOUBI",
  role: "member",
  aliases: ["تحسين", "رفع", "4k"],
  description: "رفع جودة الصور",

  async execute({ api, event, args }) {
    api.setMessageReaction("⏱️", event.messageID, (err) => {}, true);

    function isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }

    let imageUrl;

    if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
      const replyAttachment = event.messageReply.attachments[0];
      if (["photo", "sticker"].includes(replyAttachment.type)) {
        imageUrl = replyAttachment.url;
      } else {
        return api.sendMessage({ body: `⚠️ | يرجى الرد على صورة صحيحة.` }, event.threadID, event.messageID);
      }
    } else if (args[0] && isValidUrl(args[0])) {
      imageUrl = args[0];
    } else {
      return api.sendMessage({ body: `⚠️ | رد على صورة أو أرسل رابط الصورة` }, event.threadID, event.messageID);
    }

    try {
      const imageStream = await axios({
        url: imageUrl,
        responseType: 'stream',
        timeout: 20000
      });

      const filePath = path.join(process.cwd(), 'cache', `${Date.now()}_enhanced.jpg`);
      const writer = fs.createWriteStream(filePath);
      imageStream.data.pipe(writer);

      writer.on('finish', () => {
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        api.sendMessage({
          body: `━━━━━━━◈✿◈━━━━━━━\n✅ | تم إعادة إرسال الصورة\n⚠️ | خدمة رفع الجودة غير متاحة حالياً\n━━━━━━━◈✿◈━━━━━━━`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => {
          try { fs.unlinkSync(filePath); } catch(e) {}
        });
      });

      writer.on('error', (err) => {
        api.sendMessage({ body: `🚧 | حدث خطأ أثناء معالجة الصورة.` }, event.threadID, event.messageID);
      });
    } catch (error) {
      console.error('Error processing image:', error);
      api.sendMessage({ body: `🚧 | حدث خطأ أثناء معالجة الصورة.` }, event.threadID, event.messageID);
    }
  }
};
