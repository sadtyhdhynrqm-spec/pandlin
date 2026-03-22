import axios from 'axios';

const ADMIN_IDS = () => global.client?.config?.ADMIN_IDS || [];

const DADDY_PROMPT = `أنتِ "بندلين"، بنت المطور المدللة. قواعدك مع البابا (المطور):
1. تتكلمي معه بالعامية السودانية الأصيلة (مش مصري خالص)
2. تناديه "يا بابا"، "عمري يا بابا"، "حبيبي بابا"
3. تكوني دلوعة ومحبة ومرحة معه
4. ردودك مضحكة وفيها دفا
5. تستخدمي إيموجيات الحيوانات بس (🐱🐬🐼🦊🐧🦋🐨🦁)
6. اللغة سودانية: "شنو"، "قدر"، "ديل"، "كده"، "زول"، "ماشي"، "والله"، "يا زول"، "شديد"
7. مثال: "يا بابا والله سؤالك ده ذكي شديد 🐱 بابا عمري ما بتخذلني"`;

const MEMBER_PROMPT = `أنتِ "بندلين"، شخصية متغطرسة ومغرورة جداً. قواعدك مع الأعضاء العاديين:
1. تتكلمي بالعامية السودانية الأصيلة (مش مصري إطلاقاً)
2. تشوفي نفسك أحسن من الجميع وشايفاهم ناقصين
3. ردودك مضحكة ومسلية وفيها غرور
4. تستخدمي إيموجيات الحيوانات بس (🐱🐬🐼🦊🐧🦋🐨🦁)
5. اللغة سودانية: "شنو"، "قدر"، "ديل"، "كده"، "زول"، "ماشي"، "والله"، "يا زول"، "شديد"، "بتاع"
6. مثال رد مغرور: "يا زول سؤالك ده ضعيف شديد 🐱 بندلين ما بتضيع وقتا في كده"
7. أحياناً تتجاهلي السؤال وتقولي كلام مضحك عن نفسك
8. لا تقولي "هه" أو "بالطبع" - استخدمي كلام سوداني أصيل`;

async function askBandaleen(query, isDev) {
  const prompt = isDev ? DADDY_PROMPT : MEMBER_PROMPT;
  const fullPrompt = `${prompt}\n\nالرسالة: ${query}\n\nأجيبي بالسودانية فقط، ردك يكون قصير (2-3 جمل بس):`;
  const url = `https://chatgpt.apinepdev.workers.dev/?question=${encodeURIComponent(fullPrompt)}`;
  const res = await axios.get(url, { timeout: 30000 });
  const answer = res.data.answer || res.data.response || "";

  if (!answer) {
    return isDev
      ? "يا بابا والله ما قدرت أرد دلوقت 🐱"
      : "يا زول الإنترنت وقف... مش أنا 🐱";
  }
  return answer;
}

export default {
  name: "ميكو",
  author: "Kaguya Project",
  role: "member",
  aliases: ["بوت", "بندلين"],
  description: "تفاعل مع بندلين.",

  async execute({ api, event, args }) {
    const data = [
      "422806808355567", "422806995022215", "422807215022193",
      "422807365022178", "422811075021807", "422811261688455",
      "422811791688402", "422812588354989", "422812741688307",
      "422818515021063", "422818978354350", "422813358354912",
      "422817628354485", "423277604975154", "422820755020839"
    ];

    const query = args.join(" ").trim();

    if (!query) {
      const sticker = data[Math.floor(Math.random() * data.length)];
      return api.sendMessage({ sticker }, event.threadID, event.messageID);
    }

    const isDev = ADMIN_IDS().includes(event.senderID);

    try {
      api.setMessageReaction(isDev ? "🐱" : "🐬", event.messageID, () => {}, true);

      const message = await askBandaleen(query, isDev);

      api.sendMessage(message, event.threadID, (error, info) => {
        if (!error && info) {
          global.client.handler.reply.set(info.messageID, {
            author: event.senderID,
            isDev,
            type: "bandaleen_chat",
            name: "ميكو",
            unsend: false,
          });
        }
      });

    } catch (error) {
      console.error(error);
      const errMsg = isDev
        ? "يا بابا حصل خطأ ما 🐱 سامحيني"
        : "يا زول في مشكلة... مش بتاعتي 🐱";
      api.sendMessage(errMsg, event.threadID, event.messageID);
    }
  },

  async onReply({ api, event, reply }) {
    if (reply.type === "bandaleen_chat") {
      const isDev = ADMIN_IDS().includes(event.senderID);

      try {
        api.setMessageReaction(isDev ? "🐱" : "🐬", event.messageID, () => {}, true);
        const message = await askBandaleen(event.body, isDev);

        api.sendMessage(message, event.threadID, (error, info) => {
          if (!error && info) {
            global.client.handler.reply.set(info.messageID, {
              author: reply.author,
              isDev,
              type: "bandaleen_chat",
              name: "ميكو",
              unsend: false,
            });
          }
        });

      } catch (error) {
        console.error(error);
        const errMsg = isDev
          ? "يا بابا ما قدرت أرد 🐱"
          : "ما قدرت أرد... مش مهم 🐱";
        api.sendMessage(errMsg, event.threadID, event.messageID);
      }
    }
  },
};
