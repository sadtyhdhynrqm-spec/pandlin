import fs from "fs";
import path from "path";
import axios from "axios";

export default {
  name: "قولي",
  author: "حسين يعقوبي",
  aliases: ["قل"],
  role: "member",
  description: "تحويل النص إلى كلام بواسطة خدمة Noobs API Text-to-Voice.",

  execute: async ({ api, message, args, event }) => {
    if (args.length === 0) {

api.setMessageReaction("⚠️", event.messageID, (err) => {}, true);
      // إذا لم يتم إدخال أي نص
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ أدخل النص بعد الأمر\n✧══════•❁◈❁•══════✧", event.threadID);
    }

api.setMessageReaction("⏱️", event.messageID, (err) => {}, true);
    let lng = "ar";
    let say = args.join(" ");

    if (lng.includes(args[0])) {
      lng = args[0];
      args.shift();
      say = encodeURIComponent(args.join(" "));
    }

    try {
      // استخدام الـ API الجديد لتحويل النص إلى صوت
      const url = `https://www.noobs-api.000.pe/dipto/text2voiceV2?text=${say}&format=mp3&voiceModel=Nova`;
      const { data } = await axios.get(url);

      // التحقق من وجود رابط الصوت
      if (data.voiceUrl) {
        const audioResponse = await axios.get(data.voiceUrl, { responseType: "arraybuffer" });

        const audioPath = path.join(process.cwd(), "cache", "audio.mp3");
        fs.writeFileSync(audioPath, Buffer.from(audioResponse.data));

api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        await api.sendMessage({
          body: `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ تـحـويـل الـنـص ⟭\n✺ ┇\n✺ ┇ ✅ تم التحويل إلى صوت\n✺ ┇\n✧══════•❁◈❁•══════✧`,
          attachment: fs.createReadStream(audioPath)
        }, event.threadID);

        // إزالة الملف المؤقت بعد إرساله
        fs.unlinkSync(audioPath);
      } else {
        api.sendMessage("❌ لم يتم العثور على رابط الصوت.", event.threadID);
      }
    } catch (error) {
      console.error(error);
      await api.sendMessage("🐸 حدث خطأ أثناء تحويل النص إلى كلام.", event.threadID);
    }
  }
};