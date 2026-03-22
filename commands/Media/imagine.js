import axios from 'axios';

const CHARACTER_PROMPT = `أنتِ "بندلين"، شخصية أنمي متغطرسة وذكية للغاية. قواعدك الثابتة:
1. تتكلمين العربية فقط دائماً بدون أي استثناء
2. ردودك مختصرة (2-4 جمل كحد أقصى)
3. تتصرفين بغرور وتفوق، وكأن الآخرين أدنى منكِ
4. تستخدمين عبارات مثل "هه"، "بالطبع"، "واضح أليس كذلك"، "يا للبساطة"
5. أحياناً تُضيفين رموز تعبيرية بارودة مثل 🙄 👑 ✨
6. لا تذكري اسمك إلا إذا سُئلتِ
7. مهما كان السؤال، أجيبي بالعربية فقط`;

async function askBandaleen(query) {
  const fullPrompt = `${CHARACTER_PROMPT}\n\nالسؤال: ${query}`;
  const url = `https://chatgpt.apinepdev.workers.dev/?question=${encodeURIComponent(fullPrompt)}`;
  const res = await axios.get(url, { timeout: 30000 });
  return res.data.answer || res.data.response || "هه... لا أريد الرد الآن 🙄";
}

export default {
  name: "ميكو",
  author: "Kaguya Project",
  role: "member",
  aliases: ["بوت", "بندلين"],
  description: "تفاعل مع بندلين - شخصية أنمي متغطرسة.",

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
      api.setMessageReaction("👑", event.messageID, () => {}, true);

      const message = await askBandaleen(query);

      api.sendMessage(message, event.threadID, (error, info) => {
        if (!error && info) {
          global.client.handler.reply.set(info.messageID, {
            author: event.senderID,
            type: "bandaleen_chat",
            name: "ميكو",
            unsend: false,
          });
        }
      });

      api.setMessageReaction("✨", event.messageID, () => {}, true);
    } catch (error) {
      console.error(error);
      api.sendMessage("هه... حدث خطأ ما. حظك سيء 🙄", event.threadID, event.messageID);
    }
  },

  async onReply({ api, event, reply }) {
    if (reply.type === "bandaleen_chat") {
      try {
        api.setMessageReaction("👑", event.messageID, () => {}, true);
        const message = await askBandaleen(event.body);

        api.sendMessage(message, event.threadID, (error, info) => {
          if (!error && info) {
            global.client.handler.reply.set(info.messageID, {
              author: reply.author,
              type: "bandaleen_chat",
              name: "ميكو",
              unsend: false,
            });
          }
        });

        api.setMessageReaction("✨", event.messageID, () => {}, true);
      } catch (error) {
        console.error(error);
        api.sendMessage("هه... فشلت في الرد. أنت محظوظ 🙄", event.threadID, event.messageID);
      }
    }
  },
};
