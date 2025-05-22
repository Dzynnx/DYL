let userBarrages = []; // 存储用户输入的弹幕
let isDisplayingUserBarrages = false; // 标记是否正在显示用户输入的弹幕
let isContinuousBarrageStarted = false; // 标记持续弹幕是否已启动
let showDefaultAfterWishes = false; // 标记是否需要显示默认弹幕

document.addEventListener('DOMContentLoaded', () => {
    // 主页面：烟花效果
    const fireworks = document.querySelector('.fireworks');
    if (fireworks) {
        setInterval(() => {
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                particle.style.left = `${x}vw`;
                particle.style.top = `${y}vh`;
                particle.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
                particle.style.width = `${Math.random() * 4 + 4}px`;
                particle.style.height = particle.style.width;
                const angle = Math.random() * 360;
                const distance = Math.random() * 120 + 60;
                particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
                particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
                fireworks.appendChild(particle);
            }
        }, 1500);
    }

    // 主页面：计时器和日期显示
    function updateTimer() {
        const startDate = new Date('2023-02-11T00:00:00');
        const currentDate = new Date();
        const diff = currentDate - startDate;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.innerText = ` 已结束：${days}天${minutes}分${seconds}秒`;
        }

        const currentDateElement = document.getElementById('currentDate');
        if (currentDateElement) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            currentDateElement.innerText = ` 今天是：${year}年${month}月${day}日`;
        }
    }

    updateTimer();
    setInterval(updateTimer, 1000);

    // 祝福页面：卡片入场动画
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0) {
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // 祝福页面：可拖拽气球及爆破效果
    const balloons = document.querySelectorAll('.balloons .balloon');
    if (balloons.length > 0) {
        console.log(`找到 ${balloons.length} 个气球，应用自动浮动动画`);
        balloons.forEach((balloon, index) => {
            let isDragging = false;
            let currentX, currentY;

            // 确保页面加载时动画启动
            balloon.style.animation = `float 1.8s infinite ease-in-out ${index * 0.6}s, rotate 3s infinite ease-in-out ${index * 0.6}s`;
            console.log(`气球 ${index + 1} 初始动画已设置，延迟 ${index * 0.6}s`);

            balloon.addEventListener('mousedown', startDragging);
            balloon.addEventListener('mousemove', drag);
            balloon.addEventListener('mouseup', stopDragging);
            balloon.addEventListener('mouseleave', stopDragging);

            function startDragging(e) {
                isDragging = true;
                currentX = e.clientX - parseFloat(balloon.style.left || 0);
                currentY = e.clientY - parseFloat(balloon.style.top || 0);
                balloon.style.animation = 'none';
                createConfetti(e.clientX, e.clientY);
                console.log(`气球 ${index + 1} 开始拖拽`);
            }

            function drag(e) {
                if (isDragging) {
                    balloon.style.left = `${e.clientX - currentX}px`;
                    balloon.style.top = `${e.clientY - currentY}px`;
                }
            }

            function stopDragging() {
                if (isDragging) {
                    isDragging = false;
                    balloon.style.animation = `float 1.8s infinite ease-in-out ${index * 0.6}s, rotate 3s infinite ease-in-out ${index * 0.6}s`;
                    console.log(`气球 ${index + 1} 拖拽结束，恢复动画`);
                }
            }
        });

        // 强制刷新动画，解决浏览器渲染问题
        setTimeout(() => {
            balloons.forEach((balloon, index) => {
                balloon.style.animation = 'none';
                setTimeout(() => {
                    balloon.style.animation = `float 1.8s infinite ease-in-out ${index * 0.6}s, rotate 3s infinite ease-in-out ${index * 0.6}s`;
                    console.log(`气球 ${index + 1} 动画强制刷新`);
                }, 10);
            });
        }, 100);
    } else {
        console.warn('未找到任何气球元素，请检查 .balloons .balloon 类');
    }

    // 祝福页面：自动播放音乐
    const greetingMusic = document.getElementById('greetingMusic');
    if (greetingMusic) {
        greetingMusic.play().catch(() => {
            document.addEventListener('click', () => greetingMusic.play(), { once: true });
        });
    }

    // 恢复用户输入的愿望
    const userWishInput = document.getElementById('userWish');
    if (userWishInput && localStorage.getItem('userWish')) {
        userWishInput.value = localStorage.getItem('userWish');
    }
});

// 持续弹幕函数
function startContinuousBarrage() {
    if (isContinuousBarrageStarted) return;
    isContinuousBarrageStarted = true;
    const barrage = document.querySelector('.barrage');
    const topPositions = [15, 25, 35, 45, 55, 65, 75];
    let positionIndex = 0;

    function showContinuousMessage() {
        const text = document.createElement('div');
        text.className = 'barrage-text';
        text.innerText = '中国人最擅长和不爱的人结婚，然后用一生怀念爱的人';
        text.style.top = `${topPositions[positionIndex]}%`;
        text.style.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        barrage.appendChild(text);
        setTimeout(() => text.remove(), 4000); // 4秒移除，与横屏速度匹配
        positionIndex = (positionIndex + 1) % topPositions.length;
        setTimeout(showContinuousMessage, 4000); // 4秒间隔
    }
    showContinuousMessage();
}

// 气球拖拽时的彩纸效果
function createConfetti(x, y) {
    const container = document.querySelector('.greeting-page') || document.body;
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.position = 'absolute';
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;
        confetti.style.width = `${Math.random() * 8 + 4}px`;
        confetti.style.height = confetti.style.width;
        confetti.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
        confetti.style.borderRadius = '50%';
        const angle = Math.random() * 360;
        const distance = Math.random() * 50 + 20;
        confetti.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
        confetti.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
        confetti.style.animation = 'confettiFall 1.5s ease-out forwards';
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1500);
    }
}

// 动态添加彩纸动画的CSS
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
    @keyframes confettiFall {
        0% { transform: translate(0, 0); opacity: 1; }
        100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
    }
`;
document.head.appendChild(styleSheet);

function sendBarrage() {
    const userWish = document.getElementById('userWish').value.trim();
    if (userWish) {
        // 将输入内容按逗号分割成多个弹幕
        const wishes = userWish.split(',').map(w => w.trim()).filter(w => w);
        userBarrages.push(...wishes);
        localStorage.setItem('userWish', userWish);
        document.getElementById('userWish').value = ''; // 清空输入框

        // 播放“发送愿望”按钮的歌曲
        const wishMusic = document.getElementById('wishMusic');
        const memoryMusic = document.getElementById('memoryMusic');
        if (memoryMusic) {
            memoryMusic.pause();
            memoryMusic.currentTime = 0;
        }
        wishMusic.play().catch(() => {
            document.addEventListener('click', () => wishMusic.play(), { once: true });
        });

        if (!isDisplayingUserBarrages) {
            showDefaultAfterWishes = false; // 重置标记
            displayUserBarrages();
        }
    } else {
        // 如果输入为空，清空 localStorage 并显示默认弹幕
        localStorage.removeItem('userWish');
        userBarrages = []; // 清空当前弹幕
        showDefaultAfterWishes = false; // 重置标记
        if (!isDisplayingUserBarrages) {
            displayUserBarrages();
        }
    }
}

function displayUserBarrages() {
    const barrage = document.querySelector('.barrage');
    const topPositions = [15, 25, 35, 45, 55, 65, 75];

    if (userBarrages.length === 0) {
        // 如果愿望内容为空
        const storedWish = localStorage.getItem('userWish');
        if (showDefaultAfterWishes && storedWish) {
            // 如果需要显示默认弹幕（愿望内容已显示完一轮）
            const text = document.createElement('div');
            text.className = 'barrage-text';
            text.innerText = '最大遗憾就是不能和她在一起！';
            const randomPosition = topPositions[Math.floor(Math.random() * topPositions.length)];
            text.style.top = `${randomPosition}%`;
            text.style.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
            barrage.appendChild(text);
            setTimeout(() => text.remove(), 4000); // 4秒移除
            showDefaultAfterWishes = false; // 重置标记
            // 重新加载愿望内容以继续循环
            userBarrages = storedWish.split(',').map(w => w.trim()).filter(w => w);
            setTimeout(displayUserBarrages, 4000); // 4秒后继续
            return;
        } else if (!storedWish) {
            // 如果没有存储的愿望，显示默认弹幕并循环
            const text = document.createElement('div');
            text.className = 'barrage-text';
            text.innerText = '最大遗憾就是不能和她在一起！';
            const randomPosition = topPositions[Math.floor(Math.random() * topPositions.length)];
            text.style.top = `${randomPosition}%`;
            text.style.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
            barrage.appendChild(text);
            setTimeout(() => text.remove(), 4000); // 4秒移除
            setTimeout(displayUserBarrages, 4000); // 4秒后继续
            return;
        }
    }

    isDisplayingUserBarrages = true;
    const wish = userBarrages.shift();
    const text = document.createElement('div');
    text.className = 'barrage-text';
    text.innerText = wish;
    const randomPosition = topPositions[Math.floor(Math.random() * topPositions.length)];
    text.style.top = `${randomPosition}%`;
    text.style.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    barrage.appendChild(text);
    setTimeout(() => text.remove(), 4000); // 4秒移除

    if (userBarrages.length === 0 && localStorage.getItem('userWish')) {
        // 如果愿望内容输出完一轮，标记需要显示默认弹幕
        showDefaultAfterWishes = true;
    }

    setTimeout(displayUserBarrages, 4000); // 4秒后继续
}

function goToGreeting() {
    const wishMusic = document.getElementById('wishMusic');
    const memoryMusic = document.getElementById('memoryMusic');
    if (wishMusic) {
        wishMusic.pause();
        wishMusic.currentTime = 0;
    }
    if (memoryMusic) {
        memoryMusic.pause();
        memoryMusic.currentTime = 0;
    }
    window.location.href = 'greeting.html';
}

function openCard(cardElement) {
    cardElement.classList.add('open');
    if (cardElement.querySelector('#greetingTitle')) {
        const userWish = localStorage.getItem('userWish') || '';
        document.getElementById('greetingTitle').innerText = `${userWish}`;
        document.getElementById('greetingMessage').innerText = `祝你生日快乐呀！`;
    }
}

function showMemories() {
    const modal = document.getElementById('memoryModal');
    modal.style.display = 'flex';
    const wishMusic = document.getElementById('wishMusic');
    const memoryMusic = document.getElementById('memoryMusic');
    if (wishMusic) {
        wishMusic.pause();
        wishMusic.currentTime = 0;
    }
    memoryMusic.play().catch(() => {
        document.addEventListener('click', () => memoryMusic.play(), { once: true });
    });
    startContinuousBarrage();
}

function closeModal() {
    const modal = document.getElementById('memoryModal');
    modal.style.display = 'none';
    const memoryMusic = document.getElementById('memoryMusic');
    memoryMusic.pause();
    memoryMusic.currentTime = 0;
}