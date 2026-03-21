import axios from "axios";
import fs from "fs";
import path from "path";

async function randomImageAndUptime({ api, event }) {
    try {
        const categories = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry"];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        const imageRes = await axios.get(`https://api.waifu.pics/sfw/${randomCategory}`);
        const imageUrl = imageRes.data.url;

        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imagePath = path.join(process.cwd(), 'cache', `uptime_image.jpg`);
        await fs.promises.writeFile(imagePath, imageResponse.data);

        const uptime = process.uptime();
        const seconds = Math.floor(uptime % 60);
        const minutes = Math.floor((uptime / 60) % 60);
        const hours = Math.floor((uptime / (60 * 60)) % 24);
        const days = Math.floor(uptime / (60 * 60 * 24));

        let uptimeString = `${days} يوم\nو ${hours} ساعة\nو ${minutes} دقيقة\nو ${seconds} ثانية`;
        if (days === 0) {
            uptimeString = `${hours} ساعة\nو ${minutes} دقيقة\nو ${seconds} ثانية`;
            if (hours === 0) {
                uptimeString = `${minutes} دقيقة\nو ${seconds} ثانية`;
                if (minutes === 0) {
                    uptimeString = `${seconds} ثانية`;
                }
            }
        }

        const message = `◈ ─────────────── ◈\n🚀 | كاغويا البوت\n✧ شغالة منذ ⠐\n◉ ${uptimeString}\n◈ ─────────────── ◈`;
        const imageStream = fs.createReadStream(imagePath);

        api.setMessageReaction("🚀", event.messageID, (err) => {}, true);

        await api.sendMessage({
            body: message,
            attachment: imageStream
        }, event.threadID, event.messageID);

        try { await fs.promises.unlink(imagePath); } catch(e) {}
    } catch (error) {
        console.error(error);
        const uptime = process.uptime();
        const seconds = Math.floor(uptime % 60);
        const minutes = Math.floor((uptime / 60) % 60);
        const hours = Math.floor((uptime / (60 * 60)) % 24);
        const days = Math.floor(uptime / (60 * 60 * 24));
        const uptimeString = days > 0 ? `${days}د ${hours}س ${minutes}ق` : `${hours}س ${minutes}ق ${seconds}ث`;
        api.sendMessage(`◈ ─────────────── ◈\n🚀 | كاغويا شغالة منذ:\n◉ ${uptimeString}\n◈ ─────────────── ◈`, event.threadID, event.messageID);
    }
}

export default {
    name: "اوبتايم",
    description: "مدة تشغيل البوت.",
    aliases:["up","ابتايم"],
    execute: randomImageAndUptime
};
