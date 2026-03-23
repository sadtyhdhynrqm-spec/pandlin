import WeatherJS from "weather-js";
import axios from "axios";

async function translateToArabic(text) {
  try {
    const r = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`);
    return r?.data?.[0]?.[0]?.[0] || text;
  } catch { return text; }
}

export default {
  name: "الطقس",
  author: "سينكو 𓆩☆𓆪",
  role: "member",
  description: "الحصول على تقرير الطقس لمدينة معينة",
  async execute({ api, event, args }) {
    try {
      if (args.length < 1) {
        return api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ⚠️ أدخل اسم المدينة\n✺ ┇ مثال: الطقس الرياض\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
      }
      const location = args.join(" ");
      WeatherJS.find({ search: location, degreeType: "C" }, async (err, result) => {
        if (err || result.length === 0) {
          return api.sendMessage(`✧══════•❁◈❁•══════✧\n✺ ┇ ❌ لم يُعثر على نتائج لـ "${location}"\n✧══════•❁◈❁•══════✧`, event.threadID, event.messageID);
        }
        const w = result[0];
        const city = await translateToArabic(w.location.name);
        const sky = await translateToArabic(w.current.skytext);
        const wind = await translateToArabic(w.current.winddisplay);
        const forecast = await Promise.all([
          translateToArabic(w.forecast[0]?.skytextday || ""),
          translateToArabic(w.forecast[1]?.skytextday || ""),
          translateToArabic(w.forecast[2]?.skytextday || ""),
          translateToArabic(w.forecast[3]?.skytextday || ""),
          translateToArabic(w.forecast[4]?.skytextday || ""),
        ]);
        const msg = `✧══════•❁◈❁•══════✧
✺ ┇
✺ ┇ ⏣ ⟬ تـقـريـر الـطـقـس ⟭
✺ ┇
✺ ┇ ◍ الـمـدينـة: ${city}
✺ ┇ ◍ الـحـرارة: ${w.current.temperature}°C
✺ ┇ ◍ الـسـمـاء: ${sky}
✺ ┇ ◍ الـرطـوبـة: ${w.current.humidity}%
✺ ┇ ◍ الـريـاح: ${wind}
✺ ┇ ◍ أشعر كأنها: ${w.current.feelslike}°C
✺ ┇
✺ ┇ ⏣ تـنـبـؤ الأيـام الـقـادمـة
✺ ┇ ◍ اليوم: ${forecast[0]}
✺ ┇ ◍ غداً: ${forecast[1]}
✺ ┇ ◍ الثلاثاء: ${forecast[2]}
✺ ┇ ◍ الأربعاء: ${forecast[3]}
✺ ┇ ◍ الخميس: ${forecast[4]}
✺ ┇
✧══════•❁◈❁•══════✧`;
        api.sendMessage(msg, event.threadID, event.messageID);
      });
    } catch (error) {
      api.sendMessage("✧══════•❁◈❁•══════✧\n✺ ┇ ❌ خطأ في جلب بيانات الطقس\n✧══════•❁◈❁•══════✧", event.threadID, event.messageID);
    }
  }
};
