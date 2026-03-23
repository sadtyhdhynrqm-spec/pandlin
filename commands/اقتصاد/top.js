import fs from "fs";
import path from "path";

const userDataFile = path.join(process.cwd(), 'pontsData.json');

export default {
  name: "توب",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "أعلى المتصدرين في النقاط",
  execute: async function ({ api, event }) {
    try {
      if (!fs.existsSync(userDataFile)) {
        return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ لا توجد بيانات بعد\n✧══════•❁◈❁•══════✧", event.threadID);
      }
      const pointsData = JSON.parse(fs.readFileSync(userDataFile, 'utf8'));
      const topUsers = Object.values(pointsData).sort((a, b) => b.points - a.points).slice(0, 5);

      const medals = ["🥇", "🥈", "🥉", "🏅", "🏅"];
      let rows = "";
      topUsers.forEach((user, index) => {
        rows += `✺ ┇ ${medals[index]} ${user.name} — ${user.points} نقطة\n`;
      });

      const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ قـائـمـة الـمـتـصـدريـن ⟭
✺ ┇
${rows}✺ ┇
✧══════•❁◈❁•══════✧`;
      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ في جلب البيانات\n✧══════•❁◈❁•══════✧", event.threadID);
    }
  }
};
