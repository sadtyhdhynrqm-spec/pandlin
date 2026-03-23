import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';

export default {
  name: "يوتيوب",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 60,
  description: "تحميل فيديو أو صوت من YouTube",
  role: "member",
  aliases: ["youtube", "يوتوب"],

  async execute({ api, event }) {
    const input = event.body.trim().split(" ");
    const type = input[1];

    if (input.length < 3 || (type !== "فيديو" && type !== "صوت")) {
      return api.sendMessage(`✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ يـوتـيـوب ⟭
✺ ┇
✺ ┇ ◍ يوتيوب فيديو <اسم المقطع>
✺ ┇ ◍ يوتيوب صوت <اسم المقطع>
✺ ┇
✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    }

    const videoName = input.slice(2).join(" ");
    const searchUrl = `https://rapido.zetsu.xyz/api/ytsearch?query=${encodeURIComponent(videoName)}`;

    try {
      const sentMessage = await api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ 🔎 جاري البحث عن "${videoName}"...\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);

      const searchRes = await axios.get(searchUrl);
      const results = searchRes.data.data;

      if (!results || results.length === 0) {
        return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ لم يتم العثور على نتائج\n✧══════•❁◈❁•══════✧", event.threadID);
      }

      const video = results[0];
      const apiUrl = `https://hazeyyyy-rest-apis.onrender.com/api/youtubedl3?url=${encodeURIComponent(video.url)}`;
      const downloadRes = await axios.get(apiUrl);
      const links = downloadRes.data.youtube?.data?.[0]?.links;

      if (!links) return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ فشل في استخراج روابط التحميل\n✧══════•❁◈❁•══════✧", event.threadID);

      let downloadLink = type === "فيديو" ? links.find(l => l[0] === "mp4") : links.find(l => l[0] === "m4a");

      if (!downloadLink || !downloadLink[3]) {
        return api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ❌ لم يتم العثور على رابط ${type}\n✧══════•❁◈❁•══════✧`, event.threadID);
      }

      const ext = type === "فيديو" ? "mp4" : "m4a";
      const filePath = path.join(process.cwd(), 'cache', `${event.senderID}.${ext}`);

      api.setMessageReaction("⬇️", event.messageID, () => {}, true);
      const writer = fs.createWriteStream(filePath);
      const stream = await axios({ url: downloadLink[3], responseType: 'stream' });
      stream.data.pipe(writer);

      writer.on('finish', () => {
        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('✧══════•❁◈❁•══════✧\n✺ ┇ ❌ الملف أكبر من 25MB\n✧══════•❁◈❁•══════✧', event.threadID);
        }
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        api.sendMessage({
          body: `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ يـوتـيـوب ⟭\n✺ ┇\n✺ ┇ ✅ تم التحميل بنجاح\n✺ ┇ 🎵 ${video.title}\n✺ ┇\n✧══════•❁◈❁•══════✧`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath));
      });

    } catch (err) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ أثناء التنفيذ\n✧══════•❁◈❁•══════✧", event.threadID);
    }
  }
};
