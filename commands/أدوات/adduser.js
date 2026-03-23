import axios from 'axios';

async function getUID(url) {
  if (url.includes("facebook.com") || url.includes("fb.com")) {
    try {
      if (!url.startsWith("https://") && !url.startsWith("http://")) url = "https://" + url;
      const response = await axios.get(`https://joshweb.click/api/findid?url=${encodeURIComponent(url)}`);
      return response.data.status ? [response.data.result, null, false] : [null, null, true];
    } catch { return [null, null, true]; }
  } else {
    return ["رابط غير صالح", null, true];
  }
}

export default {
  name: "ضفي",
  author: "سينكو 𓆩☆𓆪",
  description: "إضافة عضو إلى المجموعة عبر رابط البروفايل",
  aliases: ["add", "ضيفي", "اضف"],
  role: "admin",
  execute: async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const out = msg => api.sendMessage(msg, threadID, messageID);

    if (!args[0]) {
      return out(`✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ أرسل رابط البروفايل\n✺ ┇ مثال: ضفي facebook.com/...\n✧══════•❁◈❁•══════✧`);
    }

    try {
      const { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
      const participantIDsParsed = participantIDs.map(e => parseInt(e));
      const botID = api.getCurrentUserID();

      const [id, , fail] = await getUID(args[0]);
      if (fail) return out(`✧══════•❁◈❁•══════✧\n✺ ┇ ❌ ${id || "لم يُعثر على المعرف"}\n✧══════•❁◈❁•══════✧`);

      const uid = parseInt(id);
      if (participantIDsParsed.includes(uid)) {
        return out(`✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ العضو موجود بالفعل في المجموعة\n✧══════•❁◈❁•══════✧`);
      }

      const userInfo = await api.getUserInfo(uid);
      const userName = userInfo[uid]?.name || "العضو";
      const admins = adminIDs.map(e => parseInt(e.id));

      await api.addUserToGroup(uid, threadID);

      if (approvalMode && !admins.includes(botID)) {
        out(`✧══════•❁◈❁•══════✧\n✺ ┇ ✅ تمت إضافة ${userName} إلى قائمة الموافقة\n✧══════•❁◈❁•══════✧`);
      } else {
        out(`✧══════•❁◈❁•══════✧\n✺ ┇ ✅ تمت إضافة ${userName} إلى المجموعة 🎉\n✧══════•❁◈❁•══════✧`);
      }
    } catch (e) {
      out(`✧══════•❁◈❁•══════✧\n✺ ┇ 🚫 لا يمكن إضافة العضو: ${e.message}\n✧══════•❁◈❁•══════✧`);
    }
  },
};
