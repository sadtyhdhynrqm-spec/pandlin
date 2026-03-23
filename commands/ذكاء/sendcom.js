import fs from "fs-extra";
import jimp from "jimp";

async function bal(one) {
  const avatarone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  const image = await jimp.read("https://i.ibb.co/hV4qzCV/image.jpg");
  image.resize(512, 512).composite(avatarone.resize(173, 173), 70, 186);
  const imagePath = "wholesome.png";
  await image.writeAsync(imagePath);
  return imagePath;
}

export default {
  name: "كراش",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "صورة خاصة بالكراش",
  aliases: ["crush", "حبيب"],
  async execute({ api, event }) {
    const mention = Object.keys(event.mentions);
    if (mention.length === 0) {
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ✨ اعمل منشن لحبك الحقيقي\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
    try {
      const imagePath = await bal(mention[0]);
      api.sendMessage({
        body: `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ الـكـراش ⟭\n✺ ┇\n✺ ┇ 💖 أحبك من كل قلبي\n✺ ┇\n✧══════•❁◈❁•══════✧`,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => { try { fs.unlinkSync(imagePath); } catch(e) {} }, event.messageID);
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
