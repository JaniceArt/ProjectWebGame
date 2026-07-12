let currentUser = null;
let currentToken = localStorage.getItem('token') || null;

let currentGameId = 1;

// --- UTILS ---
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    event.currentTarget.classList.add('active');
    
    if(tabId === 'home') { backToPortal(); }
    if(tabId === 'ranking') loadLeaderboard();
    if(tabId === 'admin') loadAdmin();
}

function openModal(type) {
    document.getElementById('authModal').classList.add('active');
    if (type === 'login') {
        document.getElementById('authTitle').innerText = 'Đăng nhập';
        document.getElementById('loginForm').style.display = 'flex';
        document.getElementById('registerForm').style.display = 'none';
    } else {
        document.getElementById('authTitle').innerText = 'Đăng ký';
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'flex';
    }
}

async function fetchAPI(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (currentToken) headers['Authorization'] = `Bearer ${currentToken}`;
    const res = await fetch(`http://localhost:8080${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi');
    return data;
}

function updateUI() {
    if (currentUser) {
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('regBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'block';
        document.getElementById('userInfo').style.display = 'inline-block';
        document.getElementById('userInfo').innerText = `Chào ${currentUser.name}`;
        document.getElementById('loginPrompt').innerHTML = `Đang đăng nhập dưới tên <b>${currentUser.name}</b>. Kỷ lục của bạn: <b>${localStorage.getItem('flappy_best')||0}</b>`;
        if(currentUser.role === 'admin') document.getElementById('navAdmin').style.display = 'block';
    } else {
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('regBtn').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('navAdmin').style.display = 'none';
        document.getElementById('loginPrompt').innerText = 'Đăng nhập để lưu điểm vào Ranking.';
    }
}

try {
    if (localStorage.getItem('user')) {
        currentUser = JSON.parse(localStorage.getItem('user'));
        updateUI();
    }
} catch(e){}

fetchAPI('/api/track_view', { method: 'POST' }).catch(()=>{});
fetchAPI('/api/settings').then(data => {
    if(data.home_desc) document.getElementById('homeDescText').innerText = data.home_desc;
    if(document.getElementById('adminHomeDesc')) document.getElementById('adminHomeDesc').value = data.home_desc;
}).catch(()=>{});

function getCookie(name) { let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)')); return match ? match[2] : null; }
function setCookie(name, value, days) { let d = new Date(); d.setTime(d.getTime() + (days*24*60*60*1000)); document.cookie = name + "=" + value + ";path=/;expires=" + d.toUTCString(); }
setTimeout(() => {
    if (!getCookie('ad_closed')) {
        document.getElementById('adPopup').classList.add('active');
    }
}, 60000);
window.closeAdPopup = function() {
    document.getElementById('adPopup').classList.remove('active');
    setCookie('ad_closed', 'true', 365);
};

// --- AUTH HANDLERS ---
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
        const data = await fetchAPI('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username: e.target.loginUsername.value,
                password: e.target.loginPassword.value
            })
        });
        currentToken = data.token;
        currentUser = data.user;
        localStorage.setItem('token', currentToken);
        localStorage.setItem('user', JSON.stringify(currentUser));
        updateUI();
        document.getElementById('authModal').classList.remove('active');
        alert('Đăng nhập thành công!');
    } catch (err) { alert(err.message); }
};

document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
        await fetchAPI('/api/register', {
            method: 'POST',
            body: JSON.stringify({
                name: e.target.regName.value,
                username: e.target.regUsername.value,
                password: e.target.regPassword.value
            })
        });
        alert('Đăng ký thành công, hãy đăng nhập!');
        openModal('login');
    } catch (err) { alert(err.message); }
};

window.logout = function() {
    currentToken = null; currentUser = null;
    localStorage.removeItem('token'); localStorage.removeItem('user');
    updateUI(); alert('Đã đăng xuất');
};

// --- DATA FETCHING ---
async function loadLeaderboard() {
    try {
        const fetchRank = async (id, elId) => {
            const data = await fetchAPI('/api/leaderboard?game_id=' + id);
            const tbody = document.getElementById(elId);
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Chưa có dữ liệu</td></tr>';
            } else {
                tbody.innerHTML = data.map((p, i) => `
                    <tr>
                        <td><b>${i+1}</b></td>
                        <td>${p.name} ${currentUser && p.id === currentUser.id ? '(Bạn)' : ''}</td>
                        <td style="color:#319795; font-weight:800;">${p.score}</td>
                    </tr>
                `).join('');
            }
        };
        await Promise.all([fetchRank(1, 'leaderboard1'), fetchRank(2, 'leaderboard2')]);
    } catch (err) {}
}

window.openGameScreen = function(id) {
    window.location.href = '/?game=' + id;
}

window.backToPortal = function() {
    window.location.href = '/';
}

async function loadComments(gameId) {
    try {
        const data = await fetchAPI('/api/comments?game_id=' + gameId);
        const list = document.getElementById('commentsList');
        if (data.length === 0) { list.innerHTML = 'Chưa có bình luận nào.'; return; }
        list.innerHTML = data.map(c => `
            <div class="comment-item" style="padding: 10px; margin-bottom: 8px;">
                <div class="cmt-header">
                    <span>${c.senderName}</span>
                    <span style="font-size:12px; font-weight:normal; color:#718096">${new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="cmt-stars">${'★'.repeat(c.ratingScore)}${'☆'.repeat(5-c.ratingScore)}</div>
                <div style="font-weight:600; color:#2d3748; margin-top:5px;">${c.content}</div>
            </div>
        `).join('');
    } catch (err) {}
}

document.getElementById('commentForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
        await fetchAPI('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                game_id: currentGameId,
                name: e.target.cmtName.value,
                email: e.target.cmtEmail.value,
                rating: e.target.cmtRating.value,
                content: e.target.cmtContent.value
            })
        });
        alert('Đã gửi đánh giá!'); e.target.reset(); loadComments(currentGameId);
    } catch(err) { alert(err.message); }
};

document.getElementById('contactForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
        await fetchAPI('/api/contact', {
            method: 'POST',
            body: JSON.stringify({
                name: e.target.contactName.value,
                email: e.target.contactEmail.value,
                message: e.target.contactMessage.value
            })
        });
        alert('Đã gửi liên hệ!'); e.target.reset();
    } catch(err) {}
};

async function loadAdmin() {
    if(!currentUser || currentUser.role !== 'admin') return;
    try {
        const stats = await fetchAPI('/api/admin/stats');
        document.getElementById('statViews').innerText = stats.views;
        document.getElementById('statPlayers').innerText = stats.users;
        document.getElementById('statComments').innerText = stats.comments;
        const cmts = await fetchAPI('/api/admin/comments');
        document.getElementById('adminCommentsList').innerHTML = cmts.map(c => `
            <tr>
                <td><b>${c.senderName}</b><br><small>${c.senderEmail}</small><br><small>Game: ${c.game_id}</small></td>
                <td>${c.content}</td>
                <td><button class="btn-yellow" onclick="deleteComment(${c.id})">Xóa</button></td>
            </tr>
        `).join('');
    } catch(err) {}
}

window.updateHomeDesc = async function() {
    const val = document.getElementById('adminHomeDesc').value;
    try {
        await fetchAPI('/api/settings', { method: 'POST', body: JSON.stringify({ key: 'home_desc', val }) });
        alert('Cập nhật thành công');
        document.getElementById('homeDescText').innerText = val;
    } catch(err) { alert('Lỗi: ' + err.message); }
};

window.deleteComment = async function(id) {
    if(!confirm('Xóa đánh giá?')) return;
    try { await fetchAPI(`/api/comments/${id}`, { method: 'DELETE' }); loadAdmin(); } catch(err) {}
};

// --- GAME LOGIC ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let frames = 0, score = 0, bestScore = localStorage.getItem('flappy_best_1') || 0;
let state = 0; // 0=ready, 1=playing, 2=over
document.getElementById('bestScore').innerText = bestScore;

// Game 1: Flappy Bird
const bird = {
    x: 100, y: 150, w: 34, h: 24, speed: 0, gravity: 0.08, jump: 2.5,
    draw() {
        // Yellow bird
        ctx.fillStyle = '#ecc94b';
        ctx.beginPath();
        ctx.ellipse(this.x+this.w/2, this.y+this.h/2, this.w/2, this.h/2, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = '#2d3748'; ctx.stroke();
        
        // Eye
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(this.x+22, this.y+8, 6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#2d3748';
        ctx.beginPath(); ctx.arc(this.x+24, this.y+8, 2, 0, Math.PI*2); ctx.fill();
        
        // Beak
        ctx.fillStyle = '#dd6b20';
        ctx.beginPath(); ctx.moveTo(this.x+this.w, this.y+10); ctx.lineTo(this.x+this.w+10, this.y+14); ctx.lineTo(this.x+this.w, this.y+18); ctx.fill(); ctx.stroke();
    },
    flap() { this.speed = -this.jump; },
    update() {
        this.speed += this.gravity;
        this.y += this.speed;
        if(this.y+this.h >= canvas.height - 60) {
            this.y = canvas.height - 60 - this.h;
            if(state===1) gameOver();
        }
        if(this.y<=0) this.y=0;
    },
    reset() { this.y=150; this.speed=0; }
};

const pipes = {
    items: [], w: 60, gap: 160, dx: 1.5,
    draw() {
        for(let i=0; i<this.items.length; i++) {
            let p = this.items[i];
            ctx.fillStyle = '#48bb78';
            ctx.fillRect(p.x, 0, this.w, p.top);
            ctx.strokeRect(p.x, 0, this.w, p.top);
            ctx.fillRect(p.x, p.top+this.gap, this.w, canvas.height-p.top-this.gap-60);
            ctx.strokeRect(p.x, p.top+this.gap, this.w, canvas.height-p.top-this.gap-60);
        }
    },
    update() {
        if(frames % 120 === 0) {
            this.items.push({ x: canvas.width, top: Math.random()*(canvas.height-this.gap-150)+30, passed: false });
        }
        for(let i=0; i<this.items.length; i++) {
            let p = this.items[i];
            // Collision
            if(bird.x+bird.w > p.x && bird.x < p.x+this.w && (bird.y < p.top || bird.y+bird.h > p.top+this.gap)) gameOver();
            p.x -= this.dx;
            if(p.x+this.w < bird.x && !p.passed) {
                score++; p.passed = true;
                document.getElementById('currentScore').innerText = score;
                document.getElementById('displayScore').innerText = score;
            }
            if(p.x+this.w < 0) { this.items.shift(); i--; }
        }
    },
    reset() { this.items = []; }
};

// Game 2: Aim Trainer
const aimTrainer = {
    x: 400, y: 250, r: 45, timer: 900,
    draw() {
        if(state!==1) return;
        ctx.fillStyle = '#e53e3e';
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fill();
        ctx.lineWidth = 3; ctx.strokeStyle = '#2d3748'; ctx.stroke();
        
        ctx.fillStyle = '#2d3748'; ctx.font = '24px Arial'; ctx.fontWeight = 'bold';
        ctx.fillText(`Thời gian: ${Math.ceil(this.timer/60)}s`, 20, 40);
    },
    update() {
        this.timer--;
        if(this.timer <= 0) gameOver();
    },
    click(cx, cy) {
        let dx = cx - this.x, dy = cy - this.y;
        if (Math.sqrt(dx*dx + dy*dy) <= this.r) {
            score++;
            this.timer += 60; // Thưởng thêm 1 giây khi bắn trúng
            document.getElementById('currentScore').innerText = score;
            document.getElementById('displayScore').innerText = score;
            this.x = Math.random() * (canvas.width - 60) + 30;
            this.y = Math.random() * (canvas.height - 120) + 30;
        }
    },
    reset() { this.timer = 900; this.x = 400; this.y = 250; }
};

function drawBg() {
    ctx.fillStyle = '#a0aec0';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if (currentGameId === 1) {
        ctx.fillStyle = '#68d391';
        ctx.beginPath(); ctx.moveTo(0, canvas.height-60); ctx.lineTo(250, canvas.height-300); ctx.lineTo(500, canvas.height-60); ctx.fill();
        ctx.fillStyle = '#48bb78';
        ctx.beginPath(); ctx.moveTo(300, canvas.height-60); ctx.lineTo(550, canvas.height-250); ctx.lineTo(850, canvas.height-60); ctx.fill();
    }
    ctx.fillStyle = '#d69e2e';
    ctx.fillRect(0, canvas.height-60, canvas.width, 60);
    ctx.lineWidth = 3; ctx.strokeStyle = '#2d3748';
    ctx.beginPath(); ctx.moveTo(0, canvas.height-60); ctx.lineTo(canvas.width, canvas.height-60); ctx.stroke();
}

function loop() {
    drawBg();
    if (currentGameId === 1) {
        pipes.draw();
        bird.draw();
        if(state===1) { bird.update(); pipes.update(); frames++; }
    } else {
        aimTrainer.draw();
        if(state===1) { aimTrainer.update(); frames++; }
    }
    requestAnimationFrame(loop);
}
loop();

function action(e) {
    if(e && e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
    if(e && e.type==='keydown' && e.code!=='Space') return;
    if(e && state!==0 && currentGameId === 1) e.preventDefault();
    if(state===0) { startGame(); }
    else if(state===1) { 
        if (currentGameId === 1) {
            bird.flap();
        } else if (e.type === 'mousedown') {
            const rect = canvas.getBoundingClientRect();
            aimTrainer.click(e.clientX - rect.left, e.clientY - rect.top);
        }
    }
}
window.startGame = function() {
    state=1;
    document.getElementById('startScreen').style.display = 'none';
    if(currentGameId === 1) bird.flap();
};
window.restartGame = function() {
    if(currentGameId===1){ bird.reset(); pipes.reset(); } else { aimTrainer.reset(); }
    score=0; frames=0;
    document.getElementById('currentScore').innerText = '0';
    document.getElementById('displayScore').innerText = '0';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    state=0;
};
canvas.addEventListener('mousedown', action);
document.addEventListener('keydown', action);

async function gameOver() {
    state=2;
    let bScore = localStorage.getItem('flappy_best_' + currentGameId) || 0;
    if(score > bScore) {
        bScore = score;
        localStorage.setItem('flappy_best_' + currentGameId, bScore);
        document.getElementById('bestScore').innerText = bScore;
    }
    document.getElementById('finalScoreDisplay').innerText = score;
    document.getElementById('gameOverScreen').style.display = 'flex';
    
    let msg = document.getElementById('rankMessage');
    if(!currentUser) { msg.innerText = 'Đăng nhập để lưu điểm'; return; }
    try {
        msg.innerText = 'Đang lưu điểm...';
        const res = await fetchAPI('/api/scores', { method: 'POST', body: JSON.stringify({ score, game_id: currentGameId }) });
        msg.innerText = `Lưu điểm thành công!`;
        document.getElementById('displayRank').innerText = res.rank;
    } catch(err) { msg.innerText = 'Lỗi lưu điểm'; }
}

// Router: Kiểm tra tham số URL để load đúng trang chi tiết
const urlParams = new URLSearchParams(window.location.search);
const gameParam = urlParams.get('game');
if (gameParam) {
    const id = parseInt(gameParam);
    if (id === 1 || id === 2) {
        currentGameId = id;
        document.getElementById('portal-view').style.display = 'none';
        document.getElementById('play-view').style.display = 'block';
        document.getElementById('playGameTitle').innerText = id === 1 ? 'Flappy Bird' : 'Aim Trainer';
        document.getElementById('bestScore').innerText = localStorage.getItem('flappy_best_' + currentGameId) || 0;
        loadComments(id);
        setTimeout(() => window.restartGame(), 50);
    }
}
