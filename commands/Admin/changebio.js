import axios from 'axios';

export default {
    name: 'فاكت',
    author: 'kaguya project',
    role: 'member',
    aliases:['كت'],
    description: 'جلب حقيقة وترجمتها إلى العربية.',
    
    execute: async function ({ api, event }) {
        try {
            const factResponse = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
            const fact = factResponse.data.text;

            if (!fact) {
                return api.sendMessage("❓ | عذرًا، لم أتمكن من جلب الحقيقة.", event.threadID, event.messageID);
            }

            const translationResponse = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(fact)}`);
            const translatedText = translationResponse?.data?.[0]?.[0]?.[0];

            const displayText = translatedText || fact;

            api.sendMessage(`●═══════❍═══════●\n📝 | فاكت :\n${displayText}\n●═══════❍═══════●`, event.threadID, event.messageID);
        } catch (error) {
            console.error('خطأ أثناء جلب أو ترجمة الحقيقة:', error.message);
            api.sendMessage("🚧 | حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقًا.", event.threadID, event.messageID);
        }
    }
};
