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
  }
  .grid {
    position: absolute;
    top: 30%;                    /* <-- МЕНЯЙ ЭТО: чем больше %, тем ниже месяцы */
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
    width: 20px; 
    height: 20px; 
    border-radius: 50%; 
    background: #2E2E2E; 
  }
  .past { background: #fff; }
  .today { background: #FF7A45; } 
  .empty { background: transparent; }
  .stats { 
    position: absolute;
    bottom: 20%;                 /* <-- МЕНЯЙ ЭТО: чем больше %, тем выше текст */
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
