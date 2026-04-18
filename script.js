let score = 0;
const clickBtn = document.getElementById('clickBtn');
const scoreDisplay = document.getElementById('score');

clickBtn.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
});