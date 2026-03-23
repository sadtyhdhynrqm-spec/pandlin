export default {
  name: "ضبط_الإسم",
  author: "سينكو 𓆩☆𓆪",
  role: "admin",
  description: "تغيير اسم المجموعة",
  aliases: ["setname", "تغيير_الاسم"],
  execute: async ({ api, event, args }) => {
    try {
      const name = args.join(" ");
      if (!name) {
        return api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ أدخل الاسم الجديد للمجموعة\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
      }
      await api.setTitle(name, event.threadID);
      api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ تـغـيـيـر الاسـم ⟭\n✺ ┇\n✺ ┇ ✅ تم تغيير اسم المجموعة إلى:\n✺ ┇ 📝 ${name}\n✺ ┇\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ أثناء تغيير الاسم\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
