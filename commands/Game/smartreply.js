const userMemory = new Map();

export default {
  name: "ذكي",
  author: "حمودي سان",
  role: "member",
  description: "رد ذكي بناءً على ما تقوله",
  async execute({ api, event }) {
    const body = (event.body || "").toLowerCase().trim();
    const senderID = event.senderID;

    const replies = {
      sad: ["يا قلبي ❤️", "أنا معاك يا سنافري", "ما تستسلم، أنت أقوى من كذا 💪"],
      happy: ["ههه، ضحكتك تهزمني! 😄", "الفرح في صوتك حلو! ✨"],
      question: ["سؤالك مهم...", "أنا أفكر... 🤔", "طب، شتقول؟"],
      default: [
        "أنا سامعك، تابع... 👂",
        "طيب، شتبي تسوي؟",
        "أحبكم يا سنافري، حتى لو ما تكتبوا ❤️",
        "حمودي سان معاكم دايمًا 🇸🇩",
      ],
    };

    const getMood = (txt) => {
      if (["تعبت", "حزين", "ممل", "ضعيف"].some(w => txt.includes(w))) return "sad";
      if (["ههه", "حلو", "ممتاز", "ضحكة"].some(w => txt.includes(w))) return "happy";
      if (txt.includes("?") || ["كيف", "ليش", "هل", "متى"].some(w => txt.includes(w))) return "question";
      return "default";
    };

    const mood = getMood(body);
    const list = replies[mood];
    const reply = list[Math.floor(Math.random() * list.length)];

    userMemory.set(senderID, body);
    return api.sendMessage(reply, event.threadID, event.messageID);
  },
};
