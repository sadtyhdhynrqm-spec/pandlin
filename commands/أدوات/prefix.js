import fs from "fs";
import path from "path";
import axios from "axios";

export default {
  name: "الرمز",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 30,
  description: "عرض بادئة المجموعة",
  role: "member",
  aliases: ["prefix", "البادئة"],
  execute: async ({ event, api }) => {
    api.setMessageReaction("❓", event.messageID, () => {}, true);
    const prefix = global.client?.config?.prefix || "*";
    const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ بـادئـة الـبـوت ⟭
✺ ┇
✺ ┇ ◍ البادئة الحالية: 『 ${prefix} 』
✺ ┇
✺ ┇ ⠇استخدمها قبل أي أمر
✺ ┇
✧══════•❁◈❁•══════✧`;

    const videoLink = 'https://i.ibb.co/T2SV06R/download.gif';
    const tmpFolderPath = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpFolderPath)) fs.mkdirSync(tmpFolderPath);
    const gifPath = path.join(tmpFolderPath, 'prefix.gif');

    try {
      const gifResponse = await axios.get(videoLink, { responseType: 'arraybuffer' });
      fs.writeFileSync(gifPath, Buffer.from(gifResponse.data, 'binary'));
      await api.sendMessage({ body: msg, attachment: fs.createReadStream(gifPath) }, event.threadID, event.messageID);
    } catch {
      await api.sendMessage(msg, event.threadID, event.messageID);
    }
  },
};
