import fs from 'fs';
import axios from 'axios';
import jimp from 'jimp';
import { resolve } from 'path';

async function bal(one, two) {
    const avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avone.circle();
    const avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avtwo.circle();
    const pth = resolve(process.cwd(), 'cache', 'toilet.png');
    const img = await jimp.read("https://i.imgur.com/sZW2vlz.png");
    
    img.resize(1080, 1350).composite(avone.resize(360, 360), 8828282, 2828).composite(avtwo.resize(450, 450), 300, 660);
    
    await img.writeAsync(pth);
    return pth;
}

export default {
    name: "مرحاض",
    author: "kaguya project",
    description: "يقوم بإنشاء صورة معالجة معينة",
    role: "member",
    execute: async ({ api, event, args }) => {
        const senderID = event.messageReply?.senderID || event.senderID;
        const mention = Object.keys(event.mentions);
        if (mention.length == 0) return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ اعمل منشن للشخص\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
        const one = mention.length >= 2 ? mention[1] : senderID;
        const two = mention[0];
        bal(one, two).then(ptth => {
          api.sendMessage({
            body: `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ المـرحـاض ⟭\n✺ ┇\n✺ ┇ 🤣 أنت تستحق هذا المكان!\n✺ ┇\n✧══════•❁◈❁•══════✧`,
            attachment: fs.createReadStream(ptth)
          }, event.threadID, () => { try { fs.unlinkSync(ptth); } catch(e) {} });
        }).catch(() => api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ\n✧══════•❁◈❁•══════✧", event.threadID));
    }
};