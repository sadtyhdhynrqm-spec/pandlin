import { log } from "../logger/index.js";
import fs from "fs";
import axios from "axios";
import path from "path";

export default {
  name: "subscribe",
  execute: async ({ api, event, Threads, Users }) => {
    // جلب بيانات المجموعة
    var threads = (await Threads.find(event.threadID))?.data?.data;

    // التحقق من وجود بيانات المجموعة
    if (!threads) {
      await Threads.create(event.threadID);
    }

    switch (event.logMessageType) {
      case "log:unsubscribe": {
        // إذا تم طرد البوت من المجموعة
        if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
          await Threads.remove(event.threadID);
          return log([
            {
              message: "[ THREADS ]: ",
              color: "yellow",
            },
            {
              message: `تم حذف بيانات المجموعة: ${event.threadID} لأن باندلين غادرت.`,
              color: "green",
            },
          ]);
        }
        // تحديث عدد الأعضاء بعد خروج شخص
        await Threads.update(event.threadID, {
          members: +threads.members - 1,
        });
        break;
      }

      case "log:subscribe": {
        // إذا تمت إضافة البوت إلى المجموعة
        if (event.logMessageData.addedParticipants.some((i) => i.userFbId == api.getCurrentUserID())) {
          
          // تغيير اسم البوت عند إضافته (اللقب الملكي)
          const botName = "بـانـدلـيـن"; 
          api.changeNickname(
            `♢ الـنـظـام ♢ ← 『 ${botName} 』`,
            event.threadID,
            api.getCurrentUserID()
          );

          // رسالة الترحيب الفخمة لباندلين
          const welcomeMessage = `
◈ ───『 ♢ بـانـدلـيـن ♢ 』─── ◈

❁┊✅ تـم الـتـوصـيـل بـنـجـاح
❁┊🛡️ الـنـظـام : 『 مـتـصـل 』
❁┊🎀 إسـم الـبـوت : 『 ${botName} 』
❁┊👤 الـمـطـور : 『 سـيـنـكـو 』

◈ ────────────── ◈
❁┊⚠️ اكـتـب [ الـوامـر ] لـعـرض الـقـائمة
❁┊⚠️ لـأي مـشـكـلـة تـواصـل مـع الـمـطـور
◈ ────────────── ◈
❁┊🌐 رابـط الـمـطـور :
https://www.facebook.com/profile.php?id=61588108307572
◈ ───『 ♢ 2026 ♢ 』─── ◈`;

          // إرسال رسالة الترحيب
          api.sendMessage(welcomeMessage, event.threadID);
        } else {
          // تحديث بيانات الأعضاء الجدد
          for (let i of event.logMessageData.addedParticipants) {
            await Users.create(i.userFbId);
          }
          // تحديث عدد الأعضاء في قاعدة البيانات
          await Threads.update(event.threadID, {
            members: +threads.members + +event.logMessageData.addedParticipants.length,
          });
        }
        break;
      }
    }
  },
};
