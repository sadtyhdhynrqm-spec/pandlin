export default {
  name: "ليل",
  author: "حمودي سان",
  role: "member",
  description: "رسالة تصبح على خير",
  async execute({ api, event }) {
    return api.sendMessage(
      `🌙 تصبحون على خير يا سنافري! 💤\nالنوم حلو، والحلوين بيحبوكم 🌟\nمن: حمودي سان 🇸🇩`,
      event.threadID,
      event.messageID
    );
  },
};
