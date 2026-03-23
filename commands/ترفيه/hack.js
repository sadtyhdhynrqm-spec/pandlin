export default {
  name: "اخترق",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 5,
  description: "اختراق وهمي",
  execute: async ({ api, event, args }) => {
    const target = args.join(" ") || "الهدف";
    const percent = Math.floor(Math.random() * 30) + 70;
    const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ نـظـام الاخـتـراق ⟭
✺ ┇
✺ ┇ ◍ الهـدف: ${target}
✺ ┇ ◍ كسر التشفير... ████████░░
✺ ┇ ◍ اختراق الجدار الناري... ✓
✺ ┇ ◍ الوصول للبيانات... ✓
✺ ┇ ◍ مسح الآثار... ✓
✺ ┇ ◍ نسبة النجاح: ${percent}٪
✺ ┇
✺ ┇ ⠇تـم الاخـتـراق بـنـجـاح ✅
✺ ┇
✧══════•❁◈❁•══════✧`;
    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
