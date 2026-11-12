// ============================================
// ДАННЫЕ: УРОВНИ, УРОКИ, ЗАДАЧИ, СТИЛИ, ИДЕИ
// ============================================

const PROGRAM = [
  {
    id: 1, title: "Форма и объём",
    desc: "Кубы, цилиндры, сферы. Основа всего.",
    lessons: [
      { id:"1-1", title:"Куб в перспективе", games:["Roblox"], tasks:["task-1-1-a","task-1-1-b"] },
      { id:"1-2", title:"Цилиндр и сфера", games:["Doors","Roblox"], tasks:["task-1-2-a"] },
      { id:"1-3", title:"Фигура из кубов", games:["Roblox","Doors"], tasks:["task-1-3-a"] },
      { id:"1-4", title:"Сложная конструкция", games:["Pressure","Doors"], tasks:["task-1-4-a"] }
    ]
  },
  {
    id: 2, title: "Свет и тень",
    desc: "Почему персонажи выглядят мёртвыми.",
    lessons: [
      { id:"2-1", title:"Блик и полутень", games:["Hollow Knight"], tasks:["task-2-1-a"] },
      { id:"2-2", title:"Собственная и падающая тень", games:["Ultrakill","Hollow Knight"], tasks:["task-2-2-a"] },
      { id:"2-3", title:"Холодное и тёплое", games:["Ultrakill"], tasks:["task-2-3-a"] },
      { id:"2-4", title:"Свет на персонаже", games:["Hollow Knight","Silksong"], tasks:["task-2-4-a"] }
    ]
  },
  {
    id: 3, title: "Материалы",
    desc: "Текстура поверх формы и света.",
    lessons: [
      { id:"3-1", title:"Металл", games:["Ultrakill"], tasks:["task-3-1-a"] },
      { id:"3-2", title:"Ткань и складки", games:["Hollow Knight","Silksong"], tasks:["task-3-2-a"] },
      { id:"3-3", title:"Пиксель-арт", games:["Undertale","OneShot"], tasks:["task-3-3-a"] },
      { id:"3-4", title:"Смешанный материал", games:["Deltarune"], tasks:["task-3-4-a"] }
    ]
  },
  {
    id: 4, title: "Поза и динамика",
    desc: "Убираем застывшесть.",
    lessons: [
      { id:"4-1", title:"Линия действия", games:["Hollow Knight","Ultrakill"], tasks:["task-4-1-a"] },
      { id:"4-2", title:"Вес и баланс", games:["Pressure","Doors"], tasks:["task-4-2-a"] },
      { id:"4-3", title:"Напряжение", games:["Pressure","Doors"], tasks:["task-4-3-a"] },
      { id:"4-4", title:"Динамичная поза", games:["Ultrakill","Silksong"], tasks:["task-4-4-a"] }
    ]
  },
  {
    id: 5, title: "Стиль и персонажи",
    desc: "Почему персонажи читаются с 5 пикселей.",
    lessons: [
      { id:"5-1", title:"Силуэт", games:["Hollow Knight","OneShot"], tasks:["task-5-1-a"] },
      { id:"5-2", title:"Иерархия деталей", games:["Silksong","Deltarune"], tasks:["task-5-2-a"] },
      { id:"5-3", title:"Цветовой характер", games:["Undertale","Deltarune"], tasks:["task-5-3-a"] },
      { id:"5-4", title:"Свой персонаж", games:["Все"], tasks:["task-5-4-a"] }
    ]
  }
];

// Учебные задачи
const LESSON_TASKS = {
  "task-1-1-a": { title:"3 куба под разными углами", desc:"С точкой схода, не на глаз. Дальние рёбра короче.", difficulty:"low", lesson:"1-1" },
  "task-1-1-b": { title:"Куб с невидимыми рёбрами", desc:"Наметь дальние грани пунктиром.", difficulty:"low", lesson:"1-1" },
  "task-1-2-a": { title:"3 цилиндра + 3 сферы", desc:"Эллипсы не как блин. Нижний эллипс шире верхнего.", difficulty:"low", lesson:"1-2" },
  "task-1-3-a": { title:"3 роблокс-персонажа", desc:"Стоит, рука поднята, ноги на ширине плеч. Без лица.", difficulty:"medium", lesson:"1-3" },
  "task-1-4-a": { title:"2 эскиза монстров", desc:"Rush или Seek. Подпиши, из какой простой формы состоит.", difficulty:"medium", lesson:"1-4" },
  "task-2-1-a": { title:"3 сферы с одним светом", desc:"Блик, полутень, тень. Без чёрного.", difficulty:"medium", lesson:"2-1" },
  "task-2-2-a": { title:"Шар на столе", desc:"Точка контакта — самая тёмная. Падающая тень темнее собственной.", difficulty:"medium", lesson:"2-2" },
  "task-2-3-a": { title:"3 металлических предмета", desc:"Резкий блик + тёмная зона + тёплый рефлекс.", difficulty:"high", lesson:"2-3" },
  "task-2-4-a": { title:"Рыцарь или Хорнет со светом", desc:"Свет сверху слева. Согласованно на всех частях.", difficulty:"high", lesson:"2-4" },
  "task-3-1-a": { title:"Металл: ложка, шар, наплечник", desc:"Блик маленький и яркий, вокруг тёмное.", difficulty:"high", lesson:"3-1" },
  "task-3-2-a": { title:"3 позы с 3 складками", desc:"Зигзаг, не прямая. Разной длины.", difficulty:"high", lesson:"3-2" },
  "task-3-3-a": { title:"Спрайт 32×32", desc:"1 пиксель = 1 клетка. Без сглаживания.", difficulty:"medium", lesson:"3-3" },
  "task-3-4-a": { title:"Персонаж с 2 материалами", desc:"Подпиши, где кожа, ткань или металл.", difficulty:"high", lesson:"3-4" },
  "task-4-1-a": { title:"5 поз с линией действия", desc:"Сначала кривая, потом тело.", difficulty:"medium", lesson:"4-1" },
  "task-4-2-a": { title:"3 позы: баланс", desc:"На одной ноге, наклон, опора на стену.", difficulty:"medium", lesson:"4-2" },
  "task-4-3-a": { title:"3 персонажа в напряжении", desc:"Плечи вверх, голова вжата. Без крови.", difficulty:"high", lesson:"4-3" },
  "task-4-4-a": { title:"3 динамичные позы", desc:"Прыжок, удар, бег. Не симметрично.", difficulty:"high", lesson:"4-4" },
  "task-5-1-a": { title:"5 силуэтов", desc:"Закрась чёрным. Узнаётся?", difficulty:"medium", lesson:"5-1" },
  "task-5-2-a": { title:"3 персонажа с иерархией", desc:"Главная деталь → второстепенные.", difficulty:"high", lesson:"5-2" },
  "task-5-3-a": { title:"3 персонажа, 3-4 цвета", desc:"Подпиши, что цвет говорит о характере.", difficulty:"medium", lesson:"5-3" },
  "task-5-4-a": { title:"Свой персонаж: 3 этапа", desc:"Конструкция → свет → финал.", difficulty:"high", lesson:"5-4" }
};

// Стили
const STYLES = [
  { id:"realism", title:"Реализм", desc:"Точные пропорции, свет, тени. База для всего.", games:["—"], tips:"Начинай с формы, не с деталей." },
  { id:"sketch", title:"Скетч", desc:"Быстрые линии, штриховка. Ловит движение, а не детали.", games:["Hollow Knight"], tips:"30 секунд на позу. Не исправляй." },
  { id:"comic", title:"Комикс", desc:"Толстый контур, штриховка, динамика.", games:["Ultrakill","Pressure"], tips:"Контур должен читаться без цвета." },
  { id:"cartoon", title:"Мультяшный", desc:"Упрощённые формы, яркие цвета.", games:["Roblox","Deltarune"], tips:"Форма важнее текстуры." },
  { id:"pixel", title:"Пиксель-арт", desc:"Сетка, ограниченная палитра. 1 пиксель = 1 клетка.", games:["Undertale","OneShot","Deltarune"], tips:"Никакого сглаживания." },
  { id:"anime", title:"Аниме", desc:"Большие глаза, линии, тени.", games:["Silksong"], tips:"Глаза — главное. Но форма головы важнее." },
  { id:"minimal", title:"Минимализм", desc:"Мало деталей, сила силуэта.", games:["OneShot","Hollow Knight"], tips:"Убери всё, что можно убрать." },
  { id:"gothic", title:"Готика", desc:"Мрачно, изящно, контраст.", games:["Hollow Knight","Silksong"], tips:"Тонкие линии, тёмные тени." },
  { id:"grunge", title:"Гранж", desc:"Грязно, жёстко, текстуры.", games:["Ultrakill","Pressure"], tips:"Не бойся грязи. Царапины — часть стиля." },
  { id:"flat", title:"Плоский", desc:"Без объёма, чистые цвета.", games:["Roblox","Deltarune"], tips:"Никаких градиентов. Только чистый цвет." }
];

// Творческие задачи (идеи)
const CREATIVE_TASKS = [
  // Roblox
  { id:"c-roblox-1", game:"Roblox", style:"minimal", title:"Роблокс-персонаж в минимализме", desc:"Только силуэт и 2 цвета. Никаких деталей.", difficulty:"low" },
  { id:"c-roblox-2", game:"Roblox", style:"flat", title:"Свой скин в плоском стиле", desc:"Чистые цвета, без объёма.", difficulty:"low" },
  { id:"c-roblox-3", game:"Roblox", style:"comic", title:"Роблокс в комиксе", desc:"Толстый контур, динамика.", difficulty:"medium" },
  // Doors
  { id:"c-doors-1", game:"Doors", style:"grunge", title:"Rush в гранже", desc:"Жёсткие линии, грязь, царапины.", difficulty:"medium" },
  { id:"c-doors-2", game:"Doors", style:"comic", title:"Сцена погони: 3 кадра", desc:"Комикс. Что происходит между кадрами?", difficulty:"high" },
  { id:"c-doors-3", game:"Doors", style:"gothic", title:"Seek в готике", desc:"Изящная текучая форма. Тонкие линии.", difficulty:"medium" },
  // Pressure
  { id:"c-pressure-1", game:"Pressure", style:"sketch", title:"Монстр за 30 секунд", desc:"Только поза. Никаких деталей.", difficulty:"low" },
  { id:"c-pressure-2", game:"Pressure", style:"comic", title:"Сцена напряжения", desc:"Плечи вверх, голова вжата. 2-3 кадра.", difficulty:"high" },
  { id:"c-pressure-3", game:"Pressure", style:"grunge", title:"Оружие в гранже", desc:"Текстура, царапины, следы использования.", difficulty:"medium" },
  // Hollow Knight
  { id:"c-hk-1", game:"Hollow Knight", style:"minimal", title:"Рыцарь: силуэт + 1 цвет", desc:"Узнаётся без деталей?", difficulty:"medium" },
  { id:"c-hk-2", game:"Hollow Knight", style:"sketch", title:"Плащ: только складки", desc:"5 минут. Зигзаг, не прямая.", difficulty:"low" },
  { id:"c-hk-3", game:"Hollow Knight", style:"comic", title:"Бой: 3 кадра", desc:"Движение, удар, пауза.", difficulty:"high" },
  // Silksong
  { id:"c-silk-1", game:"Silksong", style:"gothic", title:"Хорнет в готике", desc:"Изящные линии, игла.", difficulty:"high" },
  { id:"c-silk-2", game:"Silksong", style:"sketch", title:"Игла за 5 минут", desc:"Только форма и направление.", difficulty:"low" },
  { id:"c-silk-3", game:"Silksong", style:"anime", title:"Хорнет в аниме", desc:"Большие глаза, динамика.", difficulty:"high" },
  // Undertale
  { id:"c-ut-1", game:"Undertale", style:"pixel", title:"Санс 32×32", desc:"1 пиксель = 1 клетка.", difficulty:"medium" },
  { id:"c-ut-2", game:"Undertale", style:"minimal", title:"Сцена в 3 цветах", desc:"Минимум информации, максимум смысла.", difficulty:"medium" },
  { id:"c-ut-3", game:"Undertale", style:"cartoon", title:"Спрайт в мультяшном", desc:"Перерисуй пиксель крупными формами.", difficulty:"medium" },
  // Deltarune
  { id:"c-dr-1", game:"Deltarune", style:"pixel", title:"Сьюзи 64×64", desc:"Больше пикселей — больше деталей.", difficulty:"high" },
  { id:"c-dr-2", game:"Deltarune", style:"cartoon", title:"Крис в мультяшном", desc:"Упрощённые формы.", difficulty:"medium" },
  { id:"c-dr-3", game:"Deltarune", style:"comic", title:"Диалог: 2 кадра", desc:"Комикс с репликами.", difficulty:"medium" },
  // OneShot
  { id:"c-os-1", game:"OneShot", style:"minimal", title:"Нико: шарф + силуэт", desc:"Только главное.", difficulty:"low" },
  { id:"c-os-2", game:"OneShot", style:"pixel", title:"Спрайт 32×32", desc:"Пиксель без сглаживания.", difficulty:"medium" },
  { id:"c-os-3", game:"OneShot", style:"pixel", title:"Сцена: 3 кадра", desc:"Пиксельная история.", difficulty:"high" },
  // Ultrakill
  { id:"c-ult-1", game:"Ultrakill", style:"grunge", title:"Гавриил в гранже", desc:"Металл, кровь, жёсткость.", difficulty:"high" },
  { id:"c-ult-2", game:"Ultrakill", style:"comic", title:"В1 в комиксе", desc:"Динамика, бой.", difficulty:"high" },
  { id:"c-ult-3", game:"Ultrakill", style:"realism", title:"Оружие в реализме", desc:"Точные пропорции, металл.", difficulty:"high" }
];

// Экспорт для использования в других файлах
window.APP_DATA = { PROGRAM, LESSON_TASKS, STYLES, CREATIVE_TASKS };