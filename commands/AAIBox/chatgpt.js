import axios from 'axios';

async function askGPT(prompt) {
  try {
    const apiUrl = `https://chatgpt.apinepdev.workers.dev/?question=${encodeURIComponent(prompt)}`;
    const res = await axios.get(apiUrl, { timeout: 30000 });
    return res.data.answer || res.data.response || res.data.message || "لم أتمكن من الحصول على رد.";
  } catch (error) {
    throw new Error(error.message);
  }
}

export default {
  name: "ذكاء",
  author: "Kaguya Project",
  role: "member",
  description: "يتفاعل مع الذكاء الاصطناعي ويواصل المحادثة",

  execute: async function({ api, event, args }) {
    try {
      api.setMessageReaction("⏱️", event.messageID, (err) => {}, true);

      const { threadID, senderID } = event;
      const prompt = args.join(" ") || "أهلاً";
      const response = await askGPT(prompt);

      api.setMessageReaction("✨", event.messageID, (err) => {}, true);

      const sentMessage = await api.sendMessage(response, threadID);
      global.client.handler.reply.set(sentMessage.messageID, {
        author: senderID,
        type: "reply",
        name: "ذكاء",
        unsend: false,
      });

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, (err) => {}, true);
      api.sendMessage(`❌ | حدث خطأ: ${error.message}`, event.threadID);
    }
  },

  onReply: async function({ api, event, reply }) {
    if (reply.type === "reply" && reply.author === event.senderID) {
      try {
        const response = await askGPT(event.body);
        const sentMessage = await api.sendMessage(response, event.threadID);

        global.client.handler.reply.set(sentMessage.messageID, {
          author: event.senderID,
          type: "reply",
          name: "ذكاء",
          unsend: false,
        });
      } catch (error) {
        api.sendMessage(`❌ | حدث خطأ أثناء معالجة ردك: ${error.message}`, event.threadID);
      }
    }
  }
};
