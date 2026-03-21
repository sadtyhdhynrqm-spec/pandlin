import axios from "axios";
import fs from "fs-extra";
import path from "path";

function getRandomUserID(participantIDs) {
  const filteredIDs = participantIDs.filter(id => id !== "100060340563670" && id !== "100082247235177" && id !== "100047481257472" && id !== "61552229885334");
  return filteredIDs[Math.floor(Math.random() * filteredIDs.length)];
}

const rainbowColors = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣"];

export default {
  name: "شاذ",
  author: "Your Name",
  role: "member",
  description: "قم بالبحث عشوائيًا وإرسال اسم الشخص مع صورة قوس قزح لملف تعريفه.",
  execute: async ({ api, event }) => {
    const participantIDs = event.participantIDs;
    const randomUserID = getRandomUserID(participantIDs);

    try {
      const searchingMessage = await new Promise((resolve, reject) => {
        api.sendMessage("🔍 | جاري البحث عن شاذ في المجموعة...", event.threadID, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      const userInfo = (await api.getUserInfo([randomUserID]))[randomUserID];
      const userName = userInfo.name;

      const rainbow = rainbowColors.join("");

      const msg = `🏳️‍🌈 ══════════════ 🏳️‍🌈\n${rainbow}\n🔎 | نتيجة البحث:\n👤 هذا الشخص المسمى بـ\n『 ${userName} 』\nهو شاذ! 😂\n${rainbow}\n🏳️‍🌈 ══════════════ 🏳️‍🌈`;

      try {
        const pfpUrl = `https://api-turtle.vercel.app/api/facebook/pfp?uid=${randomUserID}`;
        const pfpRes = await axios.get(pfpUrl, { timeout: 10000 });
        const imgUrl = pfpRes.data?.url || pfpRes.data?.pfp;

        if (imgUrl) {
          const imagePath = path.join(process.cwd(), 'cache', `${randomUserID}_gay.jpg`);
          const imgData = await axios.get(imgUrl, { responseType: 'arraybuffer', timeout: 10000 });
          await fs.writeFile(imagePath, Buffer.from(imgData.data));

          await api.sendMessage({ body: msg, attachment: fs.createReadStream(imagePath) }, event.threadID);
          try { await fs.unlink(imagePath); } catch(e) {}
        } else {
          await api.sendMessage(msg, event.threadID);
        }
      } catch(e) {
        await api.sendMessage(msg, event.threadID);
      }

      api.unsendMessage(searchingMessage.messageID);
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage("❌ حدث خطأ أثناء تنفيذ الأمر.", event.threadID);
    }
  }
};
