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

async function refreshLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    
    // 建立查詢：按分數排序並取最後 10 筆
    const topScoresQuery = query(ref(db, 'scores'), orderByChild('score'), limitToLast(10));
    
    try {
        const snapshot = await get(topScoresQuery);
        
        // 【關鍵】只要連線成功，就先把「載入中」清掉
        leaderboardList.innerHTML = ''; 

        if (snapshot.exists()) {
            let dataArray = [];
            snapshot.forEach((childSnapshot) => {
                dataArray.push(childSnapshot.val());
            });
            dataArray.reverse();

            dataArray.forEach((data, index) => {
                const li = document.createElement('li');
                li.textContent = `#${index + 1} ${data.name} - ${data.score}`;
                leaderboardList.appendChild(li);
            });
        } else {
            // 如果資料庫沒資料，顯示提示而不是空白
            leaderboardList.innerHTML = '<li>目前還沒有人上榜，快來挑戰！</li>';
        }
    } catch (error) {
        // 如果還是噴紅字，把錯誤顯示在網頁上方便除錯
        console.error("抓取失敗:", error);
        leaderboardList.innerHTML = `<li style="color:red">連線失敗：${error.message}</li>`;
    }
}

// 網頁開啟時抓取一次
refreshLeaderboard();