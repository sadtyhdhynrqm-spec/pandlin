import moment from 'moment-timezone';

const ownerFbIds = ["61588108307572"];

async function execute({ api, event }) {
  switch (event.logMessageType) {
    case "log:unsubscribe": {
      const { leftParticipantFbId } = event.logMessageData;
      if (leftParticipantFbId === api.getCurrentUserID()) return;

      try {
        const userInfo = await api.getUserInfo(leftParticipantFbId);
        const profileName = userInfo[leftParticipantFbId]?.name || "زول";
        
        // رسالة مغادرة بسيطة جداً بدون زخرفة
        const farewellMsg = `غادر: ${profileName}`;

        await api.sendMessage(farewellMsg, event.threadID);
      } catch (err) {
        console.error("خطأ في رسالة الوداع:", err.message);
      }
      break;
    }

    case "log:subscribe": {
      const { addedParticipants } = event.logMessageData;
      const botUserID = api.getCurrentUserID();
      const botAdded = addedParticipants.some(p => p.userFbId === botUserID);

      if (botAdded) {
        try {
          const threadInfo = await api.getThreadInfo(event.threadID);
          const threadName = threadInfo.threadName || "مجموعة";
          const membersCount = threadInfo.participantIDs.length;
          const addedBy = event.author;
          const addedByInfo = await api.getUserInfo(addedBy);
          const addedByName = addedByInfo[addedBy]?.name || "زول";

          if (!ownerFbIds.includes(addedBy)) {
            // تنبيه المطور (بدون زخرفة)
            const notifyMsg = `⚠️ إضافة جديدة:\n📍 المجموعه: ${threadName}\n👥 الأعضاء: ${membersCount}\n🧑 بواسطة: ${addedByName}`;
            await api.sendMessage(notifyMsg, ownerFbIds[0]).catch(() => {});

            await api.sendMessage(
              `⚠️ عذراً، البوت لا يعمل إلا في المجموعات المعتمدة من المطور.`,
              event.threadID
            );
            await api.removeUserFromGroup(botUserID, event.threadID);
          } else {
            await api.sendMessage(
              `✅ تم تفعيل البوت في: ${threadName}`,
              ownerFbIds[0]
            ).catch(() => {});
          }
        } catch (err) {
          console.error("خطأ في معالجة إضافة البوت:", err.message);
        }
      }
      break;
    }
  }
}

export default {
  name: "ترحيب_ومغادرة",
  description: "رسائل مغادرة بسيطة وحماية البوت.",
  execute,
};
