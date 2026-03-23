import axios from "axios";
import fs from "fs";
import path from "path";
import os from "os";

export default {
  name: "اوبتايم",
  description: "عرض معلومات البوت الكاملة",
  aliases: ["up", "ابتايم", "معلومات_البوت"],

  execute: async function ({ api, event }) {
    try {
      api.setMessageReaction("🚀", event.messageID, () => {}, true);

      const config = global.client?.config || {};
      const commands = global.client?.commands || new Map();
      const events = global.client?.events || new Map();

      const uptime = process.uptime();
      const seconds = Math.floor(uptime % 60);
      const minutes = Math.floor((uptime / 60) % 60);
      const hours = Math.floor((uptime / 3600) % 24);
      const days = Math.floor(uptime / 86400);

      let uptimeStr;
      if (days > 0) uptimeStr = `${days}ي ${hours}س ${minutes}د ${seconds}ث`;
      else if (hours > 0) uptimeStr = `${hours}س ${minutes}د ${seconds}ث`;
      else if (minutes > 0) uptimeStr = `${minutes}د ${seconds}ث`;
      else uptimeStr = `${seconds}ث`;

      const memUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
      const memTotal = Math.round(os.totalmem() / 1024 / 1024);
      const cpuLoad = os.loadavg()[0].toFixed(2);
      const nodeVersion = process.version;
      const platform = os.platform();
      const botName = config.BOT_NAME || "سينكو";
      const prefix = config.prefix || "*";
      const adminCount = (config.ADMIN_IDS || []).length;
      const cmdCount = commands.size || 80;
      const evtCount = events instanceof Map ? events.size : 4;

      const infoMsg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ مـعـلـومـات الـبـوت ⟭
✺ ┇
✺ ┇ ◍ الاسـم: ${botName}
✺ ┇ ◍ الـحـالـة: شـغـال ✅
✺ ┇ ◍ مـدة الـتـشـغـيـل: ${uptimeStr}
✺ ┇ ◍ الـبـادئـة: 『 ${prefix} 』
✺ ┇
✺ ┇ ⏣ الإحـصـائـيـات
✺ ┇ ◍ الأوامـر: ${cmdCount} أمـر
✺ ┇ ◍ الأحـداث: ${evtCount} حـدث
✺ ┇ ◍ المطـوريـن: ${adminCount}
✺ ┇
✺ ┇ ⏣ مـوارد الـنـظـام
✺ ┇ ◍ الذاكـرة: ${memUsed}/${memTotal} MB
✺ ┇ ◍ المعـالـج: ${cpuLoad}%
✺ ┇ ◍ Node.js: ${nodeVersion}
✺ ┇ ◍ الـنـظـام: ${platform}
✺ ┇
✺ ┇ ⠇الـمـطـوࢪ: سـيـنـكـو 𓆩☆𓆪
✺ ┇
✧══════•❁◈❁•══════✧`;

      try {
        const categories = ["waifu", "neko", "shinobu", "megumin"];
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const imgRes = await axios.get(`https://api.waifu.pics/sfw/${cat}`, { timeout: 8000 });
        const imgUrl = imgRes.data.url;
        const imgResponse = await axios.get(imgUrl, { responseType: "arraybuffer", timeout: 10000 });
        const imgPath = path.join(process.cwd(), "cache", `uptime_${Date.now()}.jpg`);
        fs.writeFileSync(imgPath, Buffer.from(imgResponse.data));
        await api.sendMessage({ body: infoMsg, attachment: fs.createReadStream(imgPath) }, event.threadID, event.messageID);
        try { fs.unlinkSync(imgPath); } catch (e) {}
      } catch (imgErr) {
        await api.sendMessage(infoMsg, event.threadID, event.messageID);
      }
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ أثناء جلب المعلومات\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
