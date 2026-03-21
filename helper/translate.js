import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let translations = {};

// تحميل الترجمات
try {
  const arabicPath = path.join(__dirname, "../locales/ar.json");
  if (fs.existsSync(arabicPath)) {
    translations = JSON.parse(fs.readFileSync(arabicPath, "utf8"));
  }
} catch (err) {
  console.error("❌ فشل تحميل ملف الترجمة:", err.message);
}

/**
 * دالة للحصول على نص مترجم
 * @param {string} key - مفتاح الترجمة (مثل: errors.banned_user)
 * @param {object} params - المتغيرات المراد استبدالها
 * @returns {string} - النص المترجم
 */
export const t = (key, params = {}) => {
  const keys = key.split(".");
  let text = translations;

  for (const k of keys) {
    if (text && typeof text === "object") {
      text = text[k];
    } else {
      return key; // إذا لم نجد الترجمة، أرجع المفتاح
    }
  }

  if (typeof text !== "string") {
    return key;
  }

  // استبدال المتغيرات
  let result = text;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`{${key}}`, value);
  }

  return result;
};

export default { t };
