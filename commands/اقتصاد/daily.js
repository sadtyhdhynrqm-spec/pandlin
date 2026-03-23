import axios from "axios";
import fs from "fs";

export default {
  name: "هدية",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "الحصول على مكافأة يومية",
  aliases: ["هديه", "يومي"],
  cooldowns: 3600,
  async execute({ api, event, Economy, Users }) {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeStamps = 3600;
    try {
      const lastCheckedTime = await Users.find(event.senderID);
      if (
        lastCheckedTime?.data?.data?.other?.cooldowns &&
        currentTime - parseInt(lastCheckedTime?.data?.data?.other?.cooldowns) < timeStamps
      ) {
        const remainingTime = timeStamps - (currentTime - lastCheckedTime?.data?.data?.other?.cooldowns);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return api.sendMessage(`✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ الـمـكـافـأة الـيـومـيـة ⟭
✺ ┇
✺ ┇ ⚠️ لقد أخذت مكافأتك بالفعل
✺ ┇ ⏱️ عُد بعد: ${minutes} دقيقة ${seconds} ثانية
✺ ┇
✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
      }

      const dailyRewards = [5000, 1000, 1050, 1600, 1200, 1400, 1981, 9910, 6955, 4231, 5482, 5400];
      const rewardAmount = dailyRewards[Math.floor(Math.random() * dailyRewards.length)];

      await Economy.increase(rewardAmount, event.senderID);
      await Users.update(event.senderID, { other: { cooldowns: currentTime } });

      try {
        const response = await axios.get("https://i.imgur.com/t5VGSUZ.gif", { responseType: "stream" });
        const imagePath = "./cache/temp.gif";
        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);
        writer.on("finish", () => {
          api.sendMessage({
            body: `✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ الـمـكـافـأة الـيـومـيـة ⟭\n✺ ┇\n✺ ┇ ✅ تم إيداع مكافأتك بنجاح\n✺ ┇ 🎁 المبلغ: ${rewardAmount} دولار\n✺ ┇\n✧══════•❁◈❁•══════✧`,
            attachment: fs.createReadStream(imagePath),
          }, event.threadID, event.messageID);
        });
      } catch (imgErr) {
        api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇\n✺ ┇ ⏣ ⟬ الـمـكـافـأة الـيـومـيـة ⟭\n✺ ┇\n✺ ┇ ✅ تم إيداع: ${rewardAmount} دولار 🎁\n✺ ┇\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
      }
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ حدث خطأ أثناء التنفيذ\n✧══════•❁◈❁•══════✧", event.threadID);
    }
  }
};
