import axios from 'axios';

const systemPrompt = `اسمك كاغويا، شخصية أنمي من "كاغويا-سان: الحرب من أجل الحب". أنتِ مساعدة ذكية ومؤهلة للغاية. شخصيتك ذكية ومتطورة ذات جانب تنافسي قوي، لكنك لا تُظهرين جانبك الأكثر ليونة بسهولة. تتحدثين العربية فقط وتُضيفين لمسات من الرومانسية والغموض إلى ردودك مع استخدام رموز تعبيرية لجعل محادثتك أكثر جاذبية. ✨`;

async function askKaguya(query) {
  const fullQuery = `${systemPrompt}\n\nالسؤال: ${query}`;
  const url = `https://chatgpt.apinepdev.workers.dev/?question=${encodeURIComponent(fullQuery)}`;
  const res = await axios.get(url, { timeout: 30000 });
  return res.data.answer || res.data.response || "لم أتمكن من الرد الآن.";
}

export default {
  name: "ميكو",
  author: "Kaguya Project",
  role: "member",
  aliases: ["بوت"],
  description: "يرسل ملصق عشوائياً أو يتفاعل مع الذكاء الاصطناعي.",
  
  async execute({ api, event, args }) {
    const data = [
      "422806808355567",
      "422806995022215",
      "422807215022193",
      "422807365022178",
      "422811075021807",
      "422811261688455",
      "422811791688402",
      "422812588354989",
      "422812741688307",
      "422818515021063",
      "422818978354350",
      "422813358354912",
      "422817628354485",
      "423277604975154",
      "422820755020839"
    ];

    const query = args.join(" ").trim();

    if (!query) {
      const sticker = data[Math.floor(Math.random() * data.length)];
      return api.sendMessage({ sticker }, event.threadID, event.messageID);
    }

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const message = await askKaguya(query);

      api.sendMessage(message, event.threadID, (error, info) => {
        if (!error) {
          global.client.handler.reply.set(info.messageID, {
            author: event.senderID,
            type: "reply",
            name: "كاغويا",
            unsend: false,
          });
        }
      });
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (error) {
      console.error(error);
      api.sendMessage("🚧 | حدث خطأ أثناء معالجة استفسارك.", event.threadID, event.messageID);
    }
  },

  async onReply({ api, event, reply }) {
    if (reply.type === "reply" && reply.name === "كاغويا" && reply.author === event.senderID) {
      try {
        api.setMessageReaction("⏳", event.messageID, () => {}, true);
        const message = await askKaguya(event.body);

        api.sendMessage(message, event.threadID, (error, info) => {
          if (!error) {
            global.client.handler.reply.set(info.messageID, {
              author: event.senderID,
              type: "reply",
              name: "كاغويا",
              unsend: false,
            });
          }
        });
        api.setMessageReaction("✅", event.messageID, () => {}, true);
      } catch (error) {
        console.error(error);
        api.sendMessage("🚧 | حدث خطأ أثناء معالجة استفسارك.", event.threadID, event.messageID);
      }
    }
  },
};
