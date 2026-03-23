export default {
  name: "قبح",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "يقوم بحساب نسبة قبحك",
  execute: async function ({ api, event }) {
    const percent = Math.floor(Math.random() * 100) + 1;
    let emoji = percent <= 30 ? "😍" : percent <= 60 ? "😐" : percent <= 85 ? "😬" : "💀";
    const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ مـقـيـاس الـقـبـح ⟭
✺ ┇
✺ ┇ ${emoji} نسبة قبحك: ${percent}٪
✺ ┇ ◍ ${"█".repeat(Math.floor(percent / 10))}${"░".repeat(10 - Math.floor(percent / 10))}
✺ ┇
✺ ┇ ⠇هـذه مـجـرد لـعـبـة 😄
✺ ┇
✧══════•❁◈❁•══════✧`;
    return api.sendMessage(msg, event.threadID, event.messageID);
  }
};
