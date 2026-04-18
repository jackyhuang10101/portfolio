// 1. 從 Firebase 官方 CDN 載入所需的功能
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, push, get, query, orderByChild, limitToLast } 
from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// 2. 貼上你剛剛在 Firebase 主控台複製的設定檔 (這把鑰匙是你專屬的)
const firebaseConfig = {
  apiKey: "AIzaSyBgukCFMe_2xhHsHSmFJ_laPjQoRSkmK7I",
  authDomain: "portfolio-click-test.firebaseapp.com",
  databaseURL: "https://portfolio-click-test-default-rtdb.firebaseio.com/",
  projectId: "portfolio-click-test",
  storageBucket: "portfolio-click-test.firebasestorage.app",
  messagingSenderId: "852821339856",
  appId: "1:852821339856:web:b49d03316b67175a3a38d5"
};

// 3. 初始化 Firebase 與資料庫
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 4. 遊戲邏輯與介面綁定
let score = 0;
const clickBtn = document.getElementById('clickBtn');
const scoreDisplay = document.getElementById('score');
const nameInput = document.getElementById('playerName');
const leaderboardList = document.getElementById('leaderboardList');

clickBtn.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score; // 只更新網頁畫面，不連線資料庫
});

// 定義上傳函數
function uploadFinalScore() {
    if (score > 0) {
        const playerName = nameInput.value || "無名冒險者";
        push(ref(db, 'scores'), {
            name: playerName,
            score: score
        });
        // 上傳後可以重設本地分數，避免重複計算
        console.log("資料已成功同步至 Firebase");
    }
}

// 當使用者離開頁面、切換分頁或關閉視窗時觸發
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        uploadFinalScore();
    }
});

// 針對部分手機瀏覽器，加入 pagehide 作為備援
window.addEventListener('pagehide', uploadFinalScore);

// 建立一個函數，只在需要時執行一次抓取
async function refreshLeaderboard() {
    const topScoresQuery = query(ref(db, 'scores'), orderByChild('score'), limitToLast(10));
    
    try {
        const snapshot = await get(topScoresQuery); // 使用 get 而非 onValue
        if (snapshot.exists()) {
            // ... 這裡放原本處理 dataArray 並更新 UI 的邏輯 ...
            console.log("排行榜已更新");
        }
    } catch (error) {
        console.error("抓取失敗:", error);
    }
}

// 網頁開啟時抓取一次
refreshLeaderboard();