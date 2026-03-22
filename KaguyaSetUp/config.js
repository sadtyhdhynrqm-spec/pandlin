// KaguyaSetUp/config.js
export default {
    prefix: "*",
    BOT_NAME: "snfor",
    ADMIN_IDS: ["61588108307572", "61588108307572"], // ✅ المطورين
    botEnabled: true,
    autogreet: true,
    options: {
        forceLogin: true,
        listenEvents: true,
        listenTyping: true,
        logLevel: "silent",
        updatePresence: true,
        selfListen: false,
        usedDatabase: false
    },
    database: {
        type: "json"
    },
    port: 3000,
    mqtt_refresh: 1200000
};
