// 1. 從 Firebase 官方 CDN 載入所需的功能
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, push, onValue, query, orderByChild, limitToLast } 
from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// 2. 貼上你剛剛在 Firebase 主控台複製的設定檔 (這把鑰匙是你專屬的)
const firebaseConfig = {
  apiKey: "AIzaSy你的API金鑰...",
  authDomain: "你的專案.firebaseapp.com",
  databaseURL: "https://你的專案-default-rtdb.firebaseio.com",
  projectId: "你的專案ID",
  storageBucket: "你的專案.appspot.com",
  messagingSenderId: "你的發送者ID",
  appId: "你的AppID"
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

// 點擊按鈕：增加分數，並將成績「推 (push)」上雲端
clickBtn.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;

    const playerName = nameInput.value || "無名冒險者";
    
    // 將新資料送到資料庫中的 'scores' 資料夾
    push(ref(db, 'scores'), {
        name: playerName,
        score: score
    });
});

// 5. 監聽資料庫變化，自動更新排行榜
// 設定查詢：找到 'scores' 資料夾，用 score 排序，並只抓取最後 10 筆 (即最高分的 10 筆)
const topScoresQuery = query(ref(db, 'scores'), orderByChild('score'), limitToLast(10));

onValue(topScoresQuery, (snapshot) => {
    leaderboardList.innerHTML = ''; // 清空目前的列表
    
    // Firebase 取回的資料是從小排到大，我們需要把它反轉成由大到小
    let dataArray = [];
    snapshot.forEach((childSnapshot) => {
        dataArray.push(childSnapshot.val());
    });
    dataArray.reverse();

    // 將資料繪製到網頁上
    dataArray.forEach((data, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1} ${data.name} - ${data.score} 金幣`;
        leaderboardList.appendChild(li);
    });
});