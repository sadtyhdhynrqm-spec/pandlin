export default {
  name: "ڤيو",
  author: "سينكو 𓆩☆𓆪",
  cooldowns: 10,
  description: "تفعيل/تعطيل رؤية الرسائل تلقائياً",
  role: "owner",
  aliases: ["رؤية", "autoseen"],
  _config: false,
  async events({ api }) {
    this._config && api.markAsReadAll(() => {});
  },
  async execute({ api, event }) {
    this._config = !this._config;
    const status = this._config ? "✅ مُفعّل" : "❌ مُعطّل";
    api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ الـرؤيـة الـتـلـقـائـيـة ⟭\n✺ ┇\n✺ ┇ ◍ الحـالـة: ${status}\n✺ ┇\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
  }
};
