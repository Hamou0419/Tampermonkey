// ==UserScript==
// @name         Hide Tab Title v0.4
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  無論怎麼更新都把標題變成固定字串
// @author       Hamou
// @match        https://www.google.com/
// @grant        none
// @run-at       document-idle
// ==/UserScript==

const title = '';

(function() {
  // 直接覆寫 document.title 的 getter/setter
  Object.defineProperty(document, 'title', {
    configurable: true,
    get:    () => title, // 取標題永遠回傳這個
    set:    v => {},  // 設標題時什麼都不做
  });

  // 確保 <title> 文字一載入就被改掉
  const titleEl = document.querySelector('title');
  if (titleEl) titleEl.textContent = title;

  // 萬一 React、Vue 又偷偷重寫，再用定時器補漏
  setInterval(() => {
    if (document.querySelector('title').textContent !== title) {
      document.querySelector('title').textContent = title;
    }
  }, 200);
})();
