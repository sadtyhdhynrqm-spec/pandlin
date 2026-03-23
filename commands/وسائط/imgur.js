import axios from "axios";

export default {
  name: "رابط",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 10,
  description: "رفع الصور إلى Imgur والحصول على رابط مباشر",
  role: "member",
  aliases: ["imgur", "upload"],

  async execute({ api, event }) {
    if (event.type !== "message_reply" || event.messageReply.attachments.length === 0) {
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رد على صورة تريد رفعها\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }

    const client = axios.create({ baseURL: "https://smfahim.xyz/" });
    const array = [];

    for (const { url } of event.messageReply.attachments) {
      try {
        const response = await client.get(`imgur?url=${encodeURIComponent(url)}`);
        array.push(response.data.uploaded.image);
      } catch (err) { console.log(err); }
    }

    const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ رفـع الـصـور ⟭
✺ ┇
✺ ┇ ✅ تم رفع ${array.length} صورة بنجاح
✺ ┇
${array.map(u => `✺ ┇ 🔗 ${u}`).join("\n")}
✺ ┇
✧══════•❁◈❁•══════✧`;
    return api.sendMessage(msg, event.threadID, event.messageID);
  },
};
