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

const RANKS = [
  { minXP: 0, title: "Новичок", icon: "◇" },
  { minXP: 50, title: "Ученик", icon: "✎" },
  { minXP: 150, title: "Начинающий", icon: "◈" },
  { minXP: 300, title: "Практик", icon: "⌁" },
  { minXP: 500, title: "Художник", icon: "▧" },
  { minXP: 800, title: "Мастер", icon: "✧" },
  { minXP: 1200, title: "Гуру", icon: "◆" },
  { minXP: 2000, title: "Легенда", icon: "♛" }
];

const ACHIEVEMENTS = [
  { id: "first_draw", title: "Первый шаг", desc: "Загрузи свой первый рисунок", icon: "✦", check: (s) => s.meta.length >= 1 },
  { id: "ten_draw", title: "Коллекционер", desc: "Загрузи 10 рисунков", icon: "▤", check: (s) => s.meta.length >= 10 },
  { id: "first_lesson", title: "В учении — свет", desc: "Пройди первый урок", icon: "◉", check: (s) => Object.keys(s.progress).length >= 1 },
  { id: "five_lessons", title: "Способный", desc: "Пройди 5 уроков", icon: "◎", check: (s) => Object.keys(s.progress).length >= 5 },
  { id: "streak_3", title: "В ударе", desc: "Занимайся 3 дня подряд", icon: "◆", check: (s) => s.streak.count >= 3 },
  { id: "streak_7", title: "Марафонец", desc: "Занимайся 7 дней подряд", icon: "➤", check: (s) => s.streak.count >= 7 },
  { id: "full_course", title: "Путь пройден", desc: "Заверши все 20 уроков курса", icon: "◆", check: (s) => Object.keys(s.progress).length >= 20 },
  { id: "first_task", title: "От теории к делу", desc: "Выполни своё первое задание", icon: "✎", check: (s) => Object.values(s.tasks).filter(v => v === "done").length >= 1 },
  { id: "ten_tasks", title: "Практика решает", desc: "Выполни 10 заданий", icon: "▧", check: (s) => Object.values(s.tasks).filter(v => v === "done").length >= 10 },
  { id: "five_drawings", title: "Мини-галерея", desc: "Сохрани 5 своих рисунков", icon: "▤", check: (s) => s.meta.length >= 5 },
  { id: "first_stage", title: "Первая ступень", desc: "Заверши все уроки первого раздела", icon: "◈", check: (s) => ["1-1","1-2","1-3","1-4"].every(id => !!s.progress[id]) }
];

const state = {
  progress: store.get('progress', {}),
  tasks: store.get('tasks', {}),
  streak: store.get('streak', {last:null, count:0}),
  xp: store.get('xp', 0),
  meta: store.get('meta', []),
  unlockedAch: store.get('achievements', []),
  xpLessonRewards: store.get('xpLessonRewards', Object.keys(store.get('progress', {}))),
  xpTaskRewards: store.get('xpTaskRewards', Object.keys(store.get('tasks', {})).filter(id => store.get('tasks', {})[id] === 'done')),
  theme: localStorage.getItem('artist_theme') || 'default'
};

function saveState() {
  store.set('progress', state.progress);
  store.set('tasks', state.tasks);
  store.set('streak', state.streak);
  store.set('xp', state.xp);
  store.set('meta', state.meta);
  store.set('achievements', state.unlockedAch);
  store.set('xpLessonRewards', state.xpLessonRewards);
  store.set('xpTaskRewards', state.xpTaskRewards);
}

function checkAchievements() {
  const newlyUnlocked = [];
  ACHIEVEMENTS.forEach(ach => {
    if (!state.unlockedAch.includes(ach.id) && ach.check(state)) {
      state.unlockedAch.push(ach.id);
      newlyUnlocked.push(ach.title);
    }
  });
  if (newlyUnlocked.length) {
    saveState();
    showToast(newlyUnlocked.length === 1
      ? `Награда получена: ${newlyUnlocked[0]}`
      : `Получено достижений: ${newlyUnlocked.length}`);
  }
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

function isLessonDone(id) { return !!state.progress[id]; }
function isTaskDone(id) { return state.tasks[id] === 'done'; }

function calcLevel(){
  const done = Object.keys(state.progress).length;
  const total = window.APP_DATA ? window.APP_DATA.PROGRAM.reduce((s,l)=>s+l.lessons.length,0) : 20;
  return { done, total, percent: total ? Math.round(done/total*100) : 0 };
}

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
  if(state.progress[id]) {
    delete state.progress[id];
  } else {
    state.progress[id] = true;
    if(!state.xpLessonRewards.includes(id)) {
      state.xpLessonRewards.push(id);
      addXP(10, 'урок пройден');
    }
  }
  saveState();
  checkAchievements();
}

function toggleTask(id){
  if(state.tasks[id] === 'done'){
    delete state.tasks[id];
  } else {
    state.tasks[id] = 'done';
    if(!state.xpTaskRewards.includes(id)) {
      state.xpTaskRewards.push(id);
      addXP(5, 'задача выполнена');
    }
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
  state, boot, addXP, toggleLesson, toggleTask, calcLevel,
  isLessonDone, isTaskDone,
  dbPut, dbGet, dbDel, dbAll, store,
  showToast, formatDate, CAT_LABEL, saveState,
  addGalleryItem, delGalleryItem, getRankInfo, RANKS, ACHIEVEMENTS
};
