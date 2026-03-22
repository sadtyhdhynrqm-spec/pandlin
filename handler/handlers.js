import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { log } from "../logger/index.js";
import { t } from "../helper/translate.js";

export class CommandHandler {
  constructor({ api, event, Threads, Users, Economy, Exp }) {
    this.arguments = {
      api,
      event,
      Users,
      Threads,
      Economy,
      Exp,
    };
    this.client = global.client;
    this.config = this.client?.config || {};
    this.commands = this.client?.commands || new Map();
    this.aliases = this.client?.aliases || new Map();
    this.cooldowns = this.client?.cooldowns || new Map();
    this.handler = this.client?.handler || {};
    this.events = this.client?.events || {};
  }

  async handleCommand() {
    try {
      const { Users, Threads, api, event } = this.arguments;
      const { body, threadID, senderID, isGroup, messageID } = event;
      const prefix = this.config.prefix || "/";
      const adminIDs = this.config.ADMIN_IDS || [];

      if (!body) return;

      // ━━━ تحكم المطور بالبوت بدون بريفيكس ━━━
      if (adminIDs.includes(senderID)) {
        const devMatch = body.match(/^شغلي\s+(.+)/i);
        if (devMatch) {
          const rawCmd = devMatch[1].trim();
          const [cmd, ...args] = rawCmd.split(/\s+/);
          const commandName = cmd.toLowerCase();
          const command = this.commands.get(commandName) || this.commands.get(this.aliases.get(commandName));
          if (command) {
            api.setMessageReaction("⚙️", messageID, () => {}, true);
            return await command.execute({ ...this.arguments, args });
          } else {
            return api.sendMessage(`❌ | الأمر 「${cmd}」 غير موجود.`, threadID, messageID);
          }
        }
      }

      if (!body.startsWith(prefix)) return;

      // Check if bot is enabled (except for admins)
      if (!this.config.botEnabled && !adminIDs.includes(senderID)) {
        return;
      }

      const getThreadPromise = Threads.find(event.threadID);
      const getUserPromise = Users.find(senderID);
      const [getThread, banUserData] = await Promise.all([getThreadPromise, getUserPromise]);

      const banUser = banUserData?.data?.data?.banned;
      if (banUser?.status && !adminIDs.includes(senderID)) {
        return api.sendMessage(t("errors.banned_user", { reason: banUser.reason }), threadID);
      }

      if (isGroup) {
        const banThread = getThread?.data?.data?.banned;
        if (banThread?.status && !adminIDs.includes(senderID)) {
          return api.sendMessage(t("errors.banned_thread", { reason: banThread.reason }), threadID);
        }
      }

      const bodyWithoutPrefix = body.slice(prefix.length).trim();
      const [cmd, ...args] = bodyWithoutPrefix.split(/\s+/);
      const commandName = cmd.toLowerCase();
      const command = this.commands.get(commandName) || this.commands.get(this.aliases.get(commandName));

      if (!command) return;

      // Cooldown (skip for admins)
      if (!adminIDs.includes(senderID)) {
        if (!this.cooldowns.has(command.name)) {
          this.cooldowns.set(command.name, new Map());
        }
        const currentTime = Date.now();
        const timeStamps = this.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldowns ?? 5) * 1000;

        if (timeStamps.has(senderID)) {
          const expTime = timeStamps.get(senderID) + cooldownAmount;
          if (currentTime < expTime) {
            const timeLeft = (expTime - currentTime) / 1000;
            return api.sendMessage(t("errors.cooldown", { time: timeLeft.toFixed(1) }), threadID, messageID);
          }
        }
        timeStamps.set(senderID, currentTime);
        setTimeout(() => { timeStamps.delete(senderID); }, cooldownAmount);
      }

      // Role check
      if (command.role === "admin" || command.role === "owner") {
        if (!adminIDs.includes(senderID)) {
          try {
            const threadInfo = await api.getThreadInfo(threadID);
            const threadAdminIDs = (threadInfo.adminIDs || []).map(a => typeof a === 'object' ? a.uid : a);
            if (!threadAdminIDs.includes(senderID)) {
              api.setMessageReaction("🚫", messageID, () => {}, true);
              return api.sendMessage(t("errors.no_permission"), threadID, messageID);
            }
          } catch(e) {
            api.setMessageReaction("🚫", messageID, () => {}, true);
            return api.sendMessage(t("errors.no_permission"), threadID, messageID);
          }
        }
      }

      await command.execute({ ...this.arguments, args });
    } catch (error) {
      console.error("❌ خطأ في تنفيذ الأمر:", error.message);
    }
  }

  handleEvent() {
    try {
      this.commands.forEach((event) => {
        if (event.events) {
          event.events({ ...this.arguments });
        }
      });
      this.events.forEach((event) => {
        event.execute({ ...this.arguments });
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async handleReply() {
    const { messageReply } = this.arguments.event;
    if (!messageReply) return;

    const reply = this.handler.reply.get(messageReply.messageID);
    if (!reply) return;

    if (reply.unsend) this.arguments.api.unsendMessage(messageReply.messageID);

    const command = this.commands.get(reply.name);
    if (!command) {
      return await this.arguments.api.sendMessage(t("errors.reply_not_found"), this.arguments.event.threadID, this.arguments.event.messageID);
    }

    if (parseInt(reply.expires)) {
      setTimeout(() => {
        this.handler.reply.delete(messageReply.messageID);
      }, reply.expires * 1000);
    }

    command.onReply && (await command.onReply({ ...this.arguments, reply }));
  }

  async handleReaction() {
    const { event, api } = this.arguments;
    if (event.type !== "message_reaction") return;

    const { messageID, senderID, reaction } = event;
    const adminIDs = this.config.ADMIN_IDS || [];

    // ━━━ خاصية 🦆: حذف رسالة البوت للمطور فقط ━━━
    if (reaction === "🦆" && adminIDs.includes(senderID)) {
      try {
        await api.unsendMessage(messageID);
        return;
      } catch (e) {
        console.error("❌ لم أتمكن من حذف الرسالة:", e.message);
        return;
      }
    }

    const registeredReaction = this.handler.reactions.get(messageID);
    if (!registeredReaction) return;

    const command = this.commands.get(registeredReaction.name);
    if (!command) {
      return await api.sendMessage(t("errors.execution_failed"), event.threadID, messageID);
    }
    command.onReaction && (await command.onReaction({ ...this.arguments, reaction: registeredReaction }));
  }
}
