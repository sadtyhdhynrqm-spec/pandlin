export default {
  name: "اخترق",
  author: "حمودي سان",
  cooldowns: 5,
  description: "اختراق وهمي",
  execute: async ({ api, event, args }) => {
    const hackMessage = `
🧩 *نظام الاختراق الوهمي* 🧩
────────────────────
🟢 الاتصال متشفر
🔐 كسر التشفير...
⚡ جاري الولوج...
✅ تم الاختراق بنجاح!
────────────────────
من: حمودي سان 🇸🇩
    `;
    api.sendMessage(hackMessage, event.threadID);
  }
};
