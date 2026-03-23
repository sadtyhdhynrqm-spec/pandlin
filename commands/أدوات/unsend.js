export default {
  name: "مسح",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 5,
  description: "مسح رسالة البوت عند الرد عليها",
  role: "member",
  aliases: ["del", "حذف_رسالة"],
  execute: async ({ api, event }) => {
    if (event?.messageReply?.senderID != api.getCurrentUserID()) {
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ لا يمكن مسح رسائل الآخرين\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
    return api.unsendMessage(event.messageReply.messageID, (err) => {
      if (err) {
        api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ أثناء المسح\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
      }
    });
  },
  events: async ({ api, event }) => {
    if (event.reaction && event.senderID == api.getCurrentUserID() && event.reaction === "😡") {
      api.unsendMessage(event.messageID);
    }
  },
};
