document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bg-music");
  const settingsBtn = document.getElementById("settings-btn");
  const settingsOverlay = document.getElementById("settings-overlay");
  const settingspanel = document.getElementById("settings-panel");
  const closeSettings = document.getElementById("close-settings");
  const musicToggle = document.getElementById("music-toggle");
  const schoolSelector = document.getElementById("school-selector");
  const easyGameLink = document.getElementById("difficulty-easy-link");
  const hardGameLink = document.getElementById("difficulty-hard-link");

  // تنظیم صدا
  music.volume = 0.3;

  // بازیابی مدرسه انتخاب شده از localStorage
  const savedSchool = localStorage.getItem("selectedSchool");
  if (savedSchool) {
    schoolSelector.value = savedSchool;
  } else {
    // اگر مدرسه‌ای انتخاب نشده باشد، علوی را به صورت پیش‌فرض انتخاب می‌کنیم
    localStorage.setItem("selectedSchool", "علوی");
  }

  // تنظیم لینک‌های بازی
  function updateGameLinks() {
    easyGameLink.href = "loading.html?difficulty=easy";
    hardGameLink.href = "loading.html?difficulty=hard";
  }

  // اجرای اولیه تنظیم لینک‌ها
  updateGameLinks();

  // پخش موسیقی فقط بعد از اولین کلیک کاربر
  function playOnce() {
    music.play().catch((e) => {
      console.log("پخش صدا با خطا مواجه شد:", e);
    });
    document.body.removeEventListener("click", playOnce);
  }
  document.body.addEventListener("click", playOnce);

  // نمایش تنظیمات
  settingsBtn.addEventListener("click", () => {
    settingsOverlay.classList.remove("hidden");
    settingspanel.classList.remove("hidden");

    musicToggle.checked = !music.paused;
  });

  // بستن تنظیمات
  closeSettings.addEventListener("click", () => {
    settingsOverlay.classList.add("hidden");
    settingspanel.classList.add("hidden");
  });

  // تغییر وضعیت پخش موسیقی از تنظیمات
  musicToggle.addEventListener("change", () => {
    if (musicToggle.checked) {
      music.play().catch((e) => {
        console.log("خطا در پخش موسیقی:", e);
      });
    } else {
      music.pause();
    }
  });
  
  // ذخیره تغییر مدرسه به محض تغییر
  schoolSelector.addEventListener("change", () => {
    localStorage.setItem("selectedSchool", schoolSelector.value);
  });
});
