import { log } from "../logger/index.js";

export default {
  name: "threadUpdate",
  execute: async ({ api, event, Threads }) => {
    try {
      // العثور على بيانات المجموعة باستخدام معرّف المجموعة
      const threadsData = await Threads.find(event.threadID);
      const threads = threadsData?.data?.data || {};

      // إذا كانت البيانات غير موجودة، قم بإنشاء مجموعة جديدة
      if (!threads) {
        await Threads.create(event.threadID);
      }

      // إذا كانت البيانات فارغة، أوقف المعالجة
      if (!Object.keys(threads).length) return;

      // التعامل مع أنواع التحديث المختلفة
      switch (event.logMessageType) {
        case "log:thread-name":
          await handleThreadName(api, event, Threads, threads);
          break;
        case "change_thread_admins":
          await handleAdminChange(api, event, Threads, threads);
          break;
        case "change_thread_approval_mode":
          await handleApprovalModeChange(api, event, Threads, threads);
          break;
        case "log:thread-icon":
          await handleThreadIconChange(api, event, Threads, threads);
          break;
        case "change_thread_nickname":
          await handleNicknameChange(api, event, Threads, threads);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error handling thread update:", error);
    }
  },
};

// التعامل مع تغيير الكنية
async function handleNicknameChange(api, event, Threads, threads) {
  const { userID, newNickname } = event.logMessageData;

  if (threads.anti?.nicknameBox) {
    await api.setUserNickname(userID, threads.data.oldNicknames?.[userID] || "");
    return api.sendMessage(
      `✧══════•❁◈❁•══════✧\n✺ ┇ 🛡️ حماية الكنية مُفعّلة\n✺ ┇ ❌ لا يمكن تغيير الكنية\n✧══════•❁◈❁•══════✧`,
      event.threadID
    );
  }

  threads.data.oldNicknames = threads.data.oldNicknames || {};
  threads.data.oldNicknames[userID] = newNickname;
  await Threads.update(event.threadID, { data: threads.data });

  const adminName = await getUserName(api, event.author);
  api.sendMessage(
    `✧══════•❁◈❁•══════✧\n✺ ┇ 🏷️ تم تغيير الكنية\n✺ ┇ ◍ إلى: ${newNickname}\n✺ ┇ ◍ بواسطة: ${adminName}\n✧══════•❁◈❁•══════✧`,
    event.threadID
  );
}

// التعامل مع تغيير الاسم
async function handleThreadName(api, event, Threads, threads) {
  const { name: oldName = null } = threads;
  const { name: newName } = event.logMessageData;

  if (threads.anti?.nameBox) {
    await api.setTitle(oldName, event.threadID);
    return api.sendMessage(
      `✧══════•❁◈❁•══════✧\n✺ ┇ 🛡️ حماية الاسم مُفعّلة\n✺ ┇ ❌ لا يمكن تغيير اسم المجموعة\n✧══════•❁◈❁•══════✧`,
      event.threadID
    );
  }

  await Threads.update(event.threadID, { name: newName });

  const adminName = await getUserName(api, event.author);
  api.sendMessage(
    `✧══════•❁◈❁•══════✧\n✺ ┇ 📝 تم تغيير اسم المجموعة\n✺ ┇ ◍ إلى: 『${newName}』\n✺ ┇ ◍ بواسطة: ${adminName}\n✧══════•❁◈❁•══════✧`,
    event.threadID
  );
}

// التعامل مع تغيير المسؤولين
async function handleAdminChange(api, event, Threads, threads) {
  const { adminIDs = [] } = threads;
  const { TARGET_ID, ADMIN_EVENT } = event.logMessageData;

  if (ADMIN_EVENT === "add_admin" && !adminIDs.includes(TARGET_ID)) {
    adminIDs.push(TARGET_ID);
  }

  if (ADMIN_EVENT === "remove_admin") {
    const indexOfTarget = adminIDs.indexOf(TARGET_ID);
    if (indexOfTarget > -1) {
      adminIDs.splice(indexOfTarget, 1);
    }
  }

  await Threads.update(event.threadID, {
    adminIDs,
  });

  const action = ADMIN_EVENT === "add_admin" ? "✅ إضافة" : "❌ إزالة";
  const adminName = await getUserName(api, TARGET_ID);
  api.sendMessage(
    `🔖 | تمت ${action} ${adminName} كآدمن في المجموعة`,
    event.threadID
  );
}

// التعامل مع تغيير وضع الموافقة
async function handleApprovalModeChange(api, event, Threads, threads) {
  const { APPROVAL_MODE } = event.logMessageData;
  await Threads.update(event.threadID, {
    approvalMode: APPROVAL_MODE === 0 ? false : true,
  });

  const action = APPROVAL_MODE === 0 ? "تفعيل" : "❌ تعطيل ✅";
  api.sendMessage(
    `تم ${action} ميزة الموافقة في المجموعة 🔖 |<${event.threadID}> - ${threads.name}`,
    event.threadID
  );
}

// التعامل مع تغيير أيقونة المجموعة
async function handleThreadIconChange(api, event, Threads, threads) {
  const { threadThumbnail: newIcon } = event.logMessageData;
  const adminName = await getUserName(api, event.author);

  if (threads.anti?.iconBox) {
    return api.sendMessage(
      `✧══════•❁◈❁•══════✧\n✺ ┇ 🛡️ حماية الصورة مُفعّلة\n✺ ┇ ❌ لا يمكن تغيير صورة المجموعة\n✧══════•❁◈❁•══════✧`,
      event.threadID
    );
  }

  await Threads.update(event.threadID, {
    data: { ...threads.data, threadThumbnail: newIcon },
  });

  api.sendMessage(
    `✧══════•❁◈❁•══════✧\n✺ ┇ 🖼️ تم تغيير صورة المجموعة\n✺ ┇ بواسطة: ${adminName}\n✧══════•❁◈❁•══════✧`,
    event.threadID
  );
}

// الحصول على اسم المستخدم
async function getUserName(api, userID) {
  const userInfo = await api.getUserInfo(userID);
  return userInfo?.[userID]?.name || "Unknown";
}
