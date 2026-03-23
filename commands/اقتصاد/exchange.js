import fs from 'fs-extra';
import path from 'path';

const userDataFile = path.join(process.cwd(), 'pontsData.json');

export default {
  name: "صرف",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "تحويل النقاط إلى مال أو مال إلى نقاط",
  async execute({ api, event, Economy }) {
    const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ بـنـك الـصـرف ⟭
✺ ┇
✺ ┇ ◍ رد بـ نقاط لتحويل المال → نقاط
✺ ┇ ◍ رد بـ نقود لتحويل النقاط → مال
✺ ┇ ◍ نقطة = 5 دولار 💵
✺ ┇
✧══════•❁◈❁•══════✧`;
    const initialResponse = await api.sendMessage(msg, event.threadID, event.messageID);
    global.client.handler.reply.set(initialResponse.messageID, {
      author: event.senderID,
      type: "conversionChoice",
      unsend: true,
      name: "صرف",
    });
  },
  onReply: async function ({ api, event, reply, Economy }) {
    const userData = fs.readJsonSync(userDataFile, { throws: false }) || {};
    const userPoints = userData[event.senderID]?.points || 0;
    const userBalance = (await Economy.getBalance(event.senderID)).data;

    switch (reply.type) {
      case "conversionChoice": {
        const choice = event.body.toLowerCase();
        if (choice === "نقاط") {
          if (userBalance < 5) {
            return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رصيدك غير كافٍ (أقل من 5 دولار)\n✧══════•❁◈❁•══════✧", event.threadID);
          }
          const nextResponse = await api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ 💰 أدخل المبلغ بالدولار للتحويل إلى نقاط\n✧══════•❁◈❁•══════✧", event.threadID);
          global.client.handler.reply.set(nextResponse.messageID, { author: event.senderID, type: "convertToPoints", unsend: true, name: "صرف" });
        } else if (choice === "نقود") {
          if (userPoints <= 0) {
            return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ ليس لديك نقاط كافية\n✧══════•❁◈❁•══════✧", event.threadID);
          }
          const nextResponse = await api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ 💎 أدخل عدد النقاط للتحويل إلى مال\n✧══════•❁◈❁•══════✧", event.threadID);
          global.client.handler.reply.set(nextResponse.messageID, { author: event.senderID, type: "convertToMoney", unsend: true, name: "صرف" });
        } else {
          return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رد بـ نقاط أو نقود فقط\n✧══════•❁◈❁•══════✧", event.threadID);
        }
        break;
      }
      case "convertToPoints": {
        const amount = parseInt(event.body);
        if (isNaN(amount) || amount <= 0) return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ أدخل رقمًا صحيحًا\n✧══════•❁◈❁•══════✧", event.threadID);
        if (userBalance < amount) return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رصيدك غير كافٍ\n✧══════•❁◈❁•══════✧", event.threadID);
        const points = Math.floor(amount / 5);
        await Economy.decrease(amount, event.senderID);
        userData[event.senderID] = userData[event.senderID] || { points: 0 };
        userData[event.senderID].points += points;
        fs.writeJsonSync(userDataFile, userData);
        return api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ✅ تم تحويل ${amount} دولار → ${points} نقطة\n✧══════•❁◈❁•══════✧`, event.threadID);
      }
      case "convertToMoney": {
        const amount = parseInt(event.body);
        if (isNaN(amount) || amount <= 0) return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ أدخل رقمًا صحيحًا\n✧══════•❁◈❁•══════✧", event.threadID);
        if (userPoints < amount) return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ نقاطك غير كافية\n✧══════•❁◈❁•══════✧", event.threadID);
        const money = amount * 5;
        userData[event.senderID].points -= amount;
        fs.writeJsonSync(userDataFile, userData);
        await Economy.increase(money, event.senderID);
        return api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ✅ تم تحويل ${amount} نقطة → ${money} دولار\n✧══════•❁◈❁•══════✧`, event.threadID);
      }
    }
  },
};
