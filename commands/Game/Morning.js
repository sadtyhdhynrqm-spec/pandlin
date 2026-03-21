export default {
  name: "صبح",
  author: "حمودي سان",
  cooldowns: 5,
  description: "رسالة صبح",
  execute: async ({ api, event }) => {
    const msg = `
☀️ صبحكم نور يا سنافري! 🌼
النهار كله بخلكم، والسعادة معاكم!
من: حمودي سان 🇸🇩
    `;
    api.sendMessage(msg, event.threadID);
  }
};
