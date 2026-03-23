import fs from "fs";

export default {
  name: "حقيقة&جرأة",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "لعبة حقيقة أم جرأة",
  aliases: ["truth", "dare"],
  async execute({ api, args, event }) {
    const [arg1] = args;

    if (!arg1) {
      return api.sendMessage(`✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ حـقـيـقـة أم جـرأة ⟭
✺ ┇
✺ ┇ ◍ حقيقة&جرأة حقيقة
✺ ┇ ◍ حقيقة&جرأة جرأة
✺ ┇
✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    }

    if (arg1 === 'حقيقة') {
      const truthQuestions = JSON.parse(fs.readFileSync(`TRUTHQN.json`));
      const randomQuestion = truthQuestions[Math.floor(Math.random() * truthQuestions.length)];
      api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ سـؤال الـحـقـيـقـة ⟭\n✺ ┇\n✺ ┇ ❓ ${randomQuestion}\n✺ ┇\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    } else if (arg1 === 'جرأة') {
      const dareChallenges = JSON.parse(fs.readFileSync(`DAREQN.json`));
      const randomChallenge = dareChallenges[Math.floor(Math.random() * dareChallenges.length)];
      api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ تـحـدي الـجـرأة ⟭\n✺ ┇\n✺ ┇ 🎯 ${randomChallenge}\n✺ ┇\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    } else {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ استخدم: حقيقة&جرأة حقيقة | جرأة\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
