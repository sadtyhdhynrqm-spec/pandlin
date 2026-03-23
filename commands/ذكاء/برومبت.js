import axios from 'axios';
import crypto from 'crypto';

async function startSession(imgUrl) {
    let sessionID = crypto.randomBytes(4).toString("hex").toUpperCase();
    let data = JSON.stringify({
        data: [null, null, imgUrl, 0.3, 0.85, "threshold", 25, 10, false, false],
        event_data: null,
        fn_index: 2,
        trigger_id: 26,
        session_hash: sessionID
    });

    let config = {
        method: 'POST',
        url: 'https://pixai-labs-pixai-tagger-demo.hf.space/gradio_api/queue/join?__theme=system',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Content-Type': 'application/json',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Brave";v="140"',
            'x-zerogpu-uuid': crypto.randomBytes(4).toString("hex").toUpperCase(),
            'sec-ch-ua-mobile': '?0',
            'sec-gpc': '1',
            'accept-language': 'en;q=0.7',
            'origin': 'https://pixai-labs-pixai-tagger-demo.hf.space',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'none',
            'referer': 'https://pixai-labs-pixai-tagger-demo.hf.space/?__theme=system',
            'priority': 'u=1, i'
        },
        data: data,
        timeout: 30000
    };

    return {
        data: (await axios.request(config)).data,
        sessionID
    };
}

async function getResult(sessionID) {
    let config = {
        method: 'GET',
        url: 'https://pixai-labs-pixai-tagger-demo.hf.space/gradio_api/queue/data?session_hash=' + sessionID,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
            'Accept': 'text/event-stream',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Brave";v="140"',
            'content-type': 'application/json',
            'sec-ch-ua-mobile': '?0',
            'sec-gpc': '1',
            'accept-language': 'en;q=0.7',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-fetch-storage-access': 'none',
            'referer': 'https://pixai-labs-pixai-tagger-demo.hf.space/?__theme=system',
            'priority': 'u=1, i'
        },
        timeout: 60000
    };

    return (await axios.request(config)).data;
}

async function extractPrompt(imageUrl) {
    const session = await startSession(imageUrl);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const data = await getResult(session.sessionID);

    const match = data.match(/"output":\{"data":\["([^"]+)","([^"]+)","([^"]+)"/);

    if (match) {
        const prompt = match[1];
        const character = (match[2] && match[2] !== '—') ? match[2] : null;
        const series = (match[3] && match[3] !== '—') ? match[3] : null;

        if (character && series) return `${series}, ${character}, ${prompt}`;
        else if (character) return `${character}, ${prompt}`;
        else if (series) return `${series}, ${prompt}`;
        else return prompt;
    }

    const alternativePatterns = [
        /"data":\["([^"]+)"/,
        /"text":"([^"]+)"/,
        /"prompt":"([^"]+)"/
    ];

    for (let pattern of alternativePatterns) {
        const altMatch = data.match(pattern);
        if (altMatch && altMatch[1]) return altMatch[1];
    }

    return null;
}

export default {
    name: "برومبت",
    aliases: ["prompt"],
    author: "Assistant",
    description: "استخراج الـ prompt من الصور",
    role: "member",
    cooldowns: 15,

    execute: async function ({ api, event }) {
        const { threadID, messageID, messageReply, attachments } = event;

        try {
            api.setMessageReaction("⏳", messageID, () => {}, true);

            let imageUrl = null;

            if (messageReply?.attachments?.length > 0) {
                const imageAttachment = messageReply.attachments.find(att =>
                    att.type === "photo" || att.type === "image" ||
                    (att.url && att.url.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i))
                );
                if (imageAttachment?.url) imageUrl = imageAttachment.url;
            }

            if (!imageUrl && attachments?.length > 0) {
                const imageAttachment = attachments.find(att =>
                    att.type === "photo" || att.type === "image" ||
                    (att.url && att.url.match(/\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i))
                );
                if (imageAttachment?.url) imageUrl = imageAttachment.url;
            }

            if (!imageUrl) {
                api.setMessageReaction("❌", messageID, () => {}, true);
                return api.sendMessage("يرجى الرد على رسالة تحتوي على صورة لاستخراج الـ prompt منها", threadID, messageID);
            }

            const extractedPrompt = await extractPrompt(imageUrl);

            if (extractedPrompt) {
                api.sendMessage(extractedPrompt, threadID, messageID);
                api.setMessageReaction("✅", messageID, () => {}, true);
            } else {
                api.sendMessage("لم يتم العثور على prompt في هذه الصورة", threadID, messageID);
                api.setMessageReaction("❌", messageID, () => {}, true);
            }

        } catch (error) {
            api.sendMessage("حدث خطأ أثناء معالجة الصورة", threadID, messageID);
            api.setMessageReaction("❌", messageID, () => {}, true);
        }
    }
};
