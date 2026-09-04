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
  
  .grid {
    position: absolute;
    top: 550px;              /* Было 30% */
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    width: 88%;
  }
  
  .month { text-align: center; }
  .name { 
    color: #888; 
    font-size: 26px; 
    margin-bottom: 12px; 
    font-weight: 400;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 9px;
    justify-items: center;
  }
  
  .dot { 
    width: 24px; 
    height: 24px; 
    border-radius: 50%; 
    background: #2E2E2E; 
  }
  
  .past { background: #fff; }
  .today { background: #FF7A45; } 
  .empty { background: transparent; }
  
  .stats { 
    position: absolute;
    bottom: 700px;           /* Было 34% */
    left: 50%;
    transform: translateX(-50%);
    font-size: 40px; 
    font-weight: 300;
    letter-spacing: -0.5px;
    display: flex;
    gap: 20px;
    align-items: baseline;
  }
  
  .days-left { 
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
<div class="grid" id="cal"></div>
<div class="stats">
  <span class="days-left" id="daysLeft"></span>
  <span class="percent" id="percent"></span>
</div>
<script>
const m = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
const now = new Date();
const moscowTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
const y = moscowTime.getFullYear(), cm = moscowTime.getMonth(), cd = moscowTime.getDate();
const leap = (y%4===0 && y%100!==0) || y%400===0;
const dim = [31, leap?29:28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let passed = 0, total = 365 + (leap?1:0);
const cal = document.getElementById('cal');

m.forEach((name, mi) => {
  const md = document.createElement('div'); md.className='month';
  const nd = document.createElement('div'); nd.className='name'; nd.innerText=name; md.appendChild(nd);
  const dd = document.createElement('div'); dd.className='days';
  
  let fd = new Date(y, mi, 1).getDay();
  fd = (fd === 0) ? 6 : fd - 1;
  
  for(let i=0; i<fd; i++) { 
    const e=document.createElement('div'); 
    e.className='dot empty'; 
    dd.appendChild(e); 
  }
  
  for(let d=1; d<=dim[mi]; d++) {
    const dot = document.createElement('div'); dot.className='dot';
    if(mi < cm) { dot.classList.add('past'); passed++; }
    else if(mi === cm) {
      if(d < cd) { dot.classList.add('past'); passed++; }
      else if(d === cd) { dot.classList.add('today'); passed++; }
    }
    dd.appendChild(dot);
  }
  md.appendChild(dd); cal.appendChild(md);
});

const left = total - passed;
const percent = Math.round((passed/total)*100);

document.getElementById('daysLeft').innerText = left + ' дней осталось';
document.getElementById('percent').innerText = percent + '%';
</script>
</body></html>`;

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });
  await page.setContent(htmlContent);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'calendar.png', type: 'png' });
  await browser.close();
  console.log('Done!');
})();

