import axios from 'axios';

const ARABIC_PROMPT = `أنت مساعد ذكاء اصطناعي عربي. قواعدك الثابتة:
1. تجيب بالعربية فقط دائماً مهما كان السؤال
2. إذا سألك أحد بالإنجليزية، أجب بالعربية
3. ردودك واضحة ومفيدة
4. لا تذكر أنك ChatGPT أو أي اسم آخر إلا إذا سُئلتَ`;

async function askArabicAI(prompt) {
  try {
    const fullPrompt = `${ARABIC_PROMPT}\n\nالسؤال: ${prompt}`;
    const url = `https://chatgpt.apinepdev.workers.dev/?question=${encodeURIComponent(fullPrompt)}`;
    const res = await axios.get(url, { timeout: 30000 });
    return res.data.answer || res.data.response || "لم أتمكن من الحصول على رد.";
  } catch (error) {
    throw new Error(error.message);
  }
}

export default {
  name: "ذكاء",
  author: "Kaguya Project",
  role: "member",
  aliases: ["gpt", "الذكاء"],
  description: "تفاعل مع الذكاء الاصطناعي بالعربية",

  execute: async function({ api, event, args }) {
    try {
      api.setMessageReaction("⏱️", event.messageID, (err) => {}, true);

      const { threadID, senderID } = event;
      const prompt = args.join(" ");

      if (!prompt) {
        return api.sendMessage("⚠️ | اكتب سؤالك بعد الأمر\nمثال: /ذكاء ما هو الذكاء الاصطناعي؟", threadID, event.messageID);
      }

      const response = await askArabicAI(prompt);

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);

      const sentMessage = await api.sendMessage(response, threadID);
      global.client.handler.reply.set(sentMessage.messageID, {
        author: senderID,
        type: "arabic_ai_chat",
        name: "ذكاء",
        unsend: false,
      });

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, (err) => {}, true);
      api.sendMessage(`❌ | حدث خطأ: ${error.message}`, event.threadID);
    }
  },

  onReply: async function({ api, event, reply }) {
    if (reply.type === "arabic_ai_chat" && reply.author === event.senderID) {
      try {
        api.setMessageReaction("⏱️", event.messageID, (err) => {}, true);
        const response = await askArabicAI(event.body);
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);

        const sentMessage = await api.sendMessage(response, event.threadID);
        global.client.handler.reply.set(sentMessage.messageID, {
          author: event.senderID,
          type: "arabic_ai_chat",
          name: "ذكاء",
          unsend: false,
        });
      } catch (error) {
        api.sendMessage(`❌ | حدث خطأ: ${error.message}`, event.threadID);
      }
    }
  }
};
