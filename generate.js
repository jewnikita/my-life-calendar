const puppeteer = require('puppeteer');

const WIDTH = 1179;
const HEIGHT = 2556;

const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { 
    background: #000; 
    width: ${WIDTH}px; 
    height: ${HEIGHT}px; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0; padding: 0;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    width: 90%;
  }
  .month { text-align: center; }
  .name { color: #666; font-size: 24px; margin-bottom: 10px; font-weight: 600; }
  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
    justify-items: center;
  }
  .dot { width: 18px; height: 18px; border-radius: 50%; background: #222; }
  .past { background: #fff; }
  .today { background: #ff3b30; }
  .empty { background: transparent; }
  .stats { margin-top: 40px; font-size: 36px; color: #ff3b30; font-weight: 500; }
</style>
</head>
<body>
<div class="grid" id="cal"></div>
<div class="stats" id="stat"></div>
<script>
const m = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
const now = new Date();
const y = now.getFullYear(), cm = now.getMonth(), cd = now.getDate();
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
  
  for(let i=0; i<fd; i++) { const e=document.createElement('div'); e.className='dot empty'; dd.appendChild(e); }
  
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

document.getElementById('stat').innerText = (total-passed) + 'd left  ' + ((passed/total)*100).toFixed(1) + '%';
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
