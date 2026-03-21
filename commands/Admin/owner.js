export default {
  name: 'المطور', 
  author: 'AbuUbaida', 
  role: 'member', 
  description: 'يعرض معلومات وجهة اتصال المطور الخاص بالبوت.', 
  aliases: ['مطور', 'ابوكي', 'معلومات'],
  async execute({ api, event }) {
    try {
      const ownerInfo = {
        name: 'أبـو عـبـيـدة (سـيـنـكـو)',
        gender: 'ذكر',
        age: '17',
        country: 'الـسـودان 🇸🇩',
        facebookLink: 'https://www.facebook.com/profile.php?id=61588108307572',
        nick: 'S I N K O ⚡',
      };

      const ownerContactID = '61588108307572'; // معرف حسابك الشخصي

      // رسالة المعلومات بتنسيق فخم
      const message = `♢ ═════════════════ ♢
      •———[ مـعـلـومـات الـمـالـك ]———•
      ❏ الاسـم: 『${ownerInfo.name}』
      ❏ الـعـمـر: 『${ownerInfo.age}』 سـنـة
      ❏ الـبـلـد: 『${ownerInfo.country}』
      ❏ الـلـقـب: 『${ownerInfo.nick}』
      ❏ الـرابـط: 『${ownerInfo.facebookLink}』
♢ ═════════════════ ♢`;

      // إرسال رسالة المعلومات
      await api.sendMessage(message, event.threadID);

      // مشاركة جهة الاتصال الخاصة بك
      await api.shareContact(ownerContactID, ownerContactID, event.threadID);

      // إضافة تفاعل صاروخ للتميز
      api.setMessageReaction('🚀', event.messageID, (err) => {}, true);
    } catch (error) {
      console.error('حدث خطأ أثناء تنفيذ الأمر:', error);
      api.sendMessage('⚠️ حدث خطأ أثناء معالجة الأمر.', event.threadID);
    }
  },
};
