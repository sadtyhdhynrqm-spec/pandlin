export default {
  name: "المعرف",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 5,
  description: "الاطلاع على الآيدي الخاص بك أو بشخص آخر",
  role: "member",
  aliases: ["uid", "معرف"],
  execute: async ({ api, event }) => {
    const uid = event?.messageReply?.senderID
      || (Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions)[0] : event.senderID);
    const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ الـمـعـرف الـشـخـصـي ⟭
✺ ┇
✺ ┇ ◍ الـمـعـرف: ${uid}
✺ ┇
✧══════•❁◈❁•══════✧`;
    return api.sendMessage(msg, event.threadID, event.messageID);
  }
};
