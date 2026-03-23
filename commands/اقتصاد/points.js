import fs from "fs";
import path from "path";

const userDataFile = path.join(process.cwd(), 'pontsData.json');

export default {
  name: "نقاط",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "عرض نقاطك أو نقاط عضو محدد",
  aliases: ["نقاطي"],
  execute: async function ({ api, event }) {
    try {
      let targetID = event.senderID;
      if (event.messageReply) {
        targetID = event.messageReply.senderID;
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      }
      if (!fs.existsSync(userDataFile)) {
        return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ لا توجد بيانات بعد\n✧══════•❁◈❁•══════✧", event.threadID);
      }
      const userData = JSON.parse(fs.readFileSync(userDataFile, 'utf8'));
      const userPoints = userData[targetID]?.points || 0;
      const userName = userData[targetID]?.name || "المستخدم";

      const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ نـقـاط الـعـضـو ⟭
✺ ┇
✺ ┇ ◍ الإسـم: ${userName}
✺ ┇ ◍ الـنـقـاط: ${userPoints} 🏆
✺ ┇
✧══════•❁◈❁•══════✧`;
      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ في جلب النقاط\n✧══════•❁◈❁•══════✧", event.threadID);
    }
  }
};
