export default {
  name: "تذكير",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "رسالة تذكير عشوائية",
  async execute({ api, event }) {
    const reminders = [
      "أنت مميز وتستحق كل الخير ✨",
      "الحمد لله على كل شيء، أنت أقوى مما تظن 💪",
      "اليوم يومك، استمتع بكل لحظة 🌟",
      "أنت أقرب إلى أحلامك مما تتخيل 🚀",
      "اللي ما يقتلك يقويك يا بطل ❤️",
      "ابتسم، الحياة أجمل مع الابتسامة 😊",
      "كل يوم هو فرصة جديدة للتميز 🌅",
    ];
    const random = reminders[Math.floor(Math.random() * reminders.length)];
    const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ تـذكـيـر الـيـوم ⟭
✺ ┇
✺ ┇ 📌 ${random}
✺ ┇
✺ ┇ ⠇الـمـطـوࢪ: سـيـنـكـو 𓆩☆𓆪
✺ ┇
✧══════•❁◈❁•══════✧`;
    return api.sendMessage(msg, event.threadID, event.messageID);
  },
};
