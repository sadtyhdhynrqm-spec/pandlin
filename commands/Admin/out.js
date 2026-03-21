export default {
  name: "غادري",
  author: "kaguya project",
  role: "admin",
  description: "إزالة مستخدم من المجموعة",
  aliases : ["وزعي"],
  execute: async ({ api, event, args }) => {
    const permission = [`61588108307572`,
                         '61588108307572'];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("❌ | آسفة هذا خاص بحسين فقط", event.threadID, event.messageID);
    }

    // إرسال رسالة تطلب من المستخدم الرد بـ 'تم' للمغادرة
    api.sendMessage("🛑 | رد على هذه الرسالة بـ 'تم' من أجل مغادرة المجموعة", event.threadID, (err, info) => {
      if (!err) {
        global.client.handler.reply.set(info.messageID, {
          author: event.senderID,
          type: "pick",
          name: "غادري",
          unsend: true,
        });
      } else {
        console.error("Error sending message:", err);
      }
    });
  },

  // دالة معالجة الردود
  onReply: async ({ api, event, reply, Users }) => {
    // التحقق من أن الشخص الذي يرد هو نفس الشخص الذي أرسل الأمر الأصلي
    if (reply.type === "pick" && event.senderID === reply.author) {
      if (event.body.trim().toLowerCase() === "تم") {
        // تأكيد المغادرة
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        api.sendMessage("✅ | تم تأكيد المغادرة بنجاح من طرف المطور. وداعا يا أصدقاء، اعتنوا بأنفسكم.", event.threadID, () => {
          // إزالة المستخدم من المجموعة
          api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        });
      } else {
        api.sendMessage("⚠️ | يجب الرد بـ 'تم' لتأكيد المغادرة.", event.threadID);
      }
    } else {
      api.setMessageReaction("🚫", event.messageID, () => {}, true);
      api.sendMessage("❌ | لا يمكنك تأكيد المغادرة. هذا الأمر مخصص للمطور فقط.", event.threadID);
    }
  }
};
