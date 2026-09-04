const puppeteer = require('puppeteer');

const WIDTH = 1179;
const HEIGHT = 2556;

const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { 
    background: #1A1A1A; 
    width: ${WIDTH}px; 
    height: ${HEIGHT}px; 
    position: relative;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    margin: 0; padding: 0;
    overflow: hidden;
  }
  
  /* СЕТКА ЖИЗНИ */
  .grid {
    position: absolute;
    top: 600px;              /* <-- Поднял повыше, чтобы влезло в 550-1550 */
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    /* 90 колонок (лет) */
    grid-template-columns: repeat(90, 1fr); 
    gap: 2px;                /* Маленький зазор */
    width: 88%;              /* Та же ширина, что у месяцев */
  }
  
  .dot { 
    width: 8px;              /* Уменьшил точки, чтобы 90 штук влезли */
    height: 8px;             /* Уменьшил точки */
    border-radius: 50%; 
    background: #2E2E2E;     /* Будущее (серый) */
  }
  
  .past { background: #fff; }      /* Прожитые месяцы (белый) */
  .current-month { background: #FF7A45; } /* ТОЛЬКО текущий месяц (оранжевый) */
  
  /* ТЕКСТ ВНИЗУ */
  .stats { 
    position: absolute;
    top: 1600px;           /* Текст ниже сетки */
    left: 50%;
    transform: translateX(-50%);
    font-size: 40px; 
    font-weight: 300;
    letter-spacing: -0.5px;
    display: flex;
    gap: 20px;
    align-items: baseline;
  }
  
  .years-lived { 
    color: #FF7A45; 
    font-weight: 300; 
  }
  .percent { 
    color: #888; 
    font-weight: 300; 
  }
</style>
</head>
<body>
<div class="grid" id="lifeCal"></div>
<div class="stats">
  <span class="years-lived" id="yearsLived"></span>
  <span class="percent" id="percent"></span>
</div>
<script>
const birthYear = 1996;
const totalYears = 90;

const now = new Date();
// Смещение на МСК (+3 часа)
const moscowTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
const currentYear = moscowTime.getFullYear();
const currentMonth = moscowTime.getMonth(); // 0-11

const totalMonths = totalYears * 12;
let passedMonths = 0;

const cal = document.getElementById('lifeCal');

// Генерируем 90 лет (колонок)
for (let y = 0; y < totalYears; y++) {
  const yearNum = birthYear + y;
  
  // Генерируем 12 месяцев (рядов) для каждого года
  for (let m = 0; m < 12; m++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    
    // Логика coloring:
    if (yearNum < currentYear) {
      // Весь прошлый год — белый
      dot.classList.add('past');
      passedMonths++;
    } else if (yearNum === currentYear) {
      // Текущий год:
      if (m < currentMonth) {
        // Прошедшие месяцы этого года — белые
        dot.classList.add('past');
        passedMonths++;
      } else if (m === currentMonth) {
        // ТОЛЬКО текущий месяц — оранжевый
        dot.classList.add('current-month');
        passedMonths++; // считаем его как пройденный для статистики
      }
      // Остальные месяцы текущего года остаются серыми (будущее)
    }
    // Будущие годы остаются серыми
    
    cal.appendChild(dot);
  }
}

const yearsPassed = Math.floor(passedMonths / 12);
const percent = Math.round((passedMonths / totalMonths) * 100);

document.getElementById('yearsLived').innerText = 'Прожито ' + yearsPassed + ' лет';
document.getElementById('percent').innerText = percent + '%';
</script>
</body></html>`;

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });
  await page.setContent(htmlContent);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'life-calendar.png', type: 'png' });
  await browser.close();
  console.log('Done!');
})();

