import jimp from 'jimp';
import fs from 'fs';

async function circle(url) {
  const img = await jimp.read(url);
  img.circle();
  return await img.getBufferAsync(jimp.MIME_PNG);
}

async function bal(one, two) {
  let avone = await jimp.read(await circle(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`));
  let avtwo = await jimp.read(await circle(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`));
  let img = await jimp.read("https://i.postimg.cc/cLCjPLW4/Picsart-24-05-08-14-32-46-123.jpg");
  img.resize(480, 300).composite(avone.resize(80, 80), 260, 20).composite(avtwo.resize(70, 70), 140, 60);
  const pth = "Propose.jpg";
  await img.writeAsync(pth);
  return pth;
}

export default {
  name: "إعجاب",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "إرسال صورة للإعجاب بشخص",
  aliases: ["propose", "اعجاب"],
  execute: async function ({ api, event }) {
    const mention = Object.keys(event.mentions);
    if (mention.length === 0) {
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ اعمل منشن للشخص\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
    const one = event.senderID;
    const two = mention[0];
    try {
      const ptth = await bal(one, two);
      return api.sendMessage({
        body: `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ الإعجاب ⟭\n✺ ┇\n✺ ┇ 💖 أنا معجب بك\n✺ ┇\n✧══════•❁◈❁•══════✧`,
        attachment: fs.createReadStream(ptth)
      }, event.threadID, () => { try { fs.unlinkSync(ptth); } catch(e) {} }, event.messageID);
    } catch (error) {
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ أثناء إرسال الصورة\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
