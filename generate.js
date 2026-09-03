const puppeteer = require('puppeteer');
const fs = require('fs');

const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  background: #000; 
  width: 1080px; 
  height: 2340px; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
  overflow: hidden;
}
.months-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 60px;
  width: 90%;
  margin-bottom: 80px;
}
.month {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.month-name {
  font-size: 36px;
  color: #666;
  margin-bottom: 30px;
  font-weight: 500;
}
.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
}
.day {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2a2a2a;
}
.day.past { background: #fff; }
.day.today { background: #ff453a; }
.stats {
  font-size: 48px;
  margin-top: 60px;
  display: flex;
  gap: 30px;
  align-items: center;
}
.days-left { color: #ff453a; }
.percent { color: #666; }
</style>
</head>
<body>
<div class="months-grid" id="calendar"></div>
<div class="stats">
  <span class="days-left" id="daysLeft"></span>
  <span class="percent" id="percent"></span>
</div>

<script>
const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
const now = new Date();
const year = now.getFullYear();
const currentMonth = now.getMonth();
const currentDay = now.getDate();

const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
const daysInMonths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const calendar = document.getElementById('calendar');
let totalDaysPassed = 0;
const totalDays = 365 + (isLeap ? 1 : 0);

months.forEach((monthName, monthIndex) => {
  const monthDiv = document.createElement('div');
  monthDiv.className = 'month';
  
  const nameDiv = document.createElement('div');
  nameDiv.className = 'month-name';
  nameDiv.textContent = monthName;
  monthDiv.appendChild(nameDiv);
  
  const daysGrid = document.createElement('div');
  daysGrid.className = 'days-grid';
  
  const daysCount = daysInMonths[monthIndex];
  for (let day = 1; day <= daysCount; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    
    if (monthIndex < currentMonth) {
      dayDiv.classList.add('past');
      totalDaysPassed++;
    } else if (monthIndex === currentMonth) {
      if (day < currentDay) {
        dayDiv.classList.add('past');
        totalDaysPassed++;
      } else if (day === currentDay) {
        dayDiv.classList.add('today');
        totalDaysPassed++;
      }
    }
    
    daysGrid.appendChild(dayDiv);
  }
  
  monthDiv.appendChild(daysGrid);
  calendar.appendChild(monthDiv);
});

const daysLeft = totalDays - totalDaysPassed;
const percent = ((totalDaysPassed / totalDays) * 100).toFixed(1);

document.getElementById('daysLeft').textContent = daysLeft + 'd left';
document.getElementById('percent').textContent = percent + '%';
</script>
</body>
</html>
`;

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1080, height: 2340 });
  await page.setContent(html);
  
  await page.screenshot({
    path: 'calendar.png',
    type: 'png',
    clip: { x: 0, y: 0, width: 1080, height: 2340 }
  });
  
  await browser.close();
  console.log('Calendar PNG generated!');
})();

