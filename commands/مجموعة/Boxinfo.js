import fs from 'fs';
import request from 'request';

export default {
  name: "مجموعتي",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "عرض معلومات المجموعة",
  aliases: ["م_مج", "groupinfo"],
  execute: async function ({ api, event }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const memLength = threadInfo.participantIDs.length;
      let males = 0, females = 0, unknown = 0;
      for (let z in threadInfo.userInfo) {
        const g = threadInfo.userInfo[z].gender;
        if (g === "MALE") males++;
        else if (g === "FEMALE") females++;
        else unknown++;
      }
      let listad = '';
      for (let i = 0; i < threadInfo.adminIDs.length; i++) {
        const infu = await api.getUserInfo(threadInfo.adminIDs[i].id);
        listad += `✺ ┇    • ${infu[threadInfo.adminIDs[i].id].name}\n`;
      }
      const approvalMode = threadInfo.approvalMode ? '🔒 مُفعّل' : '🔓 مُعطّل';

      const body = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ مـعـلـومـات الـمـجـمـوعـة ⟭
✺ ┇
✺ ┇ ◍ الاسـم: ${threadInfo.threadName}
✺ ┇ ◍ الآيـدي: ${event.threadID}
✺ ┇ ◍ الإيـمـوجـي: ${threadInfo.emoji || "—"}
✺ ┇ ◍ الـمـوافـقـة: ${approvalMode}
✺ ┇ ◍ الأعـضـاء: ${memLength}
✺ ┇ ◍ ذكـور: ${males} | إنـاث: ${females}
✺ ┇ ◍ الـرسـائـل: ${threadInfo.messageCount}
✺ ┇ ◍ الـمـشـرفـون (${threadInfo.adminIDs.length}):
${listad}✺ ┇
✧══════•❁◈❁•══════✧`;

      const callback = () => {
        const imgPath = process.cwd() + '/cache/1.png';
        if (fs.existsSync(imgPath)) {
          api.sendMessage({ body, attachment: fs.createReadStream(imgPath) }, event.threadID, () => {
            try { fs.unlinkSync(imgPath); } catch (e) {}
          }, event.messageID);
        } else {
          api.sendMessage(body, event.threadID, event.messageID);
        }
      };

      if (threadInfo.imageSrc) {
        request(encodeURI(threadInfo.imageSrc))
          .pipe(fs.createWriteStream(process.cwd() + '/cache/1.png'))
          .on('close', callback);
      } else {
        api.sendMessage(body, event.threadID, event.messageID);
      }
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ في جلب معلومات المجموعة\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  },
};
