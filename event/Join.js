import moment from 'moment-timezone';

async function execute({ api, event }) {
  if (event.logMessageType !== "log:subscribe") return;

  const { addedParticipants } = event.logMessageData;
  const botUserID = api.getCurrentUserID();

  const newMembers = addedParticipants.filter(p => p.userFbId !== botUserID);
  if (newMembers.length === 0) return;

  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const membersCount = threadInfo.participantIDs.length;
    const threadName = threadInfo.threadName || "المجموعة";
    const time = moment().tz("Africa/Khartoum").format("hh:mm A")
                  .replace('AM', 'صباحاً')
                  .replace('PM', 'مساءً');

    let namesArray = [];
    for (const member of newMembers) {
      const userInfo = await api.getUserInfo(member.userFbId);
      const name = userInfo[member.userFbId]?.name || "زول جديد";
      namesArray.push(name);
    }

    const allNames = namesArray.join(' ، ');

    // الزخرفة الفخمة الجديدة
    const welcomeMsg = 
      `╭─── ⋅ ⋅ ─── ✩ ─── ⋅ ⋅ ───╮\n` +
      `       ✨ مَـرحـب  ✨\n` +
      `\n\n` +
      `👤 الضيوف: ${allNames}\n` +
      `📍 المـكان: ${threadName}\n` +
      `👥 العـدد: ${membersCount}\n` +
      `⏰ الـزمن: ${time}\n\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `نورتوا الدار، الزموا الأدب عشان\n` +
      `القعدة تحلو وما نضطر نودعكم ✋\n` +
      `━━━━━━━━━━━━━━━━━━━`;

    await api.sendMessage(welcomeMsg, event.threadID);
  } catch (err) {
    console.error("خطأ في رسالة الترحيب:", err.message);
  }
}

export default {
  name: "ترحيب",
  description: "ترحيب جماعي بزخرفة فخمة",
  execute,
};
