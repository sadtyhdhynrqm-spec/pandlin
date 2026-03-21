import axios from "axios";
import fs from "fs-extra";
import path from "path";

export default {
  name: "قبر2",
  author: "Your Name",
  role: "member",
  description: "قم بعمل RIP لشخص.",
  execute: async ({ api, event }) => {
    let chilli;
    let pogi;

    if (event.messageReply) {
      chilli = event.messageReply.senderID;
      pogi = (await api.getUserInfo([chilli]))[chilli].name;
    } else if (Object.keys(event.mentions).length > 0) {
      chilli = Object.keys(event.mentions)[0];
      pogi = (await api.getUserInfo([chilli]))[chilli].name;
    } else {
      return api.sendMessage("💀 | قـم بالـرد أو إعـمـل مـنـشـن ", event.threadID, event.messageID);
    }

    const pangit = await new Promise((resolve, reject) => {
      api.sendMessage(`💀 | جـارٍ مـعـالـجـة الـ RIP لـ ${pogi}...`, event.threadID, (err, info) => {
        if (err) return reject(err);
        resolve(info);
      }, event.messageID);
    });

    try {
      const ripMsg = `💀 ══════════════ 💀\n\n        † R.I.P †\n\n  ╔══════════════╗\n  ║  ${pogi}  ║\n  ╚══════════════╝\n\n  هنا يرقد من كان يُعرف بـ\n  「 ${pogi} 」\n\n  وداعًا إلى الأبد... 💔\n\n💀 ══════════════ 💀`;

      try {
        const pfpUrl = `https://api-turtle.vercel.app/api/facebook/pfp?uid=${chilli}`;
        const pfpRes = await axios.get(pfpUrl, { timeout: 10000 });
        const imgUrl = pfpRes.data?.url || pfpRes.data?.pfp;

        if (imgUrl) {
          const imagePath = path.join(process.cwd(), 'cache', `${chilli}_rip.jpg`);
          const imgData = await axios.get(imgUrl, { responseType: 'arraybuffer', timeout: 10000 });
          await fs.writeFile(imagePath, Buffer.from(imgData.data));

          await api.sendMessage({ body: ripMsg, attachment: fs.createReadStream(imagePath) }, event.threadID);
          try { await fs.unlink(imagePath); } catch(e) {}
        } else {
          await api.sendMessage(ripMsg, event.threadID);
        }
      } catch(e) {
        await api.sendMessage(ripMsg, event.threadID);
      }

      api.unsendMessage(pangit.messageID);
    } catch (error) {
      console.error('Error:', error);
      await api.editMessage("❌ فشلت معالجة طلب RIP. حاول مرة أخرى.", pangit.messageID);
    }
  }
};
