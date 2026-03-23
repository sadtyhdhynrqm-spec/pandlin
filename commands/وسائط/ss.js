import axios from "axios";

async function getWiki(q) {
  try {
    const response = await axios.get(`https://ar.wikipedia.org/api/rest_v1/page/summary/${q}`);
    return response.data;
  } catch (error) { return undefined; }
}

export default {
  name: "ويكيبيديا",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "جلب معلومات من ويكيبيديا",
  aliases: ["wiki"],
  execute: async ({ api, event }) => {
    const data = event.body.split(' ');
    if (data.length < 2) {
      return api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ استخدم: ويكيبيديا <كلمة>\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    }
    data.shift();
    try {
      const res = await getWiki(data.join(' '));
      if (!res || !res.title) throw new Error("لم يتم العثور على نتائج");
      const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ ويـكـيـبـيـديـا ⟭
✺ ┇
✺ ┇ ◍ الـعـنـوان: ${res.title}
✺ ┇ ◍ الـوصـف: ${res.description || "—"}
✺ ┇
✺ ┇ 📖 ${(res.extract || "").slice(0, 500)}...
✺ ┇
✺ ┇ 🔗 https://ar.wikipedia.org
✺ ┇
✧══════•❁◈❁•══════✧`;
      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (err) {
      api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ❌ ${err.message}\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    }
  }
};
