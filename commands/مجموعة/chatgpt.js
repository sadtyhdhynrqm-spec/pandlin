export default {
  name: 'لاست',
  author: 'سينكو 𓆩☆𓆪',
  role: "owner",
  description: 'مغادرة مجموعة محددة',
  execute: async ({ api, event, args }) => {
    try {
      if (!args[0]) {
        const inbox = await api.getThreadList(100, null, ['INBOX']);
        const list = inbox.filter(g => g.isSubscribed && g.isGroup);
        const listthread = [];
        for (const groupInfo of list) {
          const data = await api.getThreadInfo(groupInfo.threadID);
          listthread.push({ id: groupInfo.threadID, name: groupInfo.name, membersCount: data.userInfo.length });
        }
        const listbox = listthread.sort((a, b) => b.membersCount - a.membersCount);
        let rows = "";
        const groupid = [];
        listbox.forEach((group, i) => {
          rows += `✺ ┇ ${i + 1}. ${group.name}\n✺ ┇    أعضاء: ${group.membersCount} | ID: ${group.id}\n✺ ┇\n`;
          groupid.push(group.id);
        });
        const msg = `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ قـائـمـة الـمـجـمـوعـات ⟭\n✺ ┇\n${rows}✺ ┇ رد برقم المجموعة للمغادرة\n✺ ┇\n✧══════•❁◈❁•══════✧`;
        api.sendMessage(msg, event.threadID, (e, info) => {
          global.client.handler.reply.set(info.messageID, {
            author: event.senderID, type: 'pick', name: 'لاست', groupid, unsend: true,
          });
        });
      } else {
        api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رد برقم المجموعة من القائمة\n✧══════•❁◈❁•══════✧", event.threadID);
      }
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ خطأ في جلب قائمة المجموعات\n✧══════•❁◈❁•══════✧", event.threadID);
    }
  },
  onReply: async ({ api, event, reply }) => {
    if (reply.type !== 'pick') return;
    if (event.senderID !== reply.author) return;
    const selectedNumber = parseInt(event.body);
    if (isNaN(selectedNumber) || selectedNumber < 1 || selectedNumber > reply.groupid.length) {
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رقم غير صالح\n✧══════•❁◈❁•══════✧", event.threadID);
    }
    const selectedGroupId = reply.groupid[selectedNumber - 1];
    try {
      await api.removeUserFromGroup(api.getCurrentUserID(), selectedGroupId);
      api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ✅ تم الخروج من المجموعة\n✧══════•❁◈❁•══════✧`, event.threadID);
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ خطأ في مغادرة المجموعة\n✧══════•❁◈❁•══════✧", event.threadID);
    }
    await api.unsendMessage(reply.messageID);
  },
};
