import axios from "axios";

export default {
    name: "تطبيقات",
    author: "Hussein Yacoubi",
    role: "member",
    description: "يجلب معلومات حول تطبيق من متجر جوجل بلاي.",
    async execute({ api, event, args }) {

        api.setMessageReaction("🔍", event.messageID, (err) => {}, true);

        try {
            const searchTerm = args.join(" ");
            if (!searchTerm) {
                return api.sendMessage("⚠️ | قم بإدخال إسم التطبيق للبحث عنه", event.threadID);
            }

            const response = await axios.get(
                `https://play.google.com/store/search?q=${encodeURIComponent(searchTerm)}&c=apps`,
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept-Language': 'ar'
                    },
                    timeout: 15000
                }
            );

            const html = response.data;
            const appIdMatch = html.match(/href="\/store\/apps\/details\?id=([^"]+)"/);
            const appNameMatch = html.match(/<span[^>]*aria-label="([^"]+)"[^>]*>/);
            
            if (appIdMatch) {
                const appId = appIdMatch[1];
                const storeUrl = `https://play.google.com/store/apps/details?id=${appId}`;
                
                const message = `━━━━━━◈✿◈━━━━━━\n🔍 | نتيجة البحث: ${searchTerm}\n📎 | رابط التطبيق:\n${storeUrl}\n━━━━━━◈✿◈━━━━━━`;
                
                api.setMessageReaction("✅", event.messageID, (err) => {}, true);
                api.sendMessage(message, event.threadID);
            } else {
                api.sendMessage(`━━━━━━◈✿◈━━━━━━\n❌ | لم يتم العثور على تطبيق بإسم:\n「 ${searchTerm} 」\n━━━━━━◈✿◈━━━━━━`, event.threadID);
            }
        } catch (error) {
            console.error("Error:", error.message);
            api.sendMessage("🚧 | حدث خطأ أثناء البحث. يرجى المحاولة لاحقًا.", event.threadID);
        }
    }
};
