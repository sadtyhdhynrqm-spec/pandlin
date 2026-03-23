export default {
  name: "ليل",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "رسالة تصبح على خير",
  async execute({ api, event }) {
    const msgs = [
      "تصبحون على خير يا أحلى ناس 🌙",
      "نوموا بأمان وأحلام حلوة 💤",
      "الليل حلو وأنتم أحلى منه 🌟",
      "ربي يحفظكم في نومكم ويقظتكم 🌙",
    ];
    const random = msgs[Math.floor(Math.random() * msgs.length)];
    const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ تـصـبـح عـلـى خـيـر ⟭
✺ ┇
✺ ┇ 🌙 ${random}
✺ ┇
✺ ┇ ⠇الـمـطـوࢪ: سـيـنـكـو 𓆩☆𓆪
✺ ┇
✧══════•❁◈❁•══════✧`;
    return api.sendMessage(msg, event.threadID, event.messageID);
  },
};
