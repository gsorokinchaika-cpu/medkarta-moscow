const STORAGE_KEY = 'medkarta-records-v1';
const SOURCE_URL_KEY = 'medkarta-sheet-url';
const LAST_SYNC_KEY = 'medkarta-last-sync';
const DELETED_SOURCE_KEY = 'medkarta-deleted-source-records';
const DEFAULT_SOURCE_URL = 'https://docs.google.com/spreadsheets/d/1w55BqwgeNZTaxhsiq6tz3-UG9n92TwBu/edit?gid=723850286#gid=723850286';
const SYNC_INTERVAL_MS = 5 * 60 * 1000;

function classifyDirections(text = '') {
  const rules = [
    ['Онкология', /онко/i], ['Кардиология', /кардио|аритм/i], ['Хирургия', /хирург|трансплант/i], ['Неврология', /неврол|нейрохирург|мозг/i],
    ['Педиатрия', /детск|педиатр|неонат/i], ['Гинекология', /гинек|акуш|репродукт|материн/i], ['Гастроэнтерология', /гастро|гепат|панкреат/i],
    ['Травматология и ортопедия', /травмат|ортопед|спинал/i], ['Диагностика', /диагност|рентген|мрт|кт|скрининг|анализ/i], ['Инфекции', /инфекц|гепатит/i],
    ['Офтальмология', /офтальм|глаз/i], ['Реабилитация', /реабилит/i], ['Урология', /уролог/i], ['Пульмонология', /пульмон|респиратор/i], ['Нефрология', /нефрол/i], ['ЛОР', /оторин|лор/i]
  ];
  const matches = rules.filter(([, expression]) => expression.test(text)).map(([label]) => label);
  return matches.length ? matches : ['Многопрофильная помощь'];
}
// Координаты сверены по адресам из исходного каталога. Они нужны только для карты;
// в карточках не показываются и не заменяют данные, введённые пользователем.
const MOSCOW_CLINIC_LOCATIONS = {
  0:{name:'РНИМУ им. Пирогова',address:'ул. Островитянова, 1, стр. 7',lat:55.6333876,lng:37.5403384},
  1:{name:'НИИ им. Склифосовского',address:'Большая Сухаревская площадь, 3, стр. 1',lat:55.7748042,lng:37.6354793},
  2:{name:'НМИЦ нейрохирургии им. Бурденко',address:'4-я Тверская-Ямская улица, 16',lat:55.7739338,lng:37.5960538},
  3:{name:'ММКЦ «Коммунарка»',address:'посёлок Коммунарка, ул. Сосенский Стан, 8',lat:55.5668819,lng:37.4662234},
  4:{name:'Морозовская ДГКБ',address:'4-й Добрынинский переулок, 1/9',lat:55.7260591,lng:37.6178564},
  5:{name:'ДГКБ им. Башляевой',address:'ул. Героев Панфиловцев, 28',lat:55.8536571,lng:37.4055616},
  6:{name:'ДГКБ им. Филатова',address:'Садовая-Кудринская улица, 15, стр. 3',lat:55.7641248,lng:37.5878044},
  7:{name:'МНКЦ им. Боткина',address:'2-й Боткинский проезд, 5',lat:55.7813799,lng:37.5538823},
  8:{name:'УКБ №1 Сеченовского университета',address:'Большая Пироговская улица, 6, стр. 1',lat:55.7290569,lng:37.5617613},
  9:{name:'Клиника урологии им. Фронштейна',address:'Большая Пироговская улица, 2, стр. 1',lat:55.7312084,lng:37.5678286},
  10:{name:'Клиника Василенко',address:'Большая Пироговская улица, 6, стр. 1',lat:55.7290569,lng:37.5617613},
  11:{name:'Клиника реабилитации Сеченовского университета',address:'Большая Пироговская улица, 2, стр. 9',lat:55.7312084,lng:37.5678286},
  12:{name:'УКБ №3 Сеченовского университета',address:'ул. Россолимо, 11, стр. 4',lat:55.7332105,lng:37.5815993},
  13:{name:'УКБ №4 Сеченовского университета',address:'ул. Россолимо, 11, стр. 4',lat:55.7332105,lng:37.5815993},
  14:{name:'Сеченовский центр материнства и детства',address:'ул. Доватора, 15, стр. 1',lat:55.7220464,lng:37.5656964},
  15:{name:'РНЦХ им. Петровского',address:'Абрикосовский переулок, 2',lat:55.7301362,lng:37.5638577},
  16:{name:'ГКБ №31 им. Савельевой',address:'ул. Лобачевского, 42, стр. 1',lat:55.6695343,lng:37.5010911},
  17:{name:'ГКБ №67 им. Ворохобова',address:'ул. Саляма Адиля, 2/44',lat:55.7723416,lng:37.4654141},
  18:{name:'ГКБ им. Юдина',address:'Коломенский проезд, 4',lat:55.6629931,lng:37.6403218},
  19:{name:'ИКБ №1',address:'Волоколамское шоссе, 63, стр. 2',lat:55.8155879,lng:37.4541201},
  20:{name:'ФНКЦ ФМБА России',address:'Ореховый бульвар, 28',lat:55.6165122,lng:37.7638750},
  21:{name:'НМИЦ им. Кулакова',address:'ул. Академика Опарина, 4',lat:55.6442291,lng:37.5004569},
  22:{name:'МКНЦ им. Логинова',address:'Новогиреевская улица, 1, корп. 1',lat:55.7642097,lng:37.7914276},
  23:{name:'НМИЦ онкологии им. Блохина',address:'Каширское шоссе, 23',lat:55.6572673,lng:37.6497731},
  24:{name:'МНИОИ им. Герцена',address:'2-й Боткинский проезд, 3',lat:55.7803579,lng:37.5563777},
  25:{name:'НМИЦ сердечно-сосудистой хирургии им. Бакулева',address:'Рублёвское шоссе, 135',lat:55.7615828,lng:37.3772754},
  26:{name:'ГКБ №29 им. Баумана',address:'Госпитальная площадь, 2',lat:55.7673684,lng:37.7040615},
  27:{name:'Первая Градская больница им. Пирогова',address:'Ленинский проспект, 8, корп. 1',lat:55.715,lng:37.5884},
  28:{name:'НИКИ педиатрии и детской хирургии им. Вельтищева',address:'Талдомская улица, 2',lat:55.8695098,lng:37.5184286},
  29:{name:'НМХЦ им. Пирогова',address:'Нижняя Первомайская улица, 70',lat:55.7909939,lng:37.8208335},
  30:{name:'Институт мозга РЦНН',address:'переулок Обуха, 5, стр. 2',lat:55.7529243,lng:37.6541252},
  31:{name:'НИИ глазных болезней им. Краснова',address:'ул. Россолимо, 11А',lat:55.7346861,lng:37.5798611},
  32:{name:'ДГКБ №9 им. Сперанского',address:'Шмитовский проезд, 29',lat:55.7552139,lng:37.5389392},
  33:{name:'НМИЦ кардиологии им. Чазова',address:'ул. Академика Чазова, 15А',lat:55.7554803,lng:37.3781828},
  34:{name:'ГКБ им. Буянова',address:'Бакинская улица, 26',lat:55.6178758,lng:37.6541625},
  35:{name:'ГВВ №2',address:'Волгоградский проспект, 168',lat:55.6900537,lng:37.8126976}
};
function normalizeLocationName(value = '') { return value.toLocaleLowerCase('ru').replace(/[«»"№.,]/g, '').replace(/\s+/g, ' ').trim(); }
function knownLocation(name = '') {
  const found = Object.entries(MOSCOW_CLINIC_LOCATIONS).find(([, location]) => normalizeLocationName(location.name) === normalizeLocationName(name));
  return found ? { ...found[1], id:`clinic-${found[0]}` } : undefined;
}
function sourceClinic(id, name, services, metro, note, district, x, y) {
  const directions = classifyDirections(services);
  const location = MOSCOW_CLINIC_LOCATIONS[id];
  return { id:`clinic-${id}`, name, type:'clinic', specialty:directions[0], directions, district, metro, price:'', services, note, x, y, address:location?.address || '', lat:location?.lat, lng:location?.lng, _source:'sheet' };
}

// Снимок первой вкладки каталога от 28.08.2026. Обновляется из CSV через интерфейс.
const seedRecords = [
  sourceClinic(0, 'РНИМУ им. Пирогова', 'Хирурги, нейрохирургия', 'Университет Дружбы народов', 'Дети + взрослые · Федеральное · Экстренная и плановая госпитализация', 'Юго-запад', 32, 61),
  sourceClinic(1, 'НИИ им. Склифосовского', 'Кардиохирургия, ОРИТ, сосудистая хирургия, травматология, неотложная неврология', 'Сухаревская', 'Взрослые · Городское · Экстренная и плановая госпитализация', 'Центр', 47, 45),
  sourceClinic(2, 'НМИЦ нейрохирургии им. Бурденко', 'Нейрохирургия', 'Маяковская', 'Дети + взрослые · Федеральное · Экстренная и плановая госпитализация', 'Центр', 49, 43),
  sourceClinic(3, 'ММКЦ «Коммунарка»', 'Онкология, сосудистая хирургия, травматология, гинекология, перинатальный центр, урология', '', 'Дети + взрослые · Городское · Экстренная и плановая госпитализация', 'Юг', 52, 73),
  sourceClinic(4, 'Морозовская ДГКБ', 'Челюстно-лицевая хирургия, гинекология, кардиохирургия, онкология, пульмонология', 'Добрынинская / Серпуховская', 'Детское · Городское · Экстренная и плановая госпитализация', 'Центр', 54, 46),
  sourceClinic(5, 'ДГКБ им. Башляевой', 'Детская кардиология, нейрохирургия, неонатология, офтальмология, детская хирургия, травматология', 'Сходненская', 'Детское · Городское · Экстренная и плановая госпитализация', 'Север', 51, 18),
  sourceClinic(6, 'ДГКБ им. Филатова', 'Хирургия, кардиохирургия, хирургия новорождённых, ОРИТ', 'Маяковская / Баррикадная', 'Детское · Городское · Экстренная и плановая госпитализация', 'Центр', 55, 40),
  sourceClinic(7, 'МНКЦ им. Боткина', 'Кардиохирургия, онкология, ЛОР, челюстно-лицевая хирургия, хирургия печени', 'Динамо / Беговая', 'Взрослые · Городское · Экстренная и плановая госпитализация', 'Север', 55, 27),
  sourceClinic(8, 'УКБ №1 Сеченовского университета', 'Хирургия, кардиология, кардиохирургия, онкология, ЛОР, травматология и ортопедия', 'Спортивная', 'Взрослые · Федеральное · Экстренная и плановая госпитализация', 'Центр', 46, 44),
  sourceClinic(9, 'Клиника урологии им. Фронштейна', 'Хирургическая урология, онкоурология, реконструктивная хирургия мочевых путей', 'Спортивная', 'Взрослые · Федеральное · Экстренная и плановая госпитализация', 'Центр', 48, 42),
  sourceClinic(10, 'Клиника Василенко', 'Гастроэнтерология, гепатология, предраковые заболевания ЖКТ', 'Спортивная', 'Взрослые · Федеральное · Плановая госпитализация', 'Центр', 50, 40),
  sourceClinic(11, 'Клиника реабилитации Сеченовского университета', 'Реабилитация после травм и операций, нейрореабилитация', 'Спортивная', 'Взрослые · Федеральное · Плановая госпитализация', 'Центр', 52, 38),
  sourceClinic(12, 'УКБ №3 Сеченовского университета', 'Нефрология, неврология, нейрохирургия, ревматология', 'Спортивная', 'Взрослые · Федеральное · Экстренная и плановая госпитализация', 'Центр', 54, 36),
  sourceClinic(13, 'УКБ №4 Сеченовского университета', 'Пульмонология, торакальная хирургия, онкология, онкохирургия, колопроктология', 'Спортивная', 'Взрослые · Федеральное · Экстренная и плановая госпитализация', 'Центр', 56, 34),
  sourceClinic(14, 'Сеченовский центр материнства и детства', 'Акушерство, гинекология, гинекологическая хирургия, репродуктология, неонатология', 'Спортивная', 'Дети + взрослые · Федеральное · Экстренная и плановая госпитализация', 'Центр', 56, 50),
  sourceClinic(15, 'РНЦХ им. Петровского', 'Сердечно-сосудистая хирургия, трансплантология, онкохирургия', 'Спортивная', 'Дети + взрослые · Федеральное · Экстренная и плановая госпитализация', 'Центр', 43, 48),
  sourceClinic(16, 'ГКБ №31 им. Савельевой', 'Перинатальный центр, гинекология', 'Проспект Вернадского', 'Взрослые · Городское · Экстренная и плановая госпитализация', 'Запад', 22, 49),
  sourceClinic(17, 'ГКБ №67 им. Ворохобова', 'Московский спинальный центр, сосудистая хирургия, травматология, эндокринная хирургия', 'Народного ополчения', 'Дети + взрослые · Городское · Экстренная и плановая госпитализация', 'Запад', 24, 47),
  sourceClinic(18, 'ГКБ им. Юдина', 'Онкология, онкохирургия, сосудистая хирургия, кардиология, травматология', 'Каширская', 'Взрослые · Городское · Экстренная и плановая госпитализация', 'Юг', 52, 69),
  sourceClinic(19, 'ИКБ №1', 'Нейроинфекция, детские инфекции, вирусные гепатиты', 'Щукинская', 'Дети + взрослые · Городское · Экстренная и плановая госпитализация', 'Север', 49, 16),
  sourceClinic(20, 'ФНКЦ ФМБА России', 'Кардиология, аритмология, кардиохирургия, онкология, сосудистая хирургия', 'Красногвардейская', 'Взрослые · Федеральное · Экстренная и плановая госпитализация', 'Юг', 56, 78),
  sourceClinic(21, 'НМИЦ им. Кулакова', 'Гинекология, акушерство высокого риска, репродуктология, ЭКО, онкогинекология', 'Университет дружбы народов', 'Дети + взрослые · Федеральное · Экстренная и плановая госпитализация', 'Юго-запад', 44, 71),
  sourceClinic(22, 'МКНЦ им. Логинова', 'Гастроэнтерология, гепатология, хирургия печени, онкология, колопроктология', 'Шоссе Энтузиастов', 'Взрослые · Городское · Плановая госпитализация', 'Восток', 82, 47),
  sourceClinic(23, 'НМИЦ онкологии им. Блохина', 'Хирургия, абдоминальная онкология, онкогематология, детская онкология, лучевая онкология', 'Каширская', 'Дети + взрослые · Федеральное · Плановая госпитализация', 'Юг', 47, 72),
  sourceClinic(24, 'МНИОИ им. Герцена', 'Онкохирургия, торакальная онкология, онкоурология, онкогинекология, лучевая терапия', 'Беговая / Фрунзенская', 'Дети + взрослые · Федеральное · Плановая госпитализация', 'Центр', 44, 39),
  sourceClinic(25, 'НМИЦ сердечно-сосудистой хирургии им. Бакулева', 'Кардиохирургия, аритмология, коронарная и сосудистая хирургия', 'Молодёжная', 'Дети + взрослые · Федеральное · Плановая госпитализация', 'Запад', 25, 44),
  sourceClinic(26, 'ГКБ №29 им. Баумана', 'Кардиология, экстренная и общая хирургия, хирургия кисти, акушерство и гинекология, ЛОР', 'Лефортово', 'Взрослые · Городское · Экстренная и плановая госпитализация', 'Восток', 75, 39),
  sourceClinic(27, 'Первая Градская больница им. Пирогова', 'Кардиология, сосудистая хирургия, челюстно-лицевая хирургия, травматология, офтальмология', 'Октябрьская', 'Взрослые · Городское · Экстренная и плановая госпитализация', 'Юг', 41, 72),
  sourceClinic(28, 'НИКИ педиатрии и детской хирургии им. Вельтищева', 'Детская хирургия, детская кардиология, детская неврология, педиатрия', 'Селигерская', 'Детское · Федеральное · Плановая госпитализация', 'Север', 52, 24),
  sourceClinic(29, 'НМХЦ им. Пирогова', 'Многопрофильная помощь', 'Первомайская', 'Дети + взрослые · Федеральное · Экстренная и плановая госпитализация', 'Восток', 81, 46),
  sourceClinic(30, 'Институт мозга РЦНН', 'Неврология, нейрохирургия', 'Чкаловская', 'Взрослые · Федеральное · Плановая госпитализация', 'Восток', 68, 44),
  sourceClinic(31, 'НИИ глазных болезней им. Краснова', 'Офтальмология', 'Парк культуры', 'Взрослые · Федеральное · Плановая госпитализация', 'Центр', 47, 37),
  sourceClinic(32, 'ДГКБ №9 им. Сперанского', 'Педиатрия', 'Деловой центр', 'Детское · Городское · Экстренная и плановая госпитализация', 'Запад', 33, 35),
  sourceClinic(33, 'НМИЦ кардиологии им. Чазова', 'Кардиология, аритмология', 'Молодёжная', 'Взрослые · Федеральное · Экстренная и плановая госпитализация', 'Запад', 28, 52),
  sourceClinic(34, 'ГКБ им. Буянова', 'Многопрофильная помощь', 'Кантемировская / Царицыно', 'Взрослые · Городское · Экстренная и плановая госпитализация', 'Юг', 54, 76),
  sourceClinic(35, 'ГВВ №2', 'Многопрофильная помощь', 'Юго-Восточная', 'Взрослые · Городское · Экстренная и плановая госпитализация', 'Восток', 73, 57),
];

let records = loadRecords();
let filters = { query:'', type:'all', specialties:new Set(), district:'' };
let activeId = null;

const $ = (s) => document.querySelector(s);
const els = {
  resultList: $('#resultList'), resultCount: $('#resultsCount'), mapCount: $('#mapResultCount'),
  specialtyFilters: $('#specialtyFilters'), specialtyCount: $('#specialtyCount'), district: $('#districtFilter'),
  search: $('#searchInput'), empty: $('#emptyMapState'), resultPanel: $('#resultsPanel'), detailsDialog: $('#detailsDialog'), detailsTags: $('#detailsTags'), detailsContent: $('#detailsContent'), recordDialog: $('#recordDialog'),
  recordForm: $('#recordForm'), deleteButton: $('#deleteRecord'), toast: $('#toast'), sheetDialog: $('#sheetDialog'), sheetForm: $('#sheetForm'), sheetMessage: $('#sheetMessage'), syncStatus:$('#syncStatus'), syncNow:$('#syncNow')
};
let medicalMap = null;
let markersLayer = null;
let syncPromise = null;
let lastSuccessfulSync = Number(localStorage.getItem(LAST_SYNC_KEY)) || 0;

function loadRecords() {
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(local) || !local.length) return seedRecords;
    return local.map(record => {
      const location = knownLocation(record.name);
      const updated = location && !Number.isFinite(Number(record.lat)) ? { ...record, address:record.address || location.address, lat:location.lat, lng:location.lng } : record;
      return { ...updated, _source:updated._source || (location ? 'sheet' : 'local') };
    });
  }
  catch { return seedRecords; }
}
function saveRecords() { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
function deletedSourceIds() { try { return new Set(JSON.parse(localStorage.getItem(DELETED_SOURCE_KEY)) || []); } catch { return new Set(); } }
function rememberDeletedSource(id) { const deleted=deletedSourceIds(); deleted.add(id); localStorage.setItem(DELETED_SOURCE_KEY, JSON.stringify([...deleted])); }
function escapeHtml(value = '') { return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[char])); }
function icon(type) { const paths = { doctor:'<path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5 20c.5-3.3 2.8-5 7-5s6.5 1.7 7 5"/>', clinic:'<path d="M5 20V7h14v13M9 7V4h6v3M9 12h.01M15 12h.01M9 16h.01M15 16h.01"/>', research:'<path d="M9 3h6M10 3v6l-4 7a3 3 0 0 0 2.6 4h6.8A3 3 0 0 0 18 16l-4-7V3M8.5 16h7"/>' }; return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[type]}</svg>`; }
function typeName(type) { return ({doctor:'Врач',clinic:'Клиника',research:'Исследование'})[type] || 'Запись'; }
function getDirections(record) { return Array.isArray(record.directions) && record.directions.length ? record.directions : [record.specialty].filter(Boolean); }
function matches(record) {
  const term = filters.query.trim().toLocaleLowerCase('ru');
  const text = [record.name,record.specialty,record.district,record.metro,record.services,record.note].join(' ').toLocaleLowerCase('ru');
  return (!term || text.includes(term)) && (filters.type === 'all' || record.type === filters.type) && (!filters.specialties.size || getDirections(record).some(direction => filters.specialties.has(direction))) && (!filters.district || record.district === filters.district);
}
function currentRecords() { return records.filter(matches); }

function toMapPoint(record) {
  if (Number.isFinite(Number(record.lat)) && Number.isFinite(Number(record.lng))) return [Number(record.lat), Number(record.lng)];
  const west = 37.28, east = 37.92, north = 55.98, south = 55.54;
  return [north - (Number(record.y) / 100) * (north - south), west + (Number(record.x) / 100) * (east - west)];
}
function markerIcon(record) {
  return L.divIcon({ className:'medical-map-marker', iconSize:[38, 45], iconAnchor:[19, 43], tooltipAnchor:[0, -38], html:`<span class="leaflet-pin ${record.type} ${activeId === record.id ? 'is-active' : ''}">${icon(record.type)}</span>` });
}
function initializeMap() {
  if (!window.L) return;
  medicalMap = L.map('leafletMap', { zoomControl:false, minZoom:9, maxZoom:15, preferCanvas:true }).setView([55.753, 37.62], 10.4);
  L.control.zoom({ position:'bottomright' }).addTo(medicalMap);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(medicalMap);
  markersLayer = L.layerGroup().addTo(medicalMap);
}
function renderMapMarkers(list) {
  if (!markersLayer) return;
  markersLayer.clearLayers();
  list.forEach(record => {
    const marker = L.marker(toMapPoint(record), { icon:markerIcon(record), keyboard:true, title:record.name });
    marker.bindTooltip(`<strong>${escapeHtml(record.name)}</strong><br>${escapeHtml(getDirections(record).slice(0, 2).join(' · '))}`, { direction:'top', offset:[0, -24], className:'medical-tooltip' });
    marker.on('click', () => openDetails(record.id));
    marker.addTo(markersLayer);
  });
}

function renderFilterOptions() {
  const specialties = [...new Set(records.flatMap(getDirections).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'ru'));
  filters.specialties = new Set([...filters.specialties].filter(x => specialties.includes(x)));
  els.specialtyCount.textContent = specialties.length;
  els.specialtyFilters.innerHTML = specialties.map((s, i) => `<label class="check-item"><input type="checkbox" value="${escapeHtml(s)}" ${filters.specialties.has(s) ? 'checked' : ''}/><span>${escapeHtml(s)}</span></label>`).join('');
  els.specialtyFilters.querySelectorAll('input').forEach(input => input.addEventListener('change', () => { input.checked ? filters.specialties.add(input.value) : filters.specialties.delete(input.value); render(); }));
  const districts = [...new Set(records.map(r => r.district).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'ru'));
  if (!districts.includes(filters.district)) filters.district = '';
  els.district.innerHTML = '<option value="">Все районы</option>' + districts.map(d => `<option value="${escapeHtml(d)}" ${filters.district === d ? 'selected' : ''}>${escapeHtml(d)}</option>`).join('');
}
function render() {
  const list = currentRecords();
  els.mapCount.textContent = list.length;
  els.resultCount.textContent = list.length;
  els.empty.hidden = list.length !== 0;
  renderMapMarkers(list);
  els.resultList.innerHTML = list.map(r => `<button class="result-card ${activeId === r.id ? 'is-active':''}" data-id="${r.id}"><span class="result-type ${r.type}">${icon(r.type)}</span><span class="result-card-content"><h3>${escapeHtml(r.name)}</h3><p>${escapeHtml(getDirections(r).slice(0, 2).join(' · '))} · ${escapeHtml(r.metro || r.district)}</p><span class="tag">${escapeHtml(typeName(r.type))}</span></span></button>`).join('') || '<div class="no-results">Попробуйте изменить фильтры.</div>';
  document.querySelectorAll('[data-id]').forEach(element => element.addEventListener('click', () => openDetails(element.dataset.id)));
}
function selectRecord(id) { activeId = id; render(); }
function detailSection(label, value) { return value ? `<section class="detail-section"><p>${escapeHtml(label)}</p><div>${escapeHtml(value)}</div></section>` : ''; }
function openDetails(id) {
  const record = records.find(r => r.id === id); if (!record) return;
  selectRecord(id);
  $('#detailsEyebrow').textContent = typeName(record.type);
  $('#detailsTitle').textContent = record.name;
  els.detailsTags.innerHTML = getDirections(record).map(direction => `<span>${escapeHtml(direction)}</span>`).join('');
  const location = [record.district, record.metro].filter(Boolean).join(' · ');
  els.detailsContent.innerHTML = [
    detailSection('Услуги и компетенции', record.services), detailSection('Расположение', location),
    detailSection('Стоимость', record.price), detailSection('Комментарий', record.note)
  ].filter(Boolean).join('') || '<p class="details-empty">Дополнительная информация пока не добавлена.</p>';
  els.detailsDialog.showModal();
}
function openEdit(id) {
  const record = records.find(r => r.id === id); if (!record) return;
  if (els.detailsDialog.open) els.detailsDialog.close();
  selectRecord(id);
  $('#recordDialogEyebrow').textContent = typeName(record.type);
  $('#recordDialogTitle').textContent = 'Редактировать карточку';
  $('#recordId').value = record.id;
  ['name','type','specialty','district','metro','price','services','note'].forEach(key => { $(`#${key}`).value = record[key] ?? ''; });
  els.deleteButton.hidden = false;
  els.recordDialog.showModal();
}
function openAdd() {
  els.recordForm.reset();
  $('#recordDialogEyebrow').textContent = 'Новая карточка'; $('#recordDialogTitle').textContent = 'Добавить запись'; $('#recordId').value = ''; els.deleteButton.hidden = true; els.recordDialog.showModal();
}
function showToast(text) { els.toast.textContent = text; els.toast.classList.add('is-visible'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => els.toast.classList.remove('is-visible'), 2600); }
function renderAll() { renderFilterOptions(); render(); }

$('#typeFilters').addEventListener('click', event => { const button = event.target.closest('button[data-type]'); if (!button) return; filters.type = button.dataset.type; $('#typeFilters').querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === button)); render(); });
els.search.addEventListener('input', () => { filters.query = els.search.value; render(); });
els.district.addEventListener('change', () => { filters.district = els.district.value; render(); });
$('#resetFilters').addEventListener('click', () => { filters = {query:'',type:'all',specialties:new Set(),district:''}; els.search.value=''; $('#typeFilters').querySelectorAll('button').forEach(b=>b.classList.toggle('is-active',b.dataset.type==='all')); renderAll(); });
$('#addRecord').addEventListener('click', openAdd); $('#openSheetDialog').addEventListener('click', () => { els.sheetMessage.textContent=''; $('#sheetUrl').value = activeSourceUrl(); els.sheetDialog.showModal(); });
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => $(`#${button.dataset.closeDialog}`).close()));
$('#editRecord').addEventListener('click', () => { if (activeId) openEdit(activeId); });
els.recordForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(els.recordForm); const id = form.get('recordId') || `m-${Date.now()}`;
  const entry = Object.fromEntries(form.entries()); const index = records.findIndex(r => r.id === id);
  const previous = index >= 0 ? records[index] : null; const location = knownLocation(entry.name);
  const placement = previous || sourcePlacement(`${entry.district || ''} ${entry.metro || ''}`, records.length);
  entry.id = id; entry.x = Number(placement.x); entry.y = Number(placement.y);
  entry.address = previous?.address || location?.address || '';
  entry.lat = previous?.lat ?? location?.lat; entry.lng = previous?.lng ?? location?.lng;
  entry._source = previous?._source || 'local';
  entry._localOverride = previous?._source === 'sheet' || previous?._localOverride || false;
  entry.directions = classifyDirections(`${entry.specialty} ${entry.services}`);
  if (index >= 0) records[index] = entry; else records.unshift(entry);
  saveRecords(); activeId=id; els.recordDialog.close(); renderAll(); showToast(index >= 0 ? 'Карточка сохранена' : 'Карточка добавлена');
});
els.deleteButton.addEventListener('click', () => { const id=$('#recordId').value; const record=records.find(r=>r.id===id); if(record?._source==='sheet') rememberDeletedSource(id); records=records.filter(r=>r.id!==id); activeId=null; saveRecords(); els.recordDialog.close(); renderAll(); showToast('Карточка удалена'); });
$('#closeResults').addEventListener('click', () => { els.resultPanel.classList.add('is-hidden'); $('#listToggle').classList.remove('is-selected'); }); $('#listToggle').addEventListener('click', () => { els.resultPanel.classList.toggle('is-hidden'); $('#listToggle').classList.toggle('is-selected', !els.resultPanel.classList.contains('is-hidden')); });
$('#locateButton').addEventListener('click', () => { activeId=null; render(); if (medicalMap) medicalMap.setView([55.753, 37.62], 10.4, { animate:true }); showToast('Карта центрирована на Москве'); });
$('#openSidebar').addEventListener('click', () => $('#sidebar').classList.add('is-open')); $('#closeSidebar').addEventListener('click', () => $('#sidebar').classList.remove('is-open'));
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase()==='k') { event.preventDefault(); els.search.focus(); } });

function googleSheetInfo(raw = '') {
  const url=raw.trim(); if(!url.includes('docs.google.com/spreadsheets')) return null;
  const id=url.match(/\/d\/([^/]+)/)?.[1]; if(!id) return null;
  return {id,gid:url.match(/[?#&]gid=(\d+)/)?.[1] || '0'};
}
function googleCsvUrl(raw) { const sheet=googleSheetInfo(raw); return sheet ? `https://docs.google.com/spreadsheets/d/${sheet.id}/gviz/tq?tqx=out:csv&gid=${sheet.gid}` : raw.trim(); }
function googleTableRows(payload) {
  if(payload?.status!=='ok' || !payload.table) throw new Error('Google Таблица вернула некорректный ответ');
  const headers=payload.table.cols.map(column=>String(column.label || column.id || '').trim().toLocaleLowerCase('ru'));
  return payload.table.rows.map(row=>Object.fromEntries(headers.map((header,index)=>{
    const cell=row.c?.[index]; return [header,String(cell?.f ?? cell?.v ?? '').trim()];
  })));
}
function loadGoogleSheet(raw) {
  const sheet=googleSheetInfo(raw); if(!sheet) return Promise.reject(new Error('Это не ссылка на Google Таблицу'));
  return new Promise((resolve,reject)=>{
    const callbackName=`__medkarta_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script=document.createElement('script'); let settled=false;
    const finish=(error,value)=>{ if(settled)return; settled=true; clearTimeout(timer); script.remove(); delete window[callbackName]; error ? reject(error) : resolve(value); };
    const timer=setTimeout(()=>finish(new Error('Google Таблица не ответила вовремя')),15000);
    window[callbackName]=payload=>{ try { finish(null,googleTableRows(payload)); } catch(error) { finish(error); } };
    const params=new URLSearchParams({headers:'1',gid:sheet.gid,tqx:`out:json;responseHandler:${callbackName}`,_:String(Date.now())});
    script.src=`https://docs.google.com/spreadsheets/d/${sheet.id}/gviz/tq?${params}`;
    script.async=true; script.onerror=()=>finish(new Error('Не удалось загрузить Google Таблицу'));
    document.head.append(script);
  });
}
async function loadCsv(raw) {
  const csvUrl=googleCsvUrl(raw); const separator=csvUrl.includes('?')?'&':'?';
  const controller=typeof AbortController==='function' ? new AbortController() : null;
  const timeout=setTimeout(()=>controller?.abort(),10000);
  try {
    const request=fetch(`${csvUrl}${separator}_=${Date.now()}`,{cache:'no-store',signal:controller?.signal});
    const response=controller ? await request : await Promise.race([request,new Promise((_,reject)=>setTimeout(()=>reject(new Error('Источник не ответил вовремя')),10000))]);
    if(!response.ok) throw new Error('Не удалось получить таблицу');
    return parseCsv(await response.text());
  } finally { clearTimeout(timeout); }
}
async function loadSourceRows(raw) {
  if(googleSheetInfo(raw)) {
    try { return await loadGoogleSheet(raw); }
    catch(jsonpError) { try { return await loadCsv(raw); } catch { throw jsonpError; } }
  }
  return loadCsv(raw);
}
function parseCsv(input) { const rows=[]; let row=[], cell='', quoted=false; for(let i=0;i<input.length;i++){ const c=input[i], n=input[i+1]; if(c==='"' && quoted && n==='"'){cell+='"';i++;} else if(c==='"'){quoted=!quoted;} else if(c===',' && !quoted){row.push(cell);cell='';} else if((c==='\n' || c==='\r') && !quoted){ if(c==='\r'&&n==='\n')i++;row.push(cell); if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';} else cell+=c; } row.push(cell); if(row.some(v=>v.trim()))rows.push(row); if(rows.length<2)return []; const headers=rows.shift().map(x=>x.trim().toLowerCase()); return rows.map(row=>Object.fromEntries(headers.map((h,i)=>[h,(row[i]||'').trim()]))); }
function sourcePlacement(address = '', index = 0) {
  const value = address.toLocaleLowerCase('ru'); let district='Центр', base=[51, 42];
  if (/\bюг\b|кашир|коломен|орехов|бакин|коммунарк/.test(value)) { district='Юг'; base=[52, 72]; }
  else if (/\bсевер\b|волоколам|боткин|талдом|панфилов|сходнен|селигер/.test(value)) { district='Север'; base=[50, 21]; }
  else if (/\bвосток\b|первомай|энтузиаст|госпиталь|обуха|лефорт/.test(value)) { district='Восток'; base=[74, 45]; }
  else if (/\bзапад\b|рублев|лобачев|саляма|молодеж|деловой/.test(value)) { district='Запад'; base=[27, 47]; }
  else if (/юго-запад|островит|опарин|ленинск|вернад/.test(value)) { district='Юго-запад'; base=[38, 65]; }
  return { district, x:base[0] + ((index * 17) % 13) - 6, y:base[1] + ((index * 11) % 11) - 5 };
}
function extractMetro(address = '') { return (address.match(/(?:метро|м\.)\s*([^.,;]+)/i) || [])[1]?.trim() || ''; }
function optionalNumber(value) { return value === '' || value === undefined ? null : Number(value); }
function stableSourceId(value = '') { let hash=2166136261; for(const char of value){ hash^=char.charCodeAt(0); hash=Math.imul(hash,16777619); } return `sheet-${(hash>>>0).toString(36)}`; }
function normalizeImported(rows) {
  const validTypes=['doctor','clinic','research'];
  return rows.map((r,index) => {
    const address=r.address || r['адрес'] || ''; const name=r.name || r['фио'] || r['название'] || r['краткое название'] || '';
    const placement=sourcePlacement(address, index); const location=knownLocation(name); const services=r.services || r['услуги'] || r['основные направления'] || r.specialty || r['направление'] || '';
    const directions=classifyDirections(services); const x=optionalNumber(r.x); const y=optionalNumber(r.y); const lat=optionalNumber(r.lat || r.latitude); const lng=optionalNumber(r.lng || r.lon || r.longitude); const sourceFormat=[r['возраст'],r['уровень учреждения'],r['формат помощи'],r['экстренная госпитализация']==='Да'?'Экстренная госпитализация':'',r['плановая госпитализация']==='Да'?'Плановая госпитализация':''].filter(Boolean).join(' · ');
    const sourceIdentity=r.id || r['id учреждения'] || r['id клиники'] || r[''] || name;
    return { id:location?.id || stableSourceId(sourceIdentity), name, type:validTypes.includes((r.type||'').toLowerCase()) ? r.type.toLowerCase() : (r['краткое название'] ? 'clinic' : 'doctor'), specialty:r.specialty || r['направление'] || directions[0], directions, district:r.district || r['район'] || placement.district, metro:r.metro || r['метро'] || extractMetro(address), price:r.price || r['стоимость'] || '', services, note:r.note || r['комментарий'] || r['общий комментарий'] || sourceFormat, address, lat:Number.isFinite(lat) ? lat : location?.lat, lng:Number.isFinite(lng) ? lng : location?.lng, x:Number.isFinite(x) ? x : placement.x, y:Number.isFinite(y) ? y : placement.y, _source:'sheet' };
  }).filter(r=>r.name && r.specialty && r.district && r.x>=0 && r.x<=100 && r.y>=0 && r.y<=100);
}

function mergeSourceRecords(imported) {
  const deleted=deletedSourceIds(); const localById=new Map(records.map(record=>[record.id,record])); const localByName=new Map(records.map(record=>[normalizeLocationName(record.name),record]));
  const merged=imported.filter(record=>!deleted.has(record.id)).map(sourceRecord=>{
    const local=localById.get(sourceRecord.id) || localByName.get(normalizeLocationName(sourceRecord.name));
    return local?._localOverride ? { ...sourceRecord, ...local, id:sourceRecord.id, _source:'sheet', _localOverride:true } : sourceRecord;
  });
  const sourceIds=new Set(merged.map(record=>record.id)); const sourceNames=new Set(merged.map(record=>normalizeLocationName(record.name)));
  const localOnly=records.filter(record=>record._source!=='sheet' && !sourceIds.has(record.id) && !sourceNames.has(normalizeLocationName(record.name)));
  return [...merged,...localOnly];
}
function activeSourceUrl() { return localStorage.getItem(SOURCE_URL_KEY) || DEFAULT_SOURCE_URL; }
function setSyncStatus(state, text) {
  els.syncStatus.className=`sync-status is-${state}`; els.syncStatus.querySelector('span').textContent=text;
  els.syncNow.classList.toggle('is-spinning',state==='syncing'); els.syncNow.disabled=state==='syncing';
}
function formatSyncTime(timestamp) { return new Intl.DateTimeFormat('ru-RU',{hour:'2-digit',minute:'2-digit'}).format(new Date(timestamp)); }
async function syncSourceSheet({ rawUrl=activeSourceUrl(), notify=false }={}) {
  if(syncPromise) return syncPromise;
  setSyncStatus('syncing','Обновляем данные…');
  syncPromise=(async()=>{
    const imported=normalizeImported(await loadSourceRows(rawUrl));
    if(!imported.length) throw new Error('В таблице не нашлось подходящих строк');
    records=mergeSourceRecords(imported); saveRecords(); activeId=null; renderAll();
    lastSuccessfulSync=Date.now(); localStorage.setItem(LAST_SYNC_KEY,String(lastSuccessfulSync));
    setSyncStatus('success',`Обновлено в ${formatSyncTime(lastSuccessfulSync)} · ${imported.length} карточек`);
    if(notify) showToast(`Данные обновлены: ${imported.length} карточек`);
    return imported.length;
  })();
  try { return await syncPromise; }
  catch(error) {
    const fallback=lastSuccessfulSync ? `Последнее обновление в ${formatSyncTime(lastSuccessfulSync)}` : 'Работаем с сохранёнными данными';
    setSyncStatus('error',fallback); throw error;
  } finally { syncPromise=null; }
}

els.sheetForm.addEventListener('submit', async event => {
  event.preventDefault(); const raw=$('#sheetUrl').value.trim(); if(!raw){els.sheetMessage.textContent='Вставьте ссылку на таблицу или CSV.';return;}
  const button=$('#importSheet'); button.disabled=true; button.textContent='Загружаем…'; els.sheetMessage.textContent='';
  try { await syncSourceSheet({rawUrl:raw,notify:true}); localStorage.setItem(SOURCE_URL_KEY,raw); els.sheetDialog.close(); }
  catch(error) { els.sheetMessage.textContent=`${error.message}. Проверьте, что таблица доступна по ссылке.`; }
  finally { button.disabled=false; button.textContent='Загрузить данные'; }
});
els.syncNow.addEventListener('click',()=>syncSourceSheet({notify:true}).catch(error=>showToast(error.message)));

initializeMap();
renderAll();
$('#sheetUrl').value=activeSourceUrl();
if(lastSuccessfulSync) setSyncStatus('success',`Последнее обновление в ${formatSyncTime(lastSuccessfulSync)}`);
syncSourceSheet().catch(()=>{});
setInterval(()=>syncSourceSheet().catch(()=>{}),SYNC_INTERVAL_MS);
document.addEventListener('visibilitychange',()=>{ if(!document.hidden && Date.now()-lastSuccessfulSync>60000) syncSourceSheet().catch(()=>{}); });
