import axios from 'axios';

export default {
  name: "ترجمة",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 10,
  description: "ترجمة النص من لغة إلى أخرى",
  role: "member",
  aliases: ["translate", "ترجمي"],
  execute: async ({ api, event, args }) => {
    const content = args.join(" ");
    if (content.length === 0 && !event.messageReply) {
      return api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ اكتب النص أو رد على رسالة\n✺ ┇ مثال: ترجمة مرحبا ->en\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    }

    let translateThis, lang;
    if (event.messageReply) {
      translateThis = event.messageReply.body;
      lang = content.includes("->") ? content.split("->")[1].trim() : 'ar';
    } else {
      const idx = content.indexOf("->");
      if (idx !== -1) {
        translateThis = content.slice(0, idx).trim();
        lang = content.slice(idx + 2).trim();
      } else {
        translateThis = content;
        lang = 'ar';
      }
    }

    try {
      const response = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(translateThis)}`);
      let translatedText = '';
      response.data[0].forEach(item => { if (item[0]) translatedText += item[0]; });
      const fromLang = response.data[2] || 'auto';

      const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ نـظـام الـتـرجـمـة ⟭
✺ ┇
✺ ┇ ◍ مـن: ${fromLang} → ${lang}
✺ ┇
✺ ┇ 🌐 ${translatedText}
✺ ┇
✧══════•❁◈❁•══════✧`;
      api.sendMessage(msg, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ في الترجمة\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  },
};
