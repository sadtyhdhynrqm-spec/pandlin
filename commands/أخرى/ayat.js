import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import request from 'request';

export default {
  name: 'آيات',
  author: 'سينكو 𓆩☆𓆪',
  role: 'member',
  description: 'جلب آية قرآنية بناءً على رقم السورة والآية',
  aliases: ['ayat', 'آية'],
  execute: async ({ api, event, args }) => {
    try {
      const [s1, s2] = args;
      if (!s1 || !s2) {
        return api.sendMessage(`✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ الـقـرآن الـكـريـم ⟭
✺ ┇
✺ ┇ ⚠️ استخدم: آيات <رقم السورة> <رقم الآية>
✺ ┇ مثال: آيات 1 2
✺ ┇
✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
      }
      const url = `https://api.quran.gading.dev/surah/${s1}/${s2}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!data?.data?.text?.arab) throw new Error("لم يتم العثور على الآية");

      const audioLink = data.data.audio.secondary[0];
      const audioFilePath = path.join(process.cwd(), 'cache', 'quran_aud.mp3');

      request({ url: audioLink, encoding: null }, (error, res, body) => {
        if (error) return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ خطأ في جلب الصوت\n✧══════•❁◈❁•══════✧", event.threadID);
        fs.writeFileSync(audioFilePath, body);
        api.sendMessage({
          body: `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ آيـة قـرآنـيـة ⟭\n✺ ┇\n✺ ┇ ${data.data.text.arab}\n✺ ┇\n✧══════•❁◈❁•══════✧`,
          attachment: fs.createReadStream(audioFilePath)
        }, event.threadID, () => { try { fs.unlinkSync(audioFilePath); } catch (e) {} }, event.messageID);
      });
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ في جلب الآية\n✧══════•❁◈❁•══════✧", event.threadID);
    }
  }
};
