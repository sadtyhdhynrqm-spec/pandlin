export default {
  name: "صبح",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 5,
  description: "رسالة صباح الخير",
  execute: async ({ api, event }) => {
    const msgs = [
      "صباحكم أجمل من الزهور يا أحلى ناس 🌸",
      "صباح النور والسرور على قلوبكم 🌅",
      "يومكم مليان سعادة وضحكة وخير 🌼",
      "ربي يصبحكم بكل خير وبركة ☀️",
      "صباحكم نور يا أحلى من الورود 🌷",
    ];
    const random = msgs[Math.floor(Math.random() * msgs.length)];
    const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ صـبـاح الـخـيـر ⟭
✺ ┇
✺ ┇ ☀️ ${random}
✺ ┇
✺ ┇ ⠇الـمـطـوࢪ: سـيـنـكـو 𓆩☆𓆪
✺ ┇
✧══════•❁◈❁•══════✧`;
    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
