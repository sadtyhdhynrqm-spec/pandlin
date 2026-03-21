import axios from "axios";
import fs from "fs-extra";
import path from "path";

const hackLines = [
  "Accessing mainframe...",
  "Bypassing firewall...",
  "Injecting payload...",
  "Decrypting credentials...",
  "Uploading virus...",
  "Extracting data...",
  "Erasing tracks...",
  "Done. Access granted.",
];

export default {
  name: "هاك",
  author: "Your Name",
  role: "member",
  description: "قم بعمل هاك لشخص.",
  execute: async ({ api, event }) => {
    let chilli;
    let pogi;

    if (event.messageReply) {
      chilli = event.messageReply.senderID;
      pogi = (await api.getUserInfo([chilli]))[chilli].name;
    } else if (Object.keys(event.mentions).length > 0) {
      chilli = Object.keys(event.mentions)[0];
      pogi = (await api.getUserInfo([chilli]))[chilli].name;
    } else {
      return api.sendMessage("👩‍💻 | قـم بالـرد أو إعـمـل مـنـشـن ", event.threadID, event.messageID);
    }

    const pangit = await new Promise((resolve, reject) => {
      api.sendMessage(`👩‍💻 | جـارٍ مـعـالـجـة الـهـاك لـ ${pogi}...`, event.threadID, (err, info) => {
        if (err) return reject(err);
        resolve(info);
      }, event.messageID);
    });

    try {
      const hackProgress = hackLines.map((line, i) => `[${i + 1}/${hackLines.length}] ${line}`).join("\n");
      const hackMsg = `◈ ─── HACK ─── ◈\n👩‍💻 | الهدف: ${pogi}\n🆔 | ID: ${chilli}\n\n${hackProgress}\n\n◈ ──────────── ◈\n✅ | تـم تـهـكـيـر ${pogi} بـنـجـاح!`;

      await api.sendMessage(hackMsg, event.threadID);
      api.unsendMessage(pangit.messageID);
    } catch (error) {
      console.error('Error:', error);
      await api.editMessage("❌ فشلت معالجة طلب الهاك. حاول مرة أخرى.", pangit.messageID);
    }
  }
};
