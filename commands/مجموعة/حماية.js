export default {
  name: "حماية",
  author: "سينكو 𓆩☆𓆪",
  role: "admin",
  description: "إدارة إعدادات حماية المجموعة (الاسم، الكنية، الصورة)",
  aliases: ["protect", "انتي", "anti"],

  execute: async ({ api, event, args, Threads }) => {
    const threadsData = await Threads.find(event.threadID);
    const threads = threadsData?.data?.data || {};
    const anti = threads.anti || {};

    const nicknameStatus = anti.nicknameBox ? "✅ مُفعّل" : "❌ مُعطّل";
    const nameStatus = anti.nameBox ? "✅ مُفعّل" : "❌ مُعطّل";
    const iconStatus = anti.iconBox ? "✅ مُفعّل" : "❌ مُعطّل";

    if (!args[0]) {
      const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ إعـدادات الـحـمـايـة ⟭
✺ ┇
✺ ┇ ◍ حماية الكنية: ${nicknameStatus}
✺ ┇ ◍ حماية الاسم: ${nameStatus}
✺ ┇ ◍ حماية الصورة: ${iconStatus}
✺ ┇
✺ ┇ ⏣ الأوامر المتاحة:
✺ ┇ ◍ حماية كنية — تفعيل/تعطيل
✺ ┇ ◍ حماية اسم — تفعيل/تعطيل
✺ ┇ ◍ حماية صورة — تفعيل/تعطيل
✺ ┇ ◍ حماية كل — تفعيل الكل
✺ ┇ ◍ حماية ايقاف — تعطيل الكل
✺ ┇
✧══════•❁◈❁•══════✧`;
      return api.sendMessage(msg, event.threadID, event.messageID);
    }

    const arg = args[0].toLowerCase();
    let updatedAnti = { ...anti };
    let feedbackLines = [];

    if (arg === "كنية" || arg === "nickname" || arg === "نكنيم") {
      updatedAnti.nicknameBox = !anti.nicknameBox;
      feedbackLines.push(`◍ حماية الكنية: ${updatedAnti.nicknameBox ? "✅ مُفعّلة" : "❌ مُعطّلة"}`);
    } else if (arg === "اسم" || arg === "name" || arg === "الاسم") {
      updatedAnti.nameBox = !anti.nameBox;
      feedbackLines.push(`◍ حماية الاسم: ${updatedAnti.nameBox ? "✅ مُفعّلة" : "❌ مُعطّلة"}`);
    } else if (arg === "صورة" || arg === "icon" || arg === "الصورة") {
      updatedAnti.iconBox = !anti.iconBox;
      feedbackLines.push(`◍ حماية الصورة: ${updatedAnti.iconBox ? "✅ مُفعّلة" : "❌ مُعطّلة"}`);
    } else if (arg === "كل" || arg === "all") {
      updatedAnti = { nicknameBox: true, nameBox: true, iconBox: true };
      feedbackLines.push("◍ حماية الكنية: ✅ مُفعّلة");
      feedbackLines.push("◍ حماية الاسم: ✅ مُفعّلة");
      feedbackLines.push("◍ حماية الصورة: ✅ مُفعّلة");
    } else if (arg === "ايقاف" || arg === "off" || arg === "إيقاف") {
      updatedAnti = { nicknameBox: false, nameBox: false, iconBox: false };
      feedbackLines.push("◍ حماية الكنية: ❌ مُعطّلة");
      feedbackLines.push("◍ حماية الاسم: ❌ مُعطّلة");
      feedbackLines.push("◍ حماية الصورة: ❌ مُعطّلة");
    } else {
      return api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ خيار غير صالح\n✺ ┇ استخدم: حماية كنية | اسم | صورة | كل | ايقاف\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
    }

    await Threads.update(event.threadID, {
      anti: updatedAnti,
    });

    const feedback = feedbackLines.map(l => `✺ ┇ ${l}`).join("\n");
    const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ تـم تـحـديـث الـحـمـايـة ⟭
✺ ┇
${feedback}
✺ ┇
✧══════•❁◈❁•══════✧`;
    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
