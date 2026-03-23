export default {
  name: "رصيدي",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 5,
  description: "يعرض رصيدك المالي أو رصيد شخص آخر",
  role: "member",
  aliases: ["رصيد"],
  async execute({ api, event, Economy }) {
    try {
      let targetID = event.senderID;
      if (event.messageReply) {
        targetID = event.messageReply.senderID;
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      }
      const userInfo = await api.getUserInfo(targetID);
      const userName = userInfo[targetID].name;
      const balance = await Economy.getBalance(targetID);
      const money = balance.data;

      const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ رصـيـد الـمـحـفـظـة ⟭
✺ ┇
✺ ┇ ◍ الإسـم: ${userName}
✺ ┇ ◍ الـرصـيـد: ${money} 💵
✺ ┇
✺ ┇ ⠇اسـتـخـدم بنك لإدارة رصـيـدك
✺ ┇
✧══════•❁◈❁•══════✧`;
      return api.sendMessage(msg, event.threadID, event.messageID);
    } catch (error) {
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ، أعد المحاولة\n✧══════•❁◈❁•══════✧", event.threadID);
    }
  },
};
