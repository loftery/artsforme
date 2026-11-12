const DB_NAME = 'ArtistPathDB';
const DB_VERSION = 1;
let db = null;

function initDB(){
  return new Promise((res, rej)=>{
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e=>{
      const d = e.target.result;
      if(!d.objectStoreNames.contains('images'))
        d.createObjectStore('images', {keyPath:'id'});
    };
    req.onsuccess = e=>{ db = e.target.result; res(); };
    req.onerror = rej;
  });
}
function dbPut(x){return new Promise((res,rej)=>{const t=db.transaction('images','readwrite');t.objectStore('images').put(x);t.oncomplete=res;t.onerror=rej;});}
function dbGet(id){return new Promise((res,rej)=>{const t=db.transaction('images','readonly');const r=t.objectStore('images').get(id);r.onsuccess=()=>res(r.result);r.onerror=rej;});}
function dbDel(id){return new Promise((res,rej)=>{const t=db.transaction('images','readwrite');t.objectStore('images').delete(id);t.oncomplete=res;t.onerror=rej;});}

const store = {
  get(key, def){ try{ return JSON.parse(localStorage.getItem('ap_'+key)) ?? def; }catch{ return def; } },
  set(key, val){ localStorage.setItem('ap_'+key, JSON.stringify(val)); }
};

const state = {
  progress: store.get('progress', {}),
  tasks: store.get('tasks', {}),
  streak: store.get('streak', {last:null, count:0}),
  xp: store.get('xp', 0),
  theme: localStorage.getItem('artist_theme') || 'default'
};

function saveProgress(){ store.set('progress', state.progress); }
function saveTasks(){ store.set('tasks', state.tasks); }
function saveStreak(){ store.set('streak', state.streak); }
function saveXP(){ store.set('xp', state.xp); }

function addXP(amount, reason){
  state.xp += amount;
  saveXP();
  updateStreak();
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
  saveStreak();
}

function calcLevel(){
  const done = Object.keys(state.progress).length;
  const total = window.APP_DATA.PROGRAM.reduce((s,l)=>s+l.lessons.length,0);
  return { done, total, percent: total ? Math.round(done/total*100) : 0 };
}

function isLessonDone(id){ return !!state.progress[id]; }
function toggleLesson(id){
  if(state.progress[id]) delete state.progress[id];
  else { state.progress[id] = true; addXP(10, 'урок пройден'); }
  saveProgress();
}

function isTaskDone(id){ return state.tasks[id] === 'done'; }
function toggleTask(id){
  if(state.tasks[id] === 'done'){
    delete state.tasks[id];
    state.xp = Math.max(0, state.xp - 5);
    saveXP();
  } else {
    state.tasks[id] = 'done';
    addXP(5, 'задача выполнена');
  }
  saveTasks();
}

function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._to);
  t._to = setTimeout(()=>t.classList.remove('show'), 2200);
}

function formatDate(ts){
  return new Date(ts).toLocaleDateString('ru-RU', {day:'2-digit', month:'short'});
}

const CAT_LABEL = {hand:'От руки', ibis:'Ibis Paint', krita:'Krita'};

function initTheme(){
  if(window.APP_THEMES) window.APP_THEMES.applyTheme(state.theme);
}

async function boot(){
  await initDB();
  initTheme();
  if(typeof onReady === 'function') onReady();
}

window.APP = {
  state, boot, addXP, toggleLesson, toggleTask,
  isLessonDone, isTaskDone, calcLevel,
  dbPut, dbGet, dbDel, store,
  showToast, formatDate, CAT_LABEL, saveProgress, saveTasks
};
