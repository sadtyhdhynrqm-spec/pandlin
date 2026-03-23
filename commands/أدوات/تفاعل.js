const NAMES = ["ويسكي", "سينكو", "وسكي"];

export default {
    name: "تفاعل",
    description: "يتفاعل بقلب مع الرسائل التي تحتوي على أسماء محددة",
    role: "member",
    execute: async () => {},
    events: async ({ api, event }) => {
        if (!["message", "message_reply"].includes(event.type)) return;
        if (!event.body) return;

        const body = event.body.toLowerCase();
        const matched = NAMES.some(name => body.includes(name));

        if (matched) {
            api.setMessageReaction("❤️", event.messageID, () => {}, true);
        }
    }
};
