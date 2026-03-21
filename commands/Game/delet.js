export default {
  name: "احذف",
  author: "حمودي سان",
  role: "member",
  description: "حذف آخر رسالة أرسلها البوت",
  async execute({ api, event }) {
    const lastMessageID = global.client?.lastBotMessageID;
    if (lastMessageID) {
      api.unsendMessage(lastMessageID);
      return api.sendMessage("✅ تم حذف الرسالة.", event.threadID);
    } else {
      return api.sendMessage("❌ لا توجد رسالة للحذف.", event.threadID);
    }
  },
};
