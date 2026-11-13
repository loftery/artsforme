// ============================================
// ХРАНИЛИЩЕ (ЛОКАЛЬНОЕ)
// ============================================
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
function dbAll(){return new Promise((res,rej)=>{const t=db.transaction('images','readonly');const r=t.objectStore('images').getAll();r.onsuccess=()=>res(r.result);r.onerror=rej;});}

const store = {
  get(key, def){ try{ return JSON.parse(localStorage.getItem('ap_'+key)) ?? def; }catch{ return def; } },
  set(key, val){ localStorage.setItem('ap_'+key, JSON.stringify(val)); }
};

// ============================================
// SUPABASE (ОБЛАКО)
// ============================================
let supabase = null;
const currentUserId = 'local_user'; 

async function initSupabase() {
  const cfg = store.get('supabase', null);
  if (cfg && cfg.url && cfg.key && window.supabase) {
    try {
      supabase = window.supabase.createClient(cfg.url, cfg.key);
      const { error } = await supabase.from('profile').select('count', { count: 'exact', head: true }).limit(1);
      if (error && error.code !== 'PGRST116') {
         console.error('Ошибка подключения к Supabase:', error);
      } else {
         await pullFromCloud();
      }
    } catch (e) {
      console.error('Ошибка инициализации Supabase', e);
    }
  }
}

// ============================================
// СОСТОЯНИЕ
// ============================================
const state = {
  progress: store.get('progress', {}),
  tasks: store.get('tasks', {}),
  streak: store.get('streak', {last:null, count:0}),
  xp: store.get('xp', 0),
  theme: localStorage.getItem('artist_theme') || 'default'
};

function saveProgress(){ store.set('progress', state.progress); pushToCloud(); }
function saveTasks(){ store.set('tasks', state.tasks); pushToCloud(); }
function saveStreak(){ store.set('streak', state.streak); pushToCloud(); }
function saveXP(){ store.set('xp', state.xp); pushToCloud(); }

// ============================================
// СИНХРОНИЗАЦИЯ
// ============================================
async function pushToCloud() {
  if (!supabase) return;
  try {
    await supabase.from('profile').upsert({
      user_id: currentUserId, xp: state.xp,
      streak_count: state.streak.count, streak_last: state.streak.last
    }, { onConflict: 'user_id' });

    const progArray = Object.keys(state.progress).map(id => ({
      user_id: currentUserId, lesson_id: id, done: true
    }));
    if (progArray.length > 0) await supabase.from('progress').upsert(progArray, { onConflict: 'user_id,lesson_id' });

    const tasksArray = Object.keys(state.tasks).map(id => ({
      user_id: currentUserId, task_id: id, status: state.tasks[id]
    }));
    if (tasksArray.length > 0) await supabase.from('tasks').upsert(tasksArray, { onConflict: 'user_id,task_id' });

    const meta = store.get('meta', []);
    const galleryArray = meta.map(m => ({
      id: m.id, user_id: currentUserId, title: m.title, cat: m.cat, lesson: m.lesson, notes: m.notes, created: m.created
    }));
    if (galleryArray.length > 0) await supabase.from('gallery_meta').upsert(galleryArray, { onConflict: 'id' });
  } catch (e) {
    console.warn('Не удалось отправить данные', e);
  }
}

async function pullFromCloud() {
  if (!supabase) return;
  try {
    const { data: prof } = await supabase.from('profile').select('*').eq('user_id', currentUserId).single();
    if (prof) {
      state.xp = prof.xp || 0;
      state.streak = { count: prof.streak_count || 0, last: prof.streak_last };
    }
    const { data: progs } = await supabase.from('progress').select('*').eq('user_id', currentUserId);
    if (progs) { state.progress = {}; progs.forEach(p => { if (p.done) state.progress[p.lesson_id] = true; }); }

    const { data: tsks } = await supabase.from('tasks').select('*').eq('user_id', currentUserId);
    if (tsks) { state.tasks = {}; tsks.forEach(t => { state.tasks[t.task_id] = t.status; }); }

    const { data: gal } = await supabase.from('gallery_meta').select('*').eq('user_id', currentUserId);
    if (gal) {
      const localMeta = store.get('meta', []);
      const cloudMeta = gal.map(g => ({ id: g.id, title: g.title, cat: g.cat, lesson: g.lesson, notes: g.notes, created: g.created }));
      const merged = [...cloudMeta];
      localMeta.forEach(lm => { if (!merged.find(cm => cm.id === lm.id)) merged.push(lm); });
      store.set('meta', merged);
    }
    store.set('progress', state.progress);
    store.set('tasks', state.tasks);
    store.set('xp', state.xp);
    store.set('streak', state.streak);
  } catch (e) {
    console.warn('Не удалось загрузить данные', e);
  }
}

async function uploadImageToCloud(fileId, dataUrl) {
  if (!supabase) return null; 
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const { error } = await supabase.storage.from('artworks').upload(`${fileId}.jpg`, blob, { contentType: 'image/jpeg', upsert: true });
    if (error) return null;
    const { data: publicUrlData } = supabase.storage.from('artworks').getPublicUrl(`${fileId}.jpg`);
    return publicUrlData.publicUrl;
  } catch (e) { return null; }
}

// ============================================
// XP и STREAK
// ============================================
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

// ============================================
// ПРОГРЕСС
// ============================================
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

// ============================================
// UI УТИЛИТЫ
// ============================================
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

const CAT_LABEL = {hand:'От руки', ibis:'Ibis', krita:'Krita'};

function initTheme(){
  if(window.APP_THEMES) window.APP_THEMES.applyTheme(state.theme);
}

// ============================================
// СТАРТ
// ============================================
async function boot(){
  await initDB();
  initTheme();
  
  // ВОТ ОНА, РОДНАЯ! Вызываем инициализацию страницы.
  if(typeof onReady === 'function') {
    onReady();
  }
  
  // Потом запускаем облако
  await initSupabase();
}

window.APP = {
  state, boot, addXP, toggleLesson, toggleTask,
  isLessonDone, isTaskDone, calcLevel,
  dbPut, dbGet, dbDel, dbAll, store,
  showToast, formatDate, CAT_LABEL, saveProgress, saveTasks,
  pushToCloud, uploadImageToCloud
};
