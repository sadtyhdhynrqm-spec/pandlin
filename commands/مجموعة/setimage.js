import axios from "axios";
import fs from "fs";

export default {
  name: "ضبط_الصورة",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 60,
  description: "تغيير صورة المجموعة",
  role: "admin",
  aliases: ["setimg"],

  async execute({ api, event }) {
    try {
      if (event.type !== "message_reply") {
        return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رد على صورة تريد تعيينها كصورة للمجموعة\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
      }
      if (event.messageReply.attachments.length !== 1) {
        return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رد على صورة واحدة فقط\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
      }
      const avatar = (await axios.get(event.messageReply.attachments[0].url, { responseType: "arraybuffer" })).data;
      const imgPath = `./cache/${event.senderID}_${event.threadID}.png`;
      fs.writeFileSync(imgPath, Buffer.from(avatar));
      await api.changeGroupImage(fs.createReadStream(imgPath), event.threadID, () => {
        try { fs.unlinkSync(imgPath); } catch (e) {}
      });
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ✅ تم تغيير صورة المجموعة بنجاح\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ أثناء تغيير الصورة\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
