// index.js — نسخة معدلة لدعم الاستضافة على Render
import express from "express"; // إضافة مكتبة اكسبريس لفتح المنفذ
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import axios from "axios";
import semver from "semver";
import gradient from "gradient-string";
import { log, notifer } from "./logger/index.js";
import { commandMiddleware, eventMiddleware } from "./middleware/index.js";
import config from "./KaguyaSetUp/config.js";
import ws3fca from "ws3-fca";

// --- إعداد سيرفر الويب لـ Render ---
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('البوت يعمل بنجاح! ✅');
});
app.listen(port, () => {
  console.log(`[ النظام ]: تم فتح المنفذ ${port} لضمان استمرار الاستضافة.`);
});
// ----------------------------------

const login = ws3fca.login || ws3fca;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class snfor {
  constructor() {
    this.currentConfig = config;
    this.credentialsPath = path.join(__dirname, "KaguyaSetUp", "KaguyaState.json");
    this.package = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"));
    this.retryCount = 0;
    this.maxRetries = 10;
    this.retryDelay = 10000;
    this.checkCredentials();
  }

  checkCredentials() {
    try {
      if (!fs.existsSync(this.credentialsPath)) {
        throw new Error("ملف KaguyaState.json غير موجود.");
      }
      const data = fs.readFileSync(this.credentialsPath, "utf8");
      const appState = JSON.parse(data);
      if (!Array.isArray(appState) || appState.length === 0) {
        throw new Error("ملف appState فارغ أو غير صالح.");
      }
      this.appState = appState;
    } catch (error) {
      log([
        { message: "[ خطأ ]: ", color: "red" },
        { message: `فشل في قراءة appState: ${error.message}`, color: "white" }
      ]);
      process.exit(1);
    }
  }

  async checkVersion() {
    const pinkGradient = gradient("#ff66cc", "#ff00ff", "#cc00ff");
    console.log("");
    console.log(pinkGradient("█▀█ █▀█ █▄░█ █▀▀ █▀█ █▀"));
    console.log(pinkGradient("█▀▄ █▄█ █░▀█ █▄▄ █▄█ ▄█"));
    console.log(pinkGradient("=".repeat(55)));
    console.log(`${pinkGradient("[ المطور ]: ")} ${gradient("cyan", "pink")("حمودي سان 🇸🇩")}`);
    console.log(pinkGradient("=".repeat(55)));

    try {
      const response = await axios.get("https://raw.githubusercontent.com/hamoudisan/snfor-bot/main/package.json", { timeout: 10000 });
      const remotePackage = response.data;
      if (semver.lt(this.package.version, remotePackage.version)) {
        log([{ message: "[ نظام ]: ", color: "yellow" }, { message: `يوجد تحديث جديد (v${remotePackage.version})!`, color: "white" }]);
      }
    } catch (err) {
      log([{ message: "[ تنبيه ]: ", color: "yellow" }, { message: "تعذر التحقق من التحديثات.", color: "white" }]);
    }
    await this.loadComponents();
    this.startBot();
  }

  async loadComponents() {
    global.client = {
      commands: new Map(),
      events: new Map(),
      cooldowns: new Map(),
      aliases: new Map(),
      handler: { reply: new Map(), reactions: new Map() },
      config: this.currentConfig,
    };
    try { await commandMiddleware(); } catch (err) {}
    try { await eventMiddleware(); } catch (err) {}
  }

  startBot() {
    this.checkCredentials();
    login(this.appState, this.currentConfig.options, async (err, api) => {
      if (err) {
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          setTimeout(() => this.startBot(), this.retryDelay * this.retryCount);
        }
        return;
      }
      this.retryCount = 0;
      log([{ message: "[ استماع ]: ", color: "green" }, { message: "البوت يستمع للرسائل الآن...", color: "white" }]);
      
      api.listen(async (err, event) => {
        if (err) {
          if (err.error === "Not logged in") setTimeout(() => this.startBot(), 15000);
          return;
        }
        if (!event) return;
        try {
          const { listen } = await import("./listen/listen.js");
          if (typeof listen === "function") await listen({ api, event, client: global.client });
        } catch (error) {}
      });
    });
  }
}

new snfor().checkVersion();
