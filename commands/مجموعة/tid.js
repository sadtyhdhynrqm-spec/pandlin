import fs from 'fs-extra';
import request from 'request';

export default {
  name: "تيد",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  aliases: ["tid", "معرف_المجموعة"],
  description: "جلب صورة ومعرف المجموعة",
  execute: async function ({ api, event }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const body = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ مـعـرف الـمـجـمـوعـة ⟭
✺ ┇
✺ ┇ ◍ الاسـم: ${threadInfo.threadName}
✺ ┇ ◍ الـمـعـرف: ${event.threadID}
✺ ┇
✧══════•❁◈❁•══════✧`;

      if (threadInfo.imageSrc) {
        const imgPath = process.cwd() + '/cache/thread.png';
        request(threadInfo.imageSrc)
          .pipe(fs.createWriteStream(imgPath))
          .on('close', () => {
            api.sendMessage({ body, attachment: fs.createReadStream(imgPath) }, event.threadID, () => {
              try { fs.unlinkSync(imgPath); } catch (e) {}
            }, event.messageID);
          });
      } else {
        api.sendMessage(body, event.threadID, event.messageID);
      }
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ في جلب معلومات المجموعة\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
