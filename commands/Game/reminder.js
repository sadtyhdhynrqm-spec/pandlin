export default {
  name: "تذكير",
  author: "حمودي سان",
  role: "member",
  description: "رسالة تذكير عشوائية",
  async execute({ api, event }) {
    const reminders = [
      "يا سنافري، ما تنساش إنك مميز! ✨",
      "الحمد لله على كل شيء، أنت أقوى مما تظن! 💪",
      "اليوم يومك، استمتع بكل لحظة! 🌟",
      "أنت أقرب إلى أحلامك مما تتخيل! 🚀",
      "اللي ما يقتلك يقويك، يا سنافري ❤️",
    ];
    const random = reminders[Math.floor(Math.random() * reminders.length)];
    return api.sendMessage(`📌 تذكير:\n${random}`, event.threadID, event.messageID);
  },
};
