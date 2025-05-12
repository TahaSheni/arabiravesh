// تابع دریافت امتیازات از localStorage
function getScores() {
    return JSON.parse(localStorage.getItem("players") || "[]");
}

// تابع ذخیره امتیازات در localStorage
function saveScores(scores) {
    localStorage.setItem("players", JSON.stringify(scores));
}

// رمز عبور برای پاک کردن داده‌ها
const ADMIN_PASSWORD = "arabi404"; // رمز عبور را اینجا تعیین کنید

// متغیر برای نگهداری وضعیت ورود ادمین
let isAdminMode = false;

// متغیر برای ذخیره رکورد در حال حذف
let currentDeleteIndex = null;
let currentDeletePlayer = null;

// تابع فعال‌سازی حالت مدیر
function enableAdminMode() {
    isAdminMode = true;
    document.querySelector('.leaderboard-container').classList.add('admin-mode');
    document.querySelector('.admin-indicator').classList.add('active');
}

// تابع غیرفعال‌سازی حالت مدیر
function disableAdminMode() {
    isAdminMode = false;
    document.querySelector('.leaderboard-container').classList.remove('admin-mode');
    document.querySelector('.admin-indicator').classList.remove('active');
}

// نمایش جدول امتیازات
function displayLeaderboard() {
    const scores = getScores();
    const tbody = document.getElementById('leaderboardBody');
    const noScores = document.querySelector('.no-scores');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const schoolFilter = document.getElementById('schoolFilter');
    const selectedDifficulty = difficultyFilter.value;
    const selectedSchool = schoolFilter.value;
    
    tbody.innerHTML = '';
    
    // فیلتر بر اساس سطح سختی و مدرسه
    let filteredScores = scores;
    
    // فیلتر بر اساس سختی
    filteredScores = filteredScores.filter(score => score.difficulty === selectedDifficulty);
    
    // فیلتر بر اساس مدرسه
    if (selectedSchool !== 'all') {
        filteredScores = filteredScores.filter(score => score.school === selectedSchool);
    }
    
    // مرتب‌سازی بر اساس امتیاز (نزولی)
    filteredScores.sort((a, b) => b.score - a.score);

    if (filteredScores.length === 0) {
        tbody.style.display = 'none';
        noScores.style.display = 'block';
        return;
    }

    tbody.style.display = '';
    noScores.style.display = 'none';

    filteredScores.forEach((score, index) => {
        const row = document.createElement('tr');
        const rankClass = index < 3 ? `top-${index + 1}` : '';
        row.className = rankClass;
        
        row.innerHTML = `
            <td class="rank">${index + 1}</td>
            <td>${score.name || 'بدون نام'}</td>
            <td>${score.score}</td>
            <td>
                <button class="delete-button" data-index="${getOriginalIndex(scores, score)}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // اضافه کردن گوش‌دهنده رویداد برای دکمه‌های حذف
    addDeleteButtonListeners();
}

// دریافت شاخص اصلی رکورد در آرایه کلی بر اساس شناسه یکتا
function getOriginalIndex(allScores, targetScore) {
    return allScores.findIndex(score => 
        score.name === targetScore.name && 
        score.score === targetScore.score && 
        score.school === targetScore.school && 
        score.difficulty === targetScore.difficulty
    );
}

// تابع اضافه کردن گوش‌دهنده رویداد برای دکمه‌های حذف
function addDeleteButtonListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!isAdminMode) {
                // اگر در حالت مدیر نیستیم، نمایش پیام خطا
                document.getElementById('messageTitle').textContent = 'خطا';
                document.getElementById('messageText').textContent = 'برای حذف رکوردها، ابتدا باید وارد حالت مدیریت شوید.';
                showModal('messageModal');
                return;
            }
            
            const index = this.getAttribute('data-index');
            const scores = getScores();
            currentDeleteIndex = index;
            currentDeletePlayer = scores[index];
            
            // نمایش اطلاعات بازیکن در مودال حذف
            document.getElementById('deletePlayerInfo').textContent = 
                `نام: ${currentDeletePlayer.name || 'بدون نام'} - امتیاز: ${currentDeletePlayer.score} - مدرسه: ${currentDeletePlayer.school}`;
            
            // نمایش مودال تایید حذف
            showModal('deleteModal');
        });
    });
}

// تابع نمایش مودال
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// تابع مخفی کردن مودال
function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// تابع درخواست رمز عبور و ورود به حالت مدیریت
function requestAdminAccess() {
    // نمایش مودال رمز عبور
    showModal('passwordModal');
    
    // تنظیم فوکوس روی فیلد رمز عبور
    setTimeout(() => {
        document.getElementById('passwordInput').focus();
    }, 100);
}

// تابع پاک کردن داده‌های لیدربورد
function clearLeaderboard() {
    if (!isAdminMode) {
        // اگر در حالت مدیر نیستیم، ابتدا رمز بخواهیم
        requestAdminAccess();
        return;
    }
    
    // نمایش مودال تأیید
    showModal('confirmModal');
}

// تأیید رمز عبور
document.getElementById('submitPassword').addEventListener('click', function() {
    const password = document.getElementById('passwordInput').value;
    
    if (password === ADMIN_PASSWORD) {
        // مخفی کردن مودال رمز عبور
        hideModal('passwordModal');
        // پاک کردن فیلد رمز عبور
        document.getElementById('passwordInput').value = '';
        // فعال کردن حالت مدیر
        enableAdminMode();
        
        // نمایش پیام موفقیت
        document.getElementById('messageTitle').textContent = 'عملیات موفق';
        document.getElementById('messageText').textContent = 'حالت مدیریت فعال شد. حالا می‌توانید رکوردها را حذف کنید.';
        showModal('messageModal');
    } else {
        // پاک کردن فیلد رمز عبور
        document.getElementById('passwordInput').value = '';
        // فوکوس مجدد روی فیلد رمز عبور
        document.getElementById('passwordInput').focus();
        
        // نمایش پیام خطا
        document.getElementById('messageTitle').textContent = 'خطا';
        document.getElementById('messageText').textContent = 'رمز عبور اشتباه است!';
        showModal('messageModal');
    }
});

// اضافه کردن گوش‌دهنده رویداد برای کلید Enter در فیلد رمز عبور
document.getElementById('passwordInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('submitPassword').click();
    }
});

// لغو ورود رمز عبور
document.getElementById('cancelPassword').addEventListener('click', function() {
    hideModal('passwordModal');
    document.getElementById('passwordInput').value = '';
});

// اضافه کردن گوش‌دهنده رویداد برای دکمه مدیریت
document.getElementById('adminModeBtn').addEventListener('click', requestAdminAccess);

// تأیید پاک کردن همه امتیازات
document.getElementById('confirmYes').addEventListener('click', function() {
    localStorage.removeItem("players");
    displayLeaderboard();
    hideModal('confirmModal');
    
    // نمایش پیام موفقیت
    document.getElementById('messageTitle').textContent = 'عملیات موفق';
    document.getElementById('messageText').textContent = 'تمام امتیازات با موفقیت پاک شدند.';
    showModal('messageModal');
});

// لغو پاک کردن امتیازات
document.getElementById('confirmNo').addEventListener('click', function() {
    hideModal('confirmModal');
});

// تأیید حذف رکورد تکی
document.getElementById('deleteYes').addEventListener('click', function() {
    if (currentDeleteIndex !== null && currentDeletePlayer) {
        // دریافت امتیازات موجود
        const scores = getScores();
        
        // حذف رکورد
        scores.splice(currentDeleteIndex, 1);
        
        // ذخیره امتیازات جدید
        saveScores(scores);
        
        // به‌روزرسانی نمایش
        displayLeaderboard();
        
        // بستن مودال
        hideModal('deleteModal');
        
        // نمایش پیام موفقیت
        document.getElementById('messageTitle').textContent = 'عملیات موفق';
        document.getElementById('messageText').textContent = 'رکورد مورد نظر با موفقیت حذف شد.';
        showModal('messageModal');
        
        // پاک کردن متغیرهای موقت
        currentDeleteIndex = null;
        currentDeletePlayer = null;
    }
});

// لغو حذف رکورد تکی
document.getElementById('deleteNo').addEventListener('click', function() {
    hideModal('deleteModal');
    currentDeleteIndex = null;
    currentDeletePlayer = null;
});

// بستن پیام
document.getElementById('messageOk').addEventListener('click', function() {
    hideModal('messageModal');
});

// اضافه کردن گوش‌دهنده رویداد برای فیلتر سختی
document.getElementById('difficultyFilter').addEventListener('change', displayLeaderboard);

// اضافه کردن گوش‌دهنده رویداد برای فیلتر مدرسه
document.getElementById('schoolFilter').addEventListener('change', displayLeaderboard);

// اضافه کردن گوش‌دهنده رویداد برای دکمه پاک کردن
document.getElementById('clearLeaderboard').addEventListener('click', clearLeaderboard);

// اضافه کردن گوش‌دهنده رویداد برای دکمه خروج از حالت مدیریت
document.getElementById('exitAdminMode').addEventListener('click', function() {
    disableAdminMode();
    
    // نمایش پیام موفقیت
    document.getElementById('messageTitle').textContent = 'عملیات موفق';
    document.getElementById('messageText').textContent = 'از حالت مدیریت خارج شدید.';
    showModal('messageModal');
});

// نمایش اولیه جدول امتیازات
document.addEventListener('DOMContentLoaded', function() {
    // تنظیم مقدار پیش‌فرض فیلتر سختی به "آسان"
    document.getElementById('difficultyFilter').value = 'easy';
    displayLeaderboard();
}); 