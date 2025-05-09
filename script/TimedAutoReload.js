// ==UserScript==
// @name         固定時間重整
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在指定時間（例如今天 12:00:00）重整網頁
// @author       Hamou
// @match        https://www.google.com/
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. 設定目標時間（24 小時制）
    const targetHour = 12;
    const targetMinute = 0;
    const targetSecond = 0;

    // 2. 計算今天這個時間的 timestamp
    const now = Date.now();
    const today = new Date();
    today.setHours(targetHour, targetMinute, targetSecond, 0);
    let targetTime = today.getTime();

    // 如果已經過了 就不觸發
    if (targetTime <= now) {
        console.warn('指定時間已過，不會自動重整');
        return;
    }

    // 3. 若差距大於 1 秒 先用一次 setTimeout「等到只剩下最後一秒」
    const diff = targetTime - now;
    if (diff > 1000) {
        setTimeout(waitFinalSecond, diff - 1000);
    } else {
        waitFinalSecond();
    }

    // 4. 最後 1 秒內 每 50ms 檢查一次 貼近真正的整點
    function waitFinalSecond() {
        const iv = setInterval(() => {
            if (Date.now() >= targetTime) {
                clearInterval(iv);
                fireReloadAndSniper();
            }
        }, 50);
    }

    // 5. 重整
    function fireReloadAndSniper() {
        console.log(new Date().toLocaleTimeString());
        location.reload();
    }
})();
