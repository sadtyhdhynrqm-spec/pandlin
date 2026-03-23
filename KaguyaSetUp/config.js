// KaguyaSetUp/config.js
export default {
    prefix: "*",
    BOT_NAME: "بندلين",
    ADMIN_IDS: ["61588108307572", "61588108307572"], // ✅ المطورين
    botEnabled: true,
    autogreet: true,
    options: {
        forceLogin: true,
        listenEvents: true,
        listenTyping: false,
        logLevel: "silent",
        updatePresence: false,
        selfListen: false,
        usedDatabase: false
    },
    database: {
        type: "json"
    },
    port: 3000,
    mqtt_refresh: 1200000
};
