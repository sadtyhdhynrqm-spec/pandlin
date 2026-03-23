import fs from 'fs';
import axios from 'axios';
import path from 'path';

export default {
  name: "تشابه",
  author: "سينكو 𓆩☆𓆪",
  description: "البحث عن صور مشابهة للصورة المرسلة",
  role: "member",
  aliases: ["بحث_صورة"],
  execute: async ({ api, event, args }) => {
    let imageUrl;
    api.setMessageReaction("🕐", event.messageID, () => {}, true);
    if (event.messageReply?.attachments?.length > 0) {
      imageUrl = event.messageReply.attachments[0].url;
    } else if (args.length > 0) {
      imageUrl = args[0];
    } else {
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ رد على صورة أو أرسل رابطها\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }

    try {
      const response = await axios.get(`https://www.samirxpikachu.run.place/glens?url=${encodeURIComponent(imageUrl)}`);
      const results = response.data.slice(0, 6);

      if (results.length === 0) {
        return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ لم يتم العثور على نتائج\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
      }

      const attachments = await Promise.all(
        results.map(async (result, index) => {
          const thumbnailResponse = await axios.get(result.thumbnail, { responseType: 'stream' });
          const filePath = path.join(process.cwd(), 'cache', `thumbnail_${index}.jpg`);
          const writer = fs.createWriteStream(filePath);
          thumbnailResponse.data.pipe(writer);
          return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(fs.createReadStream(filePath)));
            writer.on('error', reject);
          });
        })
      );

      api.setMessageReaction("✅", event.messageID, () => {}, true);
      await api.sendMessage({
        body: `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ بـحـث الـصـور الـمـشـابـهـة ⟭\n✺ ┇\n✺ ┇ ✅ وجدت ${results.length} نتيجة مشابهة\n✺ ┇\n✧══════•❁◈❁•══════✧`,
        attachment: attachments
      }, event.threadID, event.messageID);

      attachments.forEach(stream => { try { if (fs.existsSync(stream.path)) fs.unlinkSync(stream.path); } catch (e) {} });
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ في البحث\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
