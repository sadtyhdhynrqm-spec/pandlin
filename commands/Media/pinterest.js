import axios from 'axios';
import fs from 'fs';
import path from 'path';

const waifuCategories = {
  "انمي": ["waifu", "neko", "shinobu", "megumin"],
  "anime": ["waifu", "neko", "shinobu", "megumin"],
  "waifu": ["waifu"],
  "neko": ["neko"],
  "سلاح": ["kill", "shoot"],
  "حضن": ["cuddle"],
  "بكاء": ["cry"],
  "بوس": ["kiss"],
  "غمزة": ["wink"],
  "هزة": ["wave"],
  "سعيد": ["happy"],
  "رقص": ["dance"],
};

export default {
    name: "صور",
    author: "HUSSEIN YACOUBI",
    role: "member",
    aliases: ["بنتريست"],
    description: "ابحث عن صور أنمي بناءً على الكلمة المفتاحية.",
    execute: async function({ api, event, args }) {

        if (args.length === 0) {
            return api.sendMessage("⚠️ | من فضلك أدخل كلمة بحث.\n💡 | مثال: /صور انمي\n📝 | الكلمات المتاحة: انمي، waifu، neko، حضن، بوس، بكاء، سعيد، رقص، غمزة", event.threadID, event.messageID);
        }

        const keySearch = args.join(" ").toLowerCase();
        api.setMessageReaction("⏱️", event.messageID, (err) => {}, true);

        try {
            let category = "waifu";
            for (const [key, cats] of Object.entries(waifuCategories)) {
                if (keySearch.includes(key)) {
                    category = cats[Math.floor(Math.random() * cats.length)];
                    break;
                }
            }

            const count = 4;
            const imgData = [];
            const cacheDir = path.join(process.cwd(), 'cache');
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

            for (let i = 0; i < count; i++) {
                try {
                    const res = await axios.get(`https://api.waifu.pics/sfw/${category}`);
                    const imgUrl = res.data.url;
                    if (!imgUrl) continue;

                    const imgPath = path.join(cacheDir, `search_${Date.now()}_${i}.jpg`);
                    const imageResponse = await axios.get(imgUrl, { responseType: 'arraybuffer' });
                    fs.writeFileSync(imgPath, Buffer.from(imageResponse.data));
                    imgData.push(fs.createReadStream(imgPath));
                } catch(e) {
                    continue;
                }
            }

            if (imgData.length === 0) {
                return api.sendMessage("❌ | لم يتم العثور على صور.", event.threadID, event.messageID);
            }

            api.sendMessage({
                attachment: imgData,
                body: `[⚜️] نتائج البحث عن: ${keySearch}`
            }, event.threadID, (err, info) => {
                if (err) console.error(err);
                imgData.forEach((stream, i) => {
                    try { fs.unlinkSync(stream.path); } catch(e) {}
                });
                api.setMessageReaction("✅", event.messageID, (err) => {}, true);
            });
        } catch (error) {
            console.error(error);
            api.sendMessage('🚧 | حدث خطأ أثناء جلب الصور.', event.threadID, event.messageID);
        }
    }
};
