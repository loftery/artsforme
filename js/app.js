// ============================================
// ХРАНИЛИЩЕ (IndexedDB + LocalStorage)
// ============================================
const DB_NAME = 'ArtistPathDB';
let db = null;

function initDB(){
  return new Promise((res, rej)=>{
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e=>{
      const d = e.target.result;
      if(!d.objectStoreNames.contains('images')) d.createObjectStore('images', {keyPath:'id'});
    };
    req.onsuccess = e=>{ db = e.target.result; res(); };
    req.onerror = rej;
  });
}
function dbPut(x){return new Promise((res,rej)=>{const t=db.transaction('images','readwrite');t.objectStore('images').put(x);t.oncomplete=res;t.onerror=rej;});}
function dbGet(id){return new Promise((res,rej)=>{const t=db.transaction('images','readonly');const r=t.objectStore('images').get(id);r.onsuccess=()=>res(r.result);r.onerror=rej;});}
function dbDel(id){return new Promise((res,rej)=>{const t=db.transaction('images','readwrite');t.objectStore('images').delete(id);t.oncomplete=res;t.onerror=rej;});}
function dbAll(){return new Promise((res,rej)=>{const t=db.transaction('images','readonly');const r=t.objectStore('images').getAll();r.onsuccess=()=>res(r.result);r.onerror=rej;});}

const store = {
  get(key, def){ try{ return JSON.parse(localStorage.getItem('ap_'+key)) ?? def; }catch{ return def; } },
  set(key, val){ localStorage.setItem('ap_'+key, JSON.stringify(val)); }
};

// ============================================
// РАНГИ И ДОСТИЖЕНИЯ
// ============================================
const RANKS = [
  { minXP: 0, title: "Новичок", icon: "🌱" },
  { minXP: 50, title: "Ученик", icon: "✏️" },
  { minXP: 150, title: "Начинающий", icon: "🎨" },
  { minXP: 300, title: "Практик", icon: "🖌️" },
  { minXP: 500, title: "Художник", icon: "🖼️" },
  { minXP: 800, title: "Мастер", icon: "🏆" },
  { minXP: 1200, title: "Гуру", icon: "🔥" },
  { minXP: 2000, title: "Легенда", icon: "👑" }
];

const ACHIEVEMENTS = [
  { id: "first_draw", title: "Первый шаг", desc: "Загрузи свой первый рисунок", icon: "🌟", check: (s) => s.meta.length >= 1 },
  { id: "ten_draw", title: "Коллекционер", desc: "Загрузи 10 рисунков", icon: "📚", check: (s) => s.meta.length >= 10 },
  { id: "first_lesson", title: "В учении — свет", desc: "Пройди первый урок", icon: "💡", check: (s) => Object.keys(s.progress).length >= 1 },
  { id: "five_lessons", title: "Способный", desc: "Пройди 5 уроков", icon: "🧠", check: (s) => Object.keys(s.progress).length >= 5 },
  { id: "streak_3", title: "В ударе", desc: "Занимайся 3 дня подряд", icon: "🔥", check: (s) => s.streak.count >= 3 },
  { id: "streak_7", title: "Марафонец", desc: "Занимайся 7 дней подряд", icon: "🚀", check: (s) => s.streak.count >= 7 }
];

const state = {
  progress: store.get('progress', {}),
  tasks: store.get('tasks', {}),
  streak: store.get('streak', {last:null, count:0}),
  xp: store.get('xp', 0),
  meta: store.get('meta', []),
  unlockedAch: store.get('achievements', []),
  theme: localStorage.getItem('artist_theme') || 'default'
};

function saveState() {
  store.set('progress', state.progress);
  store.set('tasks', state.tasks);
  store.set('streak', state.streak);
  store.set('xp', state.xp);
  store.set('meta', state.meta);
  store.set('achievements', state.unlockedAch);
}

function checkAchievements() {
  let newUnlocked = false;
  ACHIEVEMENTS.forEach(ach => {
    if (!state.unlockedAch.includes(ach.id) && ach.check(state)) {
      state.unlockedAch.push(ach.id);
      newUnlocked = true;
      showToast(`🏆 Награда: ${ach.title}!`);
    }
  });
  if (newUnlocked) saveState();
}

function getRankInfo() {
  let current = RANKS[0];
  let next = RANKS[1];
  for (let i = 0; i < RANKS.length; i++) {
    if (state.xp >= RANKS[i].minXP) {
      current = RANKS[i];
      next = RANKS[i + 1] || null;
    }
  }
  let percent = 100;
  if (next) {
    const range = next.minXP - current.minXP;
    const currentProgress = state.xp - current.minXP;
    percent = Math.min(100, Math.round((currentProgress / range) * 100));
  }
  return { current, next, percent };
}

// ============================================
// ЛОГИКА XP И ДЕЙСТВИЙ
// ============================================
function addXP(amount, reason){
  state.xp += amount;
  saveState();
  updateStreak();
  checkAchievements();
  showToast(`+${amount} XP — ${reason}`);
}

function updateStreak(){
  const today = new Date().toDateString();
  const s = state.streak;
  if(s.last === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if(s.last === yesterday) s.count++;
  else s.count = 1;
  s.last = today;
  saveState();
  checkAchievements();
}

function toggleLesson(id){
  if(state.progress[id]) delete state.progress[id];
  else { state.progress[id] = true; addXP(10, 'урок пройден'); }
  saveState();
  checkAchievements();
}

function toggleTask(id){
  if(state.tasks[id] === 'done'){
    delete state.tasks[id];
    state.xp = Math.max(0, state.xp - 5);
  } else {
    state.tasks[id] = 'done';
    addXP(5, 'задача выполнена');
  }
  saveState();
  checkAchievements();
}

function addGalleryItem(item) {
  state.meta.push(item);
  addXP(15, 'рисунок загружен');
  saveState();
  checkAchievements();
}

function delGalleryItem(id) {
  state.meta = state.meta.filter(x => x.id !== id);
  saveState();
}

// ============================================
// UI УТИЛИТЫ
// ============================================
function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){ t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._to);
  t._to = setTimeout(()=>t.classList.remove('show'), 2500);
}

function formatDate(ts){ return new Date(ts).toLocaleDateString('ru-RU', {day:'2-digit', month:'short'}); }
const CAT_LABEL = {hand:'От руки', ibis:'Ibis', krita:'Krita'};

function initTheme(){
  if(window.APP_THEMES) window.APP_THEMES.applyTheme(state.theme);
}

async function boot(){
  await initDB();
  initTheme();
  checkAchievements();
  if(typeof onReady === 'function') onReady();
}

window.APP = {
  state, boot, addXP, toggleLesson, toggleTask,
  dbPut, dbGet, dbDel, dbAll, store,
  showToast, formatDate, CAT_LABEL, saveState,
  addGalleryItem, delGalleryItem, getRankInfo, RANKS, ACHIEVEMENTS
};
