import { CommandHandler } from "../handler/handlers.js";
import { threadsController, usersController, economyControllers, expControllers } from "../database/controllers/index.js";
import { utils } from "../helper/index.js";

/**
 * Create an event handler with specific objects and arguments.
 * @param {object} api - API object.
 * @param {object} event - Specific event.
 * @param {object} User - User object.
 * @param {object} Thread - Thread object.
 * @param {object} Economy - Economy object.
 * @param {object} Exp - Experience object.
 * @returns {CommandHandler} - Command handler.
 */
const createHandler = (api, event, User, Thread, Economy, Exp) => {
  const args = { api, event, Users: User, Threads: Thread, Economy, Exp };
  return new CommandHandler(args);
};

/**
 * Handle the main event.
 * @param {object} options - Event handling options.
 */
const listen = async ({ api, event }) => {
  try {
    const { threadID, senderID, type, userID, from, isGroup } = event;
    const Thread = threadsController({ api });
    const User = usersController({ api });
    const Economy = economyControllers({ api, event });
    const Exp = expControllers({ api, event });

    if (["message", "message_reply"].includes(type)) {
      if (isGroup) {
        await Thread.create(threadID);
      }
      await User.create(senderID || userID || from);
    }

    global.kaguya = utils({ api, event });

    const handler = createHandler(api, event, User, Thread, Economy, Exp);
    await handler.handleEvent();

    if (type === "message") {
      await handler.handleCommand();
    } else if (type === "message_reaction") {
      await handler.handleReaction();
    } else if (type === "message_reply") {
      await handler.handleReply();
      await handler.handleCommand();
    }
  } catch (error) {
    console.error("❌ خطأ في معالجة الحدث:", error.message);
  }
};

export { listen };
