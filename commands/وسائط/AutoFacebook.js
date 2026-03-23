import axios from "axios";
import path from "path";
import fs from "fs-extra";

class MultiDownloader {
  name = "تحميل";
  author = "S I N K O";
  role = "member";
  description = "تحميل دقيق وصاروخي للفيس والتيك توك بدون أخطاء.";

  async execute({ api, event, linkInput }) {
    const link = linkInput;
    if (!link) return;

    // تفاعل البدء
    api.setMessageReaction("🧭", event.messageID, () => {}, true);

    try {
      let apiUrl = "";
      // استخدام السيرفر السريع اللي جربناه ونفع
      if (link.includes("facebook.com") || link.includes("fb.watch") || link.includes("share/r")) {
        apiUrl = `https://hridoy-apis.vercel.app/downloader/facebook2?url=${encodeURIComponent(link)}&apikey=hridoyXQC`;
      } else if (link.includes("tiktok.com")) {
        apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(link)}`;
      }

      if (!apiUrl) return;

      const response = await axios.get(apiUrl, { timeout: 30000 });
      const resData = response.data;

      let downloadUrl = "";
      if (link.includes("facebook")) {
        // سحب الرابط بدقة من استجابة hridoy
        downloadUrl = resData.video_HD?.url || resData.video_SD?.url || resData.result?.hd || resData.result?.sd;
      } else if (link.includes("tiktok")) {
        downloadUrl = resData.video?.noWatermark || resData.video?.watermark;
      }

      if (downloadUrl) {
        // إنشاء اسم ملف فريد جداً لضمان عدم تداخل الفيديوهات
        const fileName = `fb_tt_${Date.now()}_${Math.floor(Math.random() * 1000)}.mp4`;
        const videoPath = path.join(process.cwd(), "cache", fileName);
        await fs.ensureDir(path.join(process.cwd(), "cache"));

        const videoRes = await axios.get(downloadUrl, { 
          responseType: 'arraybuffer',
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        await fs.writeFile(videoPath, Buffer.from(videoRes.data));

        // تفاعل النجاح
        api.setMessageReaction("✅", event.messageID, () => {}, true);

        const messageBody = `
✧══════•❁◈❁•══════✧
✺ ┇ ⏣ ⟬ تـم الـتـنـفـيـذ بـنـجـاح 🚀 ⟭
✺ ┇ 
✺ ┇ ◍ الـحـالـة: 『 جـاهـز لـلـعرض 』
✺ ┇ ⸻⸻⸻⸻⸻
✺ ┇ 🛡️ بـواسطة: بـانـدلـيـن سـيـستم
✧══════•❁◈❁•══════✧`;

        await api.sendMessage({
            body: messageBody,
            attachment: fs.createReadStream(videoPath)
          }, event.threadID, (err) => {
            // حذف الملف فوراً بعد الإرسال أو المحاولة
            if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
          });
      }
    } catch (error) {
      console.error("Error:", error);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
  }

  async events({ api, event }) {
    const { body, type, senderID } = event;
    if (senderID === api.getCurrentUserID() || !body) return;
    if (type !== "message" && type !== "message_reply") return;

    // فلتر دقيق للروابط عشان ما يسحب أي نص عشوائي
    const fbReg = /https?:\/\/(www\.)?(facebook\.com|fb\.watch|fb\.gg)\/[^\s]+/gi;
    const ttReg = /https?:\/\/([a-zA-Z0-9-]+\.)?tiktok\.com\/[^\s]+/gi;

    const fbMatch = body.match(fbReg);
    const ttMatch = body.match(ttReg);

    if (fbMatch) {
      this.execute({ api, event, linkInput: fbMatch[0] });
    } else if (ttMatch) {
      this.execute({ api, event, linkInput: ttMatch[0] });
    }
  }
}

export default new MultiDownloader();