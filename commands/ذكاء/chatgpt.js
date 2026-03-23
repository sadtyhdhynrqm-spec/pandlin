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
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  aliases: ["gpt", "الذكاء", "ai"],
  description: "تفاعل مع الذكاء الاصطناعي بالعربية",

  execute: async function({ api, event, args }) {
    try {
      api.setMessageReaction("⏱️", event.messageID, () => {}, true);
      const prompt = args.join(" ");
      if (!prompt) {
        return api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ اكتب سؤالك بعد الأمر\n✺ ┇ مثال: ذكاء ما هو الذكاء الاصطناعي؟\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
      }
      const response = await askArabicAI(prompt);
      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const msg = `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ الـذكـاء الاصـطـنـاعـي ⟭\n✺ ┇\n✺ ┇ ${response.replace(/\n/g, '\n✺ ┇ ')}\n✺ ┇\n✧══════•❁◈❁•══════✧`;
      const sentMessage = await api.sendMessage(msg, event.threadID, event.messageID);
      global.client.handler.reply.set(sentMessage.messageID, {
        author: event.senderID, type: "arabic_ai_chat", name: "ذكاء", unsend: false,
      });
    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ: ${error.message}\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    }
  },

  onReply: async function({ api, event, reply }) {
    if (reply.type === "arabic_ai_chat" && reply.author === event.senderID) {
      try {
        api.setMessageReaction("⏱️", event.messageID, () => {}, true);
        const response = await askArabicAI(event.body);
        api.setMessageReaction("✅", event.messageID, () => {}, true);
        const msg = `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ الـذكـاء الاصـطـنـاعـي ⟭\n✺ ┇\n✺ ┇ ${response.replace(/\n/g, '\n✺ ┇ ')}\n✺ ┇\n✧══════•❁◈❁•══════✧`;
        const sentMessage = await api.sendMessage(msg, event.threadID, event.messageID);
        global.client.handler.reply.set(sentMessage.messageID, {
          author: event.senderID, type: "arabic_ai_chat", name: "ذكاء", unsend: false,
        });
      } catch (error) {
        api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ: ${error.message}\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
      }
    }
  }
};
