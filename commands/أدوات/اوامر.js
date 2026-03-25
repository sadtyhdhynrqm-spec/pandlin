import axios from 'axios';
import fs from 'fs';
import path from 'path';

const NEZHA_IMAGES = [
  "https://i.imgur.com/w0YCAM3.gif",
  "https://i.imgur.com/ZqO7rad.gif",
  "https://i.imgur.com/9hWHHlG.gif",
  "https://i.imgur.com/6a3IJID.gif",
  "https://i.imgur.com/V5L9dPi.jpeg",
  "https://i.imgur.com/dDSh0wc.jpeg",
  "https://i.imgur.com/UucSRWJ.jpeg",
  "https://i.imgur.com/OYzHKNE.jpeg",
  "https://i.imgur.com/M7HEAMA.jpeg",
  "https://i.imgur.com/MnAwD8U.jpg",
  "https://i.imgur.com/wBmOD7L.gif",
];

async function getRandomImage() {
  const url = NEZHA_IMAGES[Math.floor(Math.random() * NEZHA_IMAGES.length)];
  try {
    const res = await axios.get(url, { responseType: "arraybuffer", timeout: 10000 });
    const cachePath = path.join(process.cwd(), "cache");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);
    const imgPath = path.join(cachePath, `help_${Date.now()}.jpg`);
    fs.writeFileSync(imgPath, Buffer.from(res.data));
    return imgPath;
  } catch {
    return null;
  }
}

export default {
  name: "مساعدة",
  author: "زايرو",
  role: "member",
  aliases: ["help", "اوامر"],
  description: "عرض قائمة الأوامر التلقائية",
  cooldowns: 5,

  execute: async ({ api, event }) => {
    const config = global.client?.config || {};
    const prefix = config.prefix || "*";
    const commands = global.client?.commands || new Map();
    const adminIDs = config.ADMIN_IDS || ["61588108307572"]; // تأكد من وضع ID المطور هنا
    const isAdmin = adminIDs.includes(event.senderID);

    let categories = {};
    let adminCommands = [];

    // توزيع الأوامر تلقائياً بناءً على الـ Role أو التصنيف
    commands.forEach((cmd, name) => {
      if (cmd.role === "admin" || cmd.role === "owner" || adminIDs.includes(name)) {
        adminCommands.push(name);
      } else {
        const cat = cmd.category || "عام";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
      }
    });

    let msg = `╭─── ⋅ ⋅ ─── ✩ ─── ⋅ ⋅ ───╮\n`;
    msg += `       ✨ قـائـمـة الأوامـر ✨\n`;
    msg += `╰─── ⋅ ⋅ ─── ✩ ─── ⋅ ⋅ ───╯\n\n`;
    msg += `🔹 البادئة: [ ${prefix} ]\n`;
    msg += `🔹 عدد الأوامر: ${commands.size}\n\n`;

    // عرض أوامر المستخدمين العاديين
    for (const [category, cmds] of Object.entries(categories)) {
      msg += `📂 ${category.toUpperCase()}\n`;
      msg += `» ${cmds.join(' | ')}\n\n`;
    }

    // إظهار قسم المطور فقط إذا كان المرسل هو المطور
    if (isAdmin && adminCommands.length > 0) {
      msg += `━━━━━━━━━━━━━━━━━━━\n`;
      msg += `🔐 قـسـم الـمـطـور\n`;
      msg += `» ${adminCommands.join(' | ')}\n`;
    }

    msg += `\n━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💡 تفاعل بـ (✨) لحذف الرسالة\n`;
    msg += `━━━━━━━━━━━━━━━━━━━`;

    const imgPath = await getRandomImage();

    if (imgPath) {
      try {
        await api.sendMessage(
          { body: msg, attachment: fs.createReadStream(imgPath) },
          event.threadID, (err) => {
            if (!err && fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          }, event.messageID
        );
        return;
      } catch (e) {
        console.error(e);
      }
    }
    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
