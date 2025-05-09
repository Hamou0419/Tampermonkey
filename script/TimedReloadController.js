// ==UserScript==
// @name         TimedReloadController
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  固定時間前後重整網頁
// @match        https://www.google.com/
// @author       Hamou
// @grant        none
// @run-at       document-start
// ==/UserScript==

// 重整時間 (HH:MM)
const targetTime = '12:00';
// 重整前多少秒進入準備階段
const prepareSec = 60;
// 重整前多少秒開始狂刷階段
const leadTimeSec = 10;
// 重整後尾追多少秒繼續刷
const trailTimeSec = 5;

(function() {
    'use strict';

    const now = Date.now();
    const [H, M] = targetTime.split(':').map(n => parseInt(n, 10));
    const today = new Date();
    const tgtTs = new Date(
        today.getFullYear(), today.getMonth(), today.getDate(),
        H, M, 0, 0
    ).getTime();

    const prepareTs = tgtTs - prepareSec * 1000;
    const startTs = tgtTs - leadTimeSec * 1000;
    const endTs = tgtTs + trailTimeSec * 1000;

    // 分鐘前準備
    if (now < prepareTs) {
        setTimeout(onPrepare, prepareTs - now);
    } else {
        onPrepare();
    }

    // 10 秒前啟動狂刷
    if (now < startTs) {
        setTimeout(startSniping, startTs - now);
    } else if (now <= endTs) {
        startSniping();
    }

    function onPrepare() {
        console.log(`[Sniper] ${targetTime} 前 ${prepareSec}s：進入準備階段`);
    }

    function startSniping() {
        console.log(`[${targetTime}] 重整階段：從 ${(new Date(startTs)).toLocaleTimeString()} 開始刷到 ${(new Date(endTs)).toLocaleTimeString()}`);
        attemptReload();
    }

    function attemptReload() {
        if (Date.now() > endTs) {
            console.log('重整結束');
            return;
        }
        const run = () => {
            console.log('→ reload @', new Date().toLocaleTimeString());
            location.reload();
        };
        if (document.readyState === 'complete') {
            run();
        } else {
            window.addEventListener('load', run);
        }
    }
})();
