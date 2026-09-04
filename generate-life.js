const puppeteer = require('puppeteer');

// Размеры остаются прежними
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
    top: 767px;
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    grid-template-columns: repeat(90, 1fr);
    gap: 3px;
    width: 95%;
  }
  
  .dot { 
    width: 24px; 
    height: 24px; 
    border-radius: 50%; 
    background: #2E2E2E;
  }
  
  .past { background: #fff; }
  .current-year { background: #FF7A45; }
  
  /* ТЕКСТ ВНИЗУ */
  .stats { 
    position: absolute;
    top: 2000px;
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
const moscowTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
const currentYear = moscowTime.getFullYear();
const currentMonth = moscowTime.getMonth();

const age = currentYear - birthYear;
const totalMonths = totalYears * 12;
let passedMonths = 0;

const cal = document.getElementById('lifeCal');

for (let y = 0; y < totalYears; y++) {
  const yearNum = birthYear + y;
  
  let isCurrentYear = (yearNum === currentYear);
  let isPastYear = (yearNum < currentYear);
  
  for (let m = 0; m < 12; m++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    
    if (isPastYear) {
      dot.classList.add('past');
      passedMonths++;
    } else if (isCurrentYear) {
      if (m <= currentMonth) {
        dot.classList.add('current-year');
        passedMonths++;
      }
    }
    
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

