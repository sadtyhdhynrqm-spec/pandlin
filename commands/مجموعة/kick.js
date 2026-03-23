export default {
  name: "طرد",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 10,
  description: "طرد عضو من المجموعة",
  role: "admin",
  aliases: ["kick", "إخراج"],

  async execute({ api, event, Threads }) {
    try {
      const mentions = Object.keys(event.mentions);
      const targetUserID = event?.messageReply?.senderID || (mentions.length > 0 ? mentions[0] : null);

      if (!targetUserID) {
        return api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رد على رسالة الشخص أو اعمل منشن له\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
      }

      const threadData = (await Threads.find(event.threadID))?.data?.data;
      if (!threadData.adminIDs.includes(api.getCurrentUserID())) {
        return api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ البوت يحتاج صلاحية الآدمن\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
      }

      await api.removeUserFromGroup(targetUserID, event.threadID);
      api.sendMessage(`✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ نـظـام الـطـرد ⟭
✺ ┇
✺ ┇ ✅ تم الطرد بنجاح
✺ ┇ 😌 ناقص عضو ناقصت مشكلة
✺ ┇
✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ غير متوقع\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
