import fs from 'fs';
import path from 'path';
import jimp from 'jimp';

const generateImage = async (userOneId, userTwoId) => {
  const avOneUrl = `https://graph.facebook.com/${userOneId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const avTwoUrl = `https://graph.facebook.com/${userTwoId}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const avOne = await jimp.read(avOneUrl);
  avOne.circle();
  const avTwo = await jimp.read(avTwoUrl);
  avTwo.circle();
  const imagePath = path.join(process.cwd(), 'cache', 'ball.png');
  const img = await jimp.read('https://imgur.com/vcG4det.jpg');
  img.resize(700, 440).composite(avOne.resize(50, 50), 287, 97).composite(avTwo.resize(40, 40), 50, 137);
  await img.writeAsync(imagePath);
  return imagePath;
};

export default {
  name: "تعالي",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "إرسال صورة لشخصين",
  aliases: ["come", "تعال"],
  execute: async function ({ api, event }) {
    const repliedUserId = event?.messageReply?.senderID;
    const mentionedUserIds = Object.keys(event.mentions);
    const targetUserId = mentionedUserIds.length > 0 ? mentionedUserIds[0] : (repliedUserId || event.senderID);

    if (!targetUserId) {
      return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ اعمل منشن أو رد على رسالة 😉\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }

    try {
      const imagePath = await generateImage(event.senderID, targetUserId);
      api.setMessageReaction("💖", event.messageID, () => {}, true);
      api.sendMessage({
        body: `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ تـعـالـي يـا حـبـيـبـي ⟭\n✺ ┇\n✺ ┇ 💖 تعالي هنا حبيبتي\n✺ ┇\n✧══════•❁◈❁•══════✧`,
        attachment: fs.createReadStream(imagePath)
      }, event.threadID, () => { try { fs.unlinkSync(imagePath); } catch (e) {} }, event.messageID);
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ أثناء المعالجة\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
