import axios from 'axios';

function GetActions(ActionCode) {
    const ActionsMap = {
        "us1": "upsample_subtle",
        "us2": "upsample_creative",
        "lv": "low_variation",
        "hv": "high_variation",
        "zo2": "zoom_out_2x",
        "zo1.5": "zoom_out_1_5x",
        "sq": "square",
        "pl": "pan_left",
        "pr": "pan_right",
        "pu": "pan_up",
        "pd": "pan_down",
        "u1": "upsample1",
        "u2": "upsample2",
        "u3": "upsample3",
        "u4": "upsample4",
        "🔁": "reroll",
        "v1": "variation1",
        "v2": "variation2",
        "v3": "variation3",
        "v4": "variation4"
    };
    return ActionsMap[ActionCode] || "Invalid action";
}

function MapActions(ActionsArray) {
    const Codes = {
        "upsample_subtle": "us1",
        "redo_upsample_subtle": "us1",
        "redo_upsample_creative": "us2",
        "upsample_creative": "us2",
        "low_variation": "lv",
        "high_variation": "hv",
        "zoom_out_2x": "zo2",
        "zoom_out_1_5x": "zo1.5",
        "square": "sq",
        "pan_left": "pl",
        "pan_right": "pr",
        "pan_up": "pu",
        "pan_down": "pd",
        "upsample1": "u1",
        "upsample2": "u2",
        "upsample3": "u3",
        "upsample4": "u4",
        "reroll": "🔁",
        "variation1": "v1",
        "variation2": "v2",
        "variation3": "v3",
        "variation4": "v4"
    };
    return ActionsArray.map(action => Codes[action] || "Invalid action");
}

async function imgStream(url) {
    const res = await axios.get(url, { responseType: 'stream', timeout: 30000 });
    return res.data;
}

async function uploadImage(imageUrl) {
    const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer', timeout: 30000 });
    const base64 = Buffer.from(imgRes.data).toString('base64');
    const formData = new URLSearchParams();
    formData.append('key', '2d67905cc7f0b400e7c489d2f4e10c23');
    formData.append('image', base64);
    const res = await axios.post('https://api.imgbb.com/1/upload', formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return res.data?.data?.url || imageUrl;
}

class MidJourneyAPI {
    async Generate(prompt) {
        const res = await axios.post('https://nexra.aryahcr.cc/api/image/complements', {
            prompt,
            model: 'midjourney',
            response: true
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 60000
        });

        let taskId = res.data?.task_id || res.data?.id;
        if (!taskId) throw new Error("لم يتم الحصول على معرّف المهمة");

        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 3000));
            const status = await axios.get(`https://nexra.aryahcr.cc/api/image/complements/${taskId}`, {
                timeout: 15000
            });
            const data = status.data;
            if (data?.status === 'completed' && data?.images?.[0]) {
                return {
                    raw_image_url: data.images[0],
                    image_id: taskId,
                    actions: ["upsample1", "upsample2", "upsample3", "upsample4", "variation1", "variation2", "variation3", "variation4", "reroll"]
                };
            }
            if (data?.status === 'failed') throw new Error("فشل التوليد");
        }
        throw new Error("انتهت مهلة التوليد");
    }

    async Action({ action, image_id }) {
        const res = await axios.post('https://nexra.aryahcr.cc/api/image/complements', {
            prompt: action,
            model: 'midjourney',
            task_id: image_id,
            response: true
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 60000
        });

        let taskId = res.data?.task_id || res.data?.id || image_id;

        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 3000));
            const status = await axios.get(`https://nexra.aryahcr.cc/api/image/complements/${taskId}`, {
                timeout: 15000
            });
            const data = status.data;
            if (data?.status === 'completed' && data?.images?.[0]) {
                return {
                    raw_image_url: data.images[0],
                    image_id: taskId,
                    actions: ["upsample1", "upsample2", "upsample3", "upsample4", "variation1", "variation2", "variation3", "variation4", "reroll"]
                };
            }
            if (data?.status === 'failed') throw new Error("فشل التعديل");
        }
        throw new Error("انتهت مهلة التعديل");
    }
}

export default {
    name: "ميدجورني",
    aliases: ["mj"],
    author: "Shady Tarek",
    description: "توليد صور بالذكاء الاصطناعي عبر MidJourney",
    role: "member",
    cooldowns: 10,

    execute: async function ({ api, event, args }) {
        const { threadID, messageID, senderID, messageReply } = event;
        let prompt = args.join(" ");

        if (messageReply?.attachments?.length > 0 && ["photo", "sticker"].includes(messageReply.attachments[0].type)) {
            try {
                const hostedUrl = await uploadImage(messageReply.attachments[0].url);
                prompt = `${prompt} --sref ${hostedUrl}`;
            } catch (e) {
                prompt = `${prompt} ${messageReply.attachments[0].url}`;
            }
        }

        if (!prompt.trim()) {
            return api.sendMessage("⚠️ | يرجى تقديم نص لإنشاءه", threadID, messageID);
        }

        try {
            api.setMessageReaction("⚙️", messageID, () => {}, true);
            const Mid = new MidJourneyAPI();
            const image = await Mid.Generate(prompt);

            if (!image?.raw_image_url) {
                api.setMessageReaction("❌", messageID, () => {}, true);
                return api.sendMessage("❌ | فشل التوليد، حاول مرة أخرى", threadID, messageID);
            }

            const imageStream = await imgStream(image.raw_image_url);
            const Ac = MapActions(image.actions);

            const info = await api.sendMessage({
                body: `✅ | تم الانتهاء بنجاح ✨\n\nاختار : \n${Ac.map(i => i.toUpperCase()).join(', ')}`,
                attachment: imageStream
            }, threadID, messageID);

            global.client.handler.reply.set(info.messageID, {
                name: "ميدجورني",
                author: senderID,
                ImageID: image.image_id,
                Actions: image.actions
            });

            api.setMessageReaction("✅", messageID, () => {}, true);
        } catch (error) {
            console.error("MidJourney error:", error.message);
            api.setMessageReaction("❌", messageID, () => {}, true);
            api.sendMessage(`❌ | حدث خطأ: ${error.message}`, threadID, messageID);
        }
    },

    onReply: async function ({ api, event, reply }) {
        const { threadID, messageID, senderID, body } = event;
        const { author, ImageID, Actions } = reply;

        if (senderID !== author) return;

        const args = body.trim().split(" ");
        const options = MapActions(Actions);
        const Options = options.map(i => i.toUpperCase());
        const userSelection = args[0]?.toLowerCase();

        if (!options.includes(userSelection)) {
            return api.sendMessage(`⚠️ | اختيار خاطئ اختار بين ${Options.join(', ')}.`, threadID, messageID);
        }

        try {
            api.setMessageReaction("⚙️", messageID, () => {}, true);
            await api.sendMessage("⚠️ | جاري تعديل الصورة انتظر...", threadID, messageID);

            const Mid = new MidJourneyAPI();
            const Image = await Mid.Action({ action: GetActions(userSelection), image_id: ImageID });

            const options2 = MapActions(Image.actions);
            const Options2 = options2.map(i => i.toUpperCase());

            const info = await api.sendMessage({
                body: `✅ | تم تعديل الصورة : ${userSelection.toUpperCase()} تعديلات اخرى: \n${Options2.join(', ')}`,
                attachment: await imgStream(Image.raw_image_url)
            }, threadID, messageID);

            api.setMessageReaction("✔️", messageID, () => {}, true);

            global.client.handler.reply.set(info.messageID, {
                name: "ميدجورني",
                author: senderID,
                ImageID: Image.image_id,
                Actions: Image.actions
            });
        } catch (error) {
            api.setMessageReaction("❌", messageID, () => {}, true);
            api.sendMessage("فشل في العملية.", threadID, messageID);
        }
    }
};
