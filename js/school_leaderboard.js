// تابع دریافت امتیازات از localStorage
function getScores() {
    return JSON.parse(localStorage.getItem("players") || "[]");
}

// بازیابی مدرسه انتخاب شده از localStorage
const selectedSchool = localStorage.getItem("selectedSchool") || "علوی";

// نمایش نام مدرسه در عنوان
document.getElementById('school-name').textContent = selectedSchool;

// نمایش جدول امتیازات
function displayLeaderboard() {
    const scores = getScores();
    const tbody = document.getElementById('leaderboardBody');
    const noScores = document.querySelector('.no-scores');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const selectedDifficulty = difficultyFilter.value;
    
    tbody.innerHTML = '';
    
    // فیلتر بر اساس سطح سختی و مدرسه
    let filteredScores = scores.filter(score => score.school === selectedSchool);
    
    // فیلتر بر اساس سختی
    filteredScores = filteredScores.filter(score => score.difficulty === selectedDifficulty);
    
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
            <td>${score.class || '---'}</td>
            <td>${score.score}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// اضافه کردن گوش‌دهنده رویداد برای فیلتر سختی
document.getElementById('difficultyFilter').addEventListener('change', displayLeaderboard);

// نمایش اولیه جدول امتیازات
document.addEventListener('DOMContentLoaded', function() {
    // تنظیم مقدار پیش‌فرض فیلتر سختی به "آسان"
    document.getElementById('difficultyFilter').value = 'easy';
    displayLeaderboard();
}); 