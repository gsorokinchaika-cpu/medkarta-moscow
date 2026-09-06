const STORAGE_KEY = 'medkarta-doctors-records-v1';
const SOURCE_URL_KEY = 'medkarta-doctors-sheet-url';
const LAST_SYNC_KEY = 'medkarta-doctors-last-sync';
const DELETED_SOURCE_KEY = 'medkarta-doctors-deleted-source-records';
const SOURCE_SHEET_ID = '1CPga4Apdbs0be4KxmbbWmRdvLKTCFwWVrytinJln1rU';
const FULL_DATA_GID = '1184670681';
const DEFAULT_SOURCE_URL = 'https://docs.google.com/spreadsheets/d/1CPga4Apdbs0be4KxmbbWmRdvLKTCFwWVrytinJln1rU/edit?gid=1066498235#gid=1066498235';
const SYNC_INTERVAL_MS = 5 * 60 * 1000;

const LOCATION_HINTS = [
  [/профсоюзн(?:ая|ой)[^;]*76/i, 55.6580, 37.5408],
  [/лобачевского[^;]*42/i, 55.6695, 37.5011],
  [/ленинск(?:ий|ого)[^;]*(?:103|107)/i, 55.6664, 37.5150],
  [/трубниковск(?:ий|ого)[^;]*30/i, 55.7582, 37.5857],
  [/красн(?:ая|ой) пресн(?:я|е)[^;]*16/i, 55.7610, 37.5701],
  [/мытн(?:ая|ой)[^;]*7/i, 55.7231, 37.6148],
  [/мосфильмовск(?:ая|ой)[^;]*53/i, 55.7144, 37.5112],
  [/лесн(?:ая|ой)[^;]*9/i, 55.7767, 37.5867],
  [/(?:сколково|большой бульвар[^;]*46)/i, 55.6979, 37.3596],
  [/мичуринск(?:ий|ого)[^;]*31/i, 55.6952, 37.5038],
  [/ломоносовск(?:ий|ого)[^;]*7/i, 55.7030, 37.5562],
  [/лапино|успенск(?:ое|ого) шоссе[^;]*111/i, 55.6967, 37.1370],
  [/севастопольск(?:ий|ого)[^;]*24/i, 55.6722, 37.5858],
  [/проспект вернадского[^;]*6/i, 55.6922, 37.5310],
  [/ярцевск(?:ая|ой)[^;]*19/i, 55.7380, 37.4091],
  [/мал(?:ая|ой) грузинск(?:ая|ой)[^;]*20/i, 55.7680, 37.5692],
  [/колобовск(?:ий|ого)[^;]*4/i, 55.7737, 37.6208],
  [/больш(?:ая|ой) очаковск(?:ая|ой)[^;]*2/i, 55.6979, 37.4549],
  [/николоямск(?:ая|ой)[^;]*7/i, 55.7485, 37.6600],
  [/каланч[её]вск(?:ая|ой)[^;]*45/i, 55.7781, 37.6530],
  [/николощеповск(?:ий|ого)[^;]*6/i, 55.7469, 37.5809],
  [/троицк(?:ий|ого)[^;]*5/i, 55.7790, 37.6207],
  [/столярн(?:ый|ого)[^;]*3/i, 55.7632, 37.5638],
  [/островитянова[^;]*1/i, 55.6334, 37.5403],
  [/солянк(?:а|е)[^;]*1/i, 55.7524, 37.6371],
  [/мичуринск(?:ий|ого)[^;]*15/i, 55.7148, 37.5214],
  [/брянск(?:ая|ой)[^;]*7/i, 55.7442, 37.5647],
  [/волочаевск(?:ая|ой)[^;]*15/i, 55.7543, 37.6792],
  [/староволынск(?:ая|ой)[^;]*10/i, 55.7160, 37.4624],
  [/нижн(?:яя|ей) первомайск(?:ая|ой)[^;]*70/i, 55.7910, 37.8208],
  [/погодинск(?:ая|ой)[^;]*6/i, 55.7380, 37.5629],
  [/(?:энтузиастов[^;]*86|новогиреевск(?:ая|ой)[^;]*1)/i, 55.7578, 37.7967],
  [/пятницк(?:ая|ой)[^;]*71/i, 55.7312, 37.6251],
  [/ленинск(?:ий|ого)[^;]*15/i, 55.7202, 37.5961],
  [/ямского поля[^;]*15/i, 55.7847, 37.5858],
  [/садовническ(?:ая|ой)[^;]*11/i, 55.7463, 37.6300],
  [/доватора[^;]*15/i, 55.7220, 37.5657],
  [/больш(?:ая|ой) серпуховск(?:ая|ой)[^;]*16/i, 55.7303, 37.6256],
  [/ленинградск(?:ое|ого) шоссе[^;]*16/i, 55.8231, 37.4972],
  [/испания/i, 40.4168, -3.7038]
];

const SPECIALTY_RULES = [
  ['Офтальмология', /офтальм|заболеван\w* глаз|катаракт|глауком/i],
  ['Онкология', /онколог|онкохирург|химиотерап|иммунотерап|рак\b|опухол/i],
  ['Хирургия', /хирург|лапароскоп|роботическ/i],
  ['Гастроэнтерология', /гастро|гепат|желудочно|жкт|кишеч/i],
  ['Дерматология', /дермат|венеролог|заболеван\w* кож|акне/i],
  ['Косметология', /косметолог|ботулино|контурн\w* пластик|биоревитал/i],
  ['УЗ-диагностика', /ультразвук|уз-?диагност|узи\b|врач узд/i],
  ['Стоматология', /стомат|зуб|гнатолог|ортодонт/i],
  ['Урология', /уролог|мочев|простаты|мочекамен/i],
  ['Андрология', /андролог|мужск\w* бесплод|эректильн/i],
  ['Гинекология', /гинек|акуш|беремен|тазов\w* дн|менопауз|эндометриоз/i],
  ['Эндокринология', /эндокрин|диабет|щитовид|гормон|ожирен/i],
  ['Психиатрия и психотерапия', /психиатр|психотерап|депресс|тревож|окр\b|сдвг/i],
  ['ЛОР и сурдология', /оторин|отоневрол|лор\b|сурдолог|вестибулолог/i],
  ['Неврология', /неврол|нейро|головн\w* мозг|инсульт/i],
  ['Кардиология', /кардиолог|аритм|сердечн/i],
  ['Флебология и сосуды', /флебол|сосудист|ангиохирург|варикоз|тромб/i],
  ['Ортопедия и травматология', /ортопед|травмат|сустав|спортивн\w* медицин/i],
  ['Реабилитация', /реабилит|лфк\b|восстановлен/i],
  ['Маммология', /маммолог|молочн\w* желез/i],
  ['Ревматология', /ревматолог/i],
  ['Терапия и профилактика', /терапевт|превентив|профилактич/i],
  ['Педиатрия', /педиатр|детск\w* врач/i]
];

const $ = selector => document.querySelector(selector);
const els = {
  resultList: $('#resultList'), resultCount: $('#resultsCount'), mapCount: $('#mapResultCount'),
  specialtyFilters: $('#specialtyFilters'), specialtyCount: $('#specialtyCount'), district: $('#districtFilter'),
  onlineOnly: $('#onlineOnly'), sort: $('#sortSelect'), search: $('#searchInput'), empty: $('#emptyMapState'),
  resultPanel: $('#resultsPanel'), detailsDialog: $('#detailsDialog'), detailsTags: $('#detailsTags'),
  detailsSummary: $('#detailsSummary'), detailsContent: $('#detailsContent'), detailsSource: $('#detailsSource'),
  callDoctor: $('#callDoctor'), recordDialog: $('#recordDialog'), recordForm: $('#recordForm'),
  deleteButton: $('#deleteRecord'), sheetDialog: $('#sheetDialog'), sheetForm: $('#sheetForm'),
  sheetMessage: $('#sheetMessage'), syncStatus: $('#syncStatus'), syncNow: $('#syncNow')
};

let filters = { query: '', patient: 'all', specialties: new Set(), district: '', onlineOnly: false, sort: 'number' };
let activeId = null;
let medicalMap = null;
let markersLayer = null;
let usesFallbackMap = false;
let syncPromise = null;
let lastSuccessfulSync = Number(localStorage.getItem(LAST_SYNC_KEY)) || 0;

function normalizeText(value = '') {
  return String(value).toLocaleLowerCase('ru').replace(/ё/g, 'е').replace(/\s+/g, ' ').trim();
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character]);
}

function stableHash(value = '') {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableSourceId(value = '') {
  return `sheet-doctor-${stableHash(value).toString(36)}`;
}

function firstMetro(address = '') {
  const match = String(address).match(/(?:^|[\s—,(])м\.\s*([^;,(]+)/i);
  return match?.[1]?.replace(/\s*\/\s*/g, ' / ').trim() || '';
}

function districtFromLocation(address, lat, lng) {
  const text = normalizeText(address);
  if (/испания/.test(text)) return 'Другой регион';
  if (/московская область|лапино/.test(text)) return 'Подмосковье';
  if (lng < 37.47) return 'Запад';
  if (lng > 37.70) return 'Восток';
  if (lat > 55.79) return 'Север';
  if (lat < 55.69 && lng < 37.61) return 'Юго-запад';
  if (lat < 55.70) return 'Юг';
  return 'Центр';
}

function resolveLocation(address = '', identity = '') {
  const match = LOCATION_HINTS.find(([expression]) => expression.test(address));
  if (match) {
    const [, lat, lng] = match;
    return { lat, lng, district: districtFromLocation(address, lat, lng), approximate: true };
  }
  const text = normalizeText(address);
  if (!text || (!text.includes('москва') && !text.includes('м.'))) return { lat: null, lng: null, district: 'Не указано', approximate: true };
  const hash = stableHash(identity || address);
  const lat = 55.753 + (((hash % 1401) - 700) / 10000);
  const lng = 37.620 + ((((Math.floor(hash / 1401)) % 1801) - 900) / 10000);
  return { lat, lng, district: districtFromLocation(address, lat, lng), approximate: true };
}

function specialtyGroups(record) {
  const primaryText = record.specialty || '';
  const leadText = primaryText.split(/[;,]/)[0];
  const fullText = [record.specialty, record.qualification, record.problems].filter(Boolean).join(' · ');
  const matchingGroups = text => SPECIALTY_RULES.map(([label, expression], order) => {
    const match = text.match(expression);
    return match ? { label, index: match.index ?? 0, order } : null;
  }).filter(Boolean).sort((left, right) => left.index - right.index || left.order - right.order).map(item => item.label);
  let leadGroups = matchingGroups(leadText);
  if (/стомат|ортодонт|гнатолог/i.test(leadText)) leadGroups = ['Стоматология', ...leadGroups.filter(label => label !== 'Стоматология')];
  if (/гинек|акуш/i.test(leadText)) leadGroups = ['Гинекология', ...leadGroups.filter(label => label !== 'Гинекология')];
  const primaryGroups = matchingGroups(primaryText);
  const relatedGroups = matchingGroups(fullText);
  const groups = [...new Set([...leadGroups, ...primaryGroups, ...relatedGroups])];
  if (groups.length) return [...new Set(groups)].slice(0, 5);
  const fallback = String(record.specialty || '').split(/[;,]/)[0].trim();
  return fallback ? [fallback] : ['Другое'];
}

function patientKinds(record) {
  const value = normalizeText(record.patients);
  const kinds = [];
  if (/дет|подрост|ребен/.test(value)) kinds.push('child');
  if (/взрос|18\+|пациентк|только взросл/.test(value)) kinds.push('adult');
  return kinds;
}

function hasConfirmedOnline(record) {
  const value = normalizeText(record.online);
  if (/^да\b/.test(value)) return true;
  if (/не указ|нет\b|уточн|не найден|не отмечен|не подтвержден/.test(value)) return false;
  return /онлайн-консультац|телемедицин/.test(value);
}

function enrichRecord(record, index = 0) {
  const id = record.id || `local-doctor-${Date.now()}-${index}`;
  const resolved = resolveLocation(record.address, `${id}-${record.name}`);
  const lat = Number.isFinite(Number(record.lat)) ? Number(record.lat) : resolved.lat;
  const lng = Number.isFinite(Number(record.lng)) ? Number(record.lng) : resolved.lng;
  const enriched = {
    number: String(record.number || ''),
    name: String(record.name || '').trim(),
    clinics: String(record.clinics || '').trim(),
    address: String(record.address || '').trim(),
    clinicSummary: String(record.clinicSummary || '').trim(),
    experience: String(record.experience || '').trim(),
    degree: String(record.degree || '').trim(),
    qualification: String(record.qualification || '').trim(),
    specialty: String(record.specialty || '').trim(),
    problems: String(record.problems || '').trim(),
    achievements: String(record.achievements || '').trim(),
    patients: String(record.patients || '').trim(),
    phone: String(record.phone || '').trim(),
    price: String(record.price || '').trim(),
    online: String(record.online || '').trim(),
    comments: String(record.comments || '').trim(),
    sources: Array.isArray(record.sources) ? record.sources.filter(Boolean) : String(record.sources || '').split(/\s*;\s*/).filter(Boolean),
    verifiedAt: String(record.verifiedAt || '').trim(),
    id,
    type: 'doctor',
    lat,
    lng,
    metro: record.metro || firstMetro(record.address),
    district: record.district || resolved.district,
    _source: record._source || 'local',
    _localOverride: Boolean(record._localOverride)
  };
  enriched.directions = specialtyGroups(enriched);
  enriched.patientKinds = patientKinds(enriched);
  enriched.hasOnline = hasConfirmedOnline(enriched);
  return enriched;
}

const seedRecords = (Array.isArray(window.DOCTORS_SEED) ? window.DOCTORS_SEED : []).map(enrichRecord);

function loadRecords() {
  try {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(local) || !local.length) return seedRecords;
    return local.map(enrichRecord);
  } catch {
    return seedRecords;
  }
}

let records = loadRecords();

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function deletedSourceIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(DELETED_SOURCE_KEY)) || []);
  } catch {
    return new Set();
  }
}

function rememberDeletedSource(id) {
  const deleted = deletedSourceIds();
  deleted.add(id);
  localStorage.setItem(DELETED_SOURCE_KEY, JSON.stringify([...deleted]));
}

function searchableText(record) {
  return normalizeText([
    record.name, record.clinics, record.address, record.clinicSummary, record.experience,
    record.degree, record.qualification, record.specialty, record.problems, record.achievements,
    record.patients, record.phone, record.price, record.online, record.comments
  ].join(' '));
}

function matches(record) {
  const term = normalizeText(filters.query);
  return (!term || searchableText(record).includes(term))
    && (filters.patient === 'all' || record.patientKinds.includes(filters.patient))
    && (!filters.specialties.size || record.directions.some(direction => filters.specialties.has(direction)))
    && (!filters.district || record.district === filters.district)
    && (!filters.onlineOnly || record.hasOnline);
}

function experienceYears(value = '') {
  const number = Number(String(value).match(/\d{2,4}/)?.[0] || 0);
  if (number >= 1950 && number <= new Date().getFullYear()) return new Date().getFullYear() - number;
  return number;
}

function sortedRecords(list) {
  return [...list].sort((left, right) => {
    if (filters.sort === 'name') return left.name.localeCompare(right.name, 'ru');
    if (filters.sort === 'experience') return experienceYears(right.experience) - experienceYears(left.experience) || left.name.localeCompare(right.name, 'ru');
    return (Number(left.number) || 9999) - (Number(right.number) || 9999);
  });
}

function currentRecords() {
  return sortedRecords(records.filter(matches));
}

function initials(name = '') {
  return name.replace(/\([^)]*\)/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toLocaleUpperCase('ru');
}

function shortPrice(value = '') {
  const match = String(value).match(/(?:от\s*)?\d[\d\s]*(?:[.,]\d+)?\s*₽/i);
  return match?.[0]?.replace(/\s+/g, ' ') || 'цена по запросу';
}

function isMappable(record) {
  return Number.isFinite(Number(record.lat)) && Number.isFinite(Number(record.lng));
}

function displayCoordinates(record) {
  const hash = stableHash(record.id);
  const angle = (hash % 360) * (Math.PI / 180);
  const radius = ((Math.floor(hash / 360) % 5) + 1) * 0.00042;
  return [Number(record.lat) + Math.sin(angle) * radius, Number(record.lng) + Math.cos(angle) * radius];
}

function markerIcon(record) {
  return L.divIcon({
    className: 'medical-map-marker',
    iconSize: [39, 46],
    iconAnchor: [19, 44],
    tooltipAnchor: [0, -38],
    html: `<span class="leaflet-pin ${record.hasOnline ? 'is-online' : ''} ${activeId === record.id ? 'is-active' : ''}"></span>`
  });
}

function initializeMap() {
  if (!window.L) {
    usesFallbackMap = true;
    $('#leafletMap').classList.add('fallback-map');
    return;
  }
  medicalMap = L.map('leafletMap', { zoomControl: false, minZoom: 2, maxZoom: 16, preferCanvas: true }).setView([55.753, 37.62], 10.4);
  L.control.zoom({ position: 'bottomright' }).addTo(medicalMap);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(medicalMap);
  markersLayer = L.layerGroup().addTo(medicalMap);
}

function renderMapMarkers(list) {
  if (usesFallbackMap) {
    const north = 55.98;
    const south = 55.50;
    const west = 37.05;
    const east = 37.95;
    const mappable = list.filter(isMappable).map(record => ({ record, point: displayCoordinates(record) }))
      .filter(({ point }) => point[0] <= north && point[0] >= south && point[1] >= west && point[1] <= east);
    $('#leafletMap').innerHTML = `
      <span class="fallback-label fallback-label-center">Москва</span>
      <span class="fallback-label fallback-label-west">Запад</span>
      <span class="fallback-label fallback-label-east">Восток</span>
      ${mappable.map(({ record, point }) => {
        const top = ((north - point[0]) / (north - south)) * 100;
        const left = ((point[1] - west) / (east - west)) * 100;
        return `<button class="fallback-pin ${record.hasOnline ? 'is-online' : ''} ${activeId === record.id ? 'is-active' : ''}" type="button" data-id="${escapeHtml(record.id)}" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%" aria-label="${escapeHtml(record.name)}" title="${escapeHtml(`${record.name} — ${record.specialty}`)}"><span>${escapeHtml(initials(record.name))}</span></button>`;
      }).join('')}`;
    return;
  }
  if (!markersLayer) return;
  markersLayer.clearLayers();
  list.filter(isMappable).forEach(record => {
    const marker = L.marker(displayCoordinates(record), {
      icon: markerIcon(record), keyboard: true, title: record.name
    });
    marker.bindTooltip(`<strong>${escapeHtml(record.name)}</strong><br>${escapeHtml(record.specialty)}<br><span>${escapeHtml(record.clinics)}</span>`, {
      direction: 'top', offset: [0, -24], className: 'medical-tooltip'
    });
    marker.on('click', () => openDetails(record.id));
    marker.addTo(markersLayer);
  });
}

function renderFilterOptions() {
  const specialties = [...new Set(records.flatMap(record => record.directions).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru'));
  filters.specialties = new Set([...filters.specialties].filter(value => specialties.includes(value)));
  els.specialtyCount.textContent = specialties.length;
  els.specialtyFilters.innerHTML = specialties.map(specialty => `
    <label class="check-item" title="${escapeHtml(specialty)}">
      <input type="checkbox" value="${escapeHtml(specialty)}" ${filters.specialties.has(specialty) ? 'checked' : ''} />
      <span>${escapeHtml(specialty)}</span>
    </label>`).join('');

  const districts = [...new Set(records.map(record => record.district).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru'));
  if (!districts.includes(filters.district)) filters.district = '';
  els.district.innerHTML = '<option value="">Все районы</option>' + districts.map(district =>
    `<option value="${escapeHtml(district)}" ${filters.district === district ? 'selected' : ''}>${escapeHtml(district)}</option>`
  ).join('');
}

function render() {
  const list = currentRecords();
  els.mapCount.textContent = list.length;
  els.resultCount.textContent = list.length;
  const onMoscowMap = list.filter(record => isMappable(record) && Number(record.lat) >= 55.50 && Number(record.lat) <= 55.98 && Number(record.lng) >= 37.05 && Number(record.lng) <= 37.95).length;
  els.empty.innerHTML = list.length ? 'Адрес находится<br />вне карты Москвы' : 'По этим фильтрам<br />ничего не найдено';
  els.empty.hidden = list.length > 0 && onMoscowMap > 0;
  renderMapMarkers(list);
  els.resultList.innerHTML = list.map(record => `
    <button class="result-card ${record.hasOnline ? 'is-online' : ''} ${activeId === record.id ? 'is-active' : ''}" data-id="${escapeHtml(record.id)}" type="button">
      <span class="result-avatar">${escapeHtml(initials(record.name))}</span>
      <span class="result-card-content">
        <h3>${escapeHtml(record.name)}</h3>
        <p>${escapeHtml(record.specialty)}</p>
        <p>${escapeHtml(record.clinics)}${record.metro ? ` · м. ${escapeHtml(record.metro)}` : ''}</p>
        <span class="result-card-meta"><span class="tag">${escapeHtml(record.directions[0] || 'Врач')}</span><span class="price-hint">${escapeHtml(shortPrice(record.price))}</span></span>
      </span>
    </button>`).join('') || '<div class="no-results">Попробуйте изменить фильтры или поисковый запрос.</div>';
}

function renderAll() {
  renderFilterOptions();
  render();
}

function selectRecord(id) {
  activeId = id;
  render();
}

function detailSection(label, value, wide = false) {
  return value ? `<section class="detail-section ${wide ? 'wide' : ''}"><p>${escapeHtml(label)}</p><div>${escapeHtml(value)}</div></section>` : '';
}

function safeHttpUrl(value = '') {
  try {
    const url = new URL(String(value).trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function phoneHref(value = '') {
  const first = String(value).split(/[;,]/)[0].replace(/[^\d+]/g, '');
  return first.length >= 10 ? `tel:${first}` : '';
}

function sourceLabel(url, index) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return `Источник ${index + 1}`;
  }
}

function formatVerifiedDate(value = '') {
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : value;
}

function openDetails(id) {
  const record = records.find(item => item.id === id);
  if (!record) return;
  selectRecord(id);
  $('#detailsEyebrow').textContent = record.verifiedAt ? `Врач · проверено ${formatVerifiedDate(record.verifiedAt)}` : 'Врач';
  $('#detailsTitle').textContent = record.name;
  els.detailsTags.innerHTML = record.directions.map(direction => `<span>${escapeHtml(direction)}</span>`).join('');
  els.detailsSummary.innerHTML = [
    ['Клиника', record.clinics || 'Не указана'],
    ['Стаж', record.experience || 'Не указан'],
    ['Пациенты', record.patients || 'Уточнить']
  ].map(([label, value]) => `<div class="summary-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
  els.detailsContent.innerHTML = [
    detailSection('Специализация', record.specialty, true),
    detailSection('Ключевые направления / проблемы', record.problems, true),
    detailSection('Квалификация', record.qualification),
    detailSection('Учёная степень', record.degree),
    detailSection('Достижения', record.achievements, true),
    detailSection('Адрес / метро', record.address, true),
    detailSection('Стоимость', record.price),
    detailSection('Онлайн-консультация', record.online),
    detailSection('Телефон для записи', record.phone, true),
    detailSection('О клинике', record.clinicSummary, true),
    detailSection('Дополнительный комментарий', record.comments, true)
  ].filter(Boolean).join('') || '<p class="details-empty">Дополнительная информация пока не добавлена.</p>';

  const sourceLinks = record.sources.map(safeHttpUrl).filter(Boolean);
  els.detailsSource.innerHTML = sourceLinks.length
    ? `<span>Источники:</span>${sourceLinks.map((url, index) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(sourceLabel(url, index))} ↗</a>`).join('')}`
    : '<span>Ссылки на источники не указаны.</span>';

  const call = phoneHref(record.phone);
  els.callDoctor.href = call || '#';
  els.callDoctor.classList.toggle('is-hidden', !call);
  els.detailsDialog.showModal();
}

function openEdit(id) {
  const record = records.find(item => item.id === id);
  if (!record) return;
  if (els.detailsDialog.open) els.detailsDialog.close();
  selectRecord(id);
  $('#recordDialogEyebrow').textContent = 'Врач';
  $('#recordDialogTitle').textContent = 'Редактировать карточку';
  $('#recordId').value = record.id;
  ['name', 'clinics', 'specialty', 'address', 'experience', 'patients', 'phone', 'price', 'online', 'problems', 'comments'].forEach(key => {
    $(`#${key}`).value = record[key] ?? '';
  });
  els.deleteButton.hidden = false;
  els.recordDialog.showModal();
}

function openAdd() {
  els.recordForm.reset();
  $('#recordDialogEyebrow').textContent = 'Новый врач';
  $('#recordDialogTitle').textContent = 'Добавить специалиста';
  $('#recordId').value = '';
  els.deleteButton.hidden = true;
  els.recordDialog.showModal();
}

function showToast(text) {
  const toast = $('#toast');
  toast.textContent = text;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 2700);
}

function resetFilters() {
  filters = { query: '', patient: 'all', specialties: new Set(), district: '', onlineOnly: false, sort: filters.sort };
  els.search.value = '';
  els.onlineOnly.checked = false;
  $('#patientFilters').querySelectorAll('button').forEach(button => button.classList.toggle('is-active', button.dataset.patient === 'all'));
  renderAll();
}

$('#patientFilters').addEventListener('click', event => {
  const button = event.target.closest('button[data-patient]');
  if (!button) return;
  filters.patient = button.dataset.patient;
  $('#patientFilters').querySelectorAll('button').forEach(item => item.classList.toggle('is-active', item === button));
  render();
});

els.specialtyFilters.addEventListener('change', event => {
  const input = event.target.closest('input[type="checkbox"]');
  if (!input) return;
  input.checked ? filters.specialties.add(input.value) : filters.specialties.delete(input.value);
  render();
});

els.search.addEventListener('input', () => { filters.query = els.search.value; render(); });
els.district.addEventListener('change', () => { filters.district = els.district.value; render(); });
els.onlineOnly.addEventListener('change', () => { filters.onlineOnly = els.onlineOnly.checked; render(); });
els.sort.addEventListener('change', () => { filters.sort = els.sort.value; render(); });
$('#resetFilters').addEventListener('click', resetFilters);
$('.brand').addEventListener('click', event => { event.preventDefault(); resetFilters(); });
els.resultList.addEventListener('click', event => {
  const card = event.target.closest('[data-id]');
  if (card) openDetails(card.dataset.id);
});

$('#leafletMap').addEventListener('click', event => {
  const marker = event.target.closest('.fallback-pin[data-id]');
  if (marker) openDetails(marker.dataset.id);
});

$('#addRecord').addEventListener('click', openAdd);
$('#openSheetDialog').addEventListener('click', () => {
  els.sheetMessage.textContent = '';
  $('#sheetUrl').value = activeSourceUrl();
  els.sheetDialog.showModal();
});

document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => {
  $(`#${button.dataset.closeDialog}`).close();
}));

$('#editRecord').addEventListener('click', () => { if (activeId) openEdit(activeId); });

els.recordForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(els.recordForm);
  const id = form.get('recordId') || `local-doctor-${Date.now()}`;
  const index = records.findIndex(record => record.id === id);
  const previous = index >= 0 ? records[index] : null;
  const entry = { ...(previous || {}), ...Object.fromEntries(form.entries()), id };
  delete entry.recordId;
  entry.number = previous?.number || String(Math.max(0, ...records.map(record => Number(record.number) || 0)) + 1);
  entry._source = previous?._source || 'local';
  entry._localOverride = previous?._source === 'sheet' || previous?._localOverride || false;
  const enriched = enrichRecord(entry, records.length);
  if (index >= 0) records[index] = enriched;
  else records.unshift(enriched);
  saveRecords();
  activeId = id;
  els.recordDialog.close();
  renderAll();
  showToast(index >= 0 ? 'Карточка сохранена' : 'Врач добавлен');
});

els.deleteButton.addEventListener('click', () => {
  const id = $('#recordId').value;
  const record = records.find(item => item.id === id);
  if (record?._source === 'sheet') rememberDeletedSource(id);
  records = records.filter(item => item.id !== id);
  activeId = null;
  saveRecords();
  els.recordDialog.close();
  renderAll();
  showToast('Карточка удалена');
});

$('#closeResults').addEventListener('click', () => {
  els.resultPanel.classList.add('is-hidden');
  $('#listToggle').classList.remove('is-selected');
});

$('#listToggle').addEventListener('click', () => {
  els.resultPanel.classList.toggle('is-hidden');
  $('#listToggle').classList.toggle('is-selected', !els.resultPanel.classList.contains('is-hidden'));
});

$('#locateButton').addEventListener('click', () => {
  activeId = null;
  render();
  if (medicalMap) medicalMap.setView([55.753, 37.62], 10.4, { animate: true });
  showToast('Карта центрирована на Москве');
});

$('#openSidebar').addEventListener('click', () => $('#sidebar').classList.add('is-open'));
$('#closeSidebar').addEventListener('click', () => $('#sidebar').classList.remove('is-open'));
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
    event.preventDefault();
    els.search.focus();
  }
});

function normalizeHeader(value = '') {
  return String(value).replace(/^\uFEFF/, '').trim().toLocaleLowerCase('ru').replace(/\s+/g, ' ');
}

function googleSheetInfo(raw = '') {
  const url = raw.trim();
  if (!url.includes('docs.google.com/spreadsheets')) return null;
  const id = url.match(/\/d\/([^/]+)/)?.[1];
  if (!id) return null;
  const isOriginalDoctorsSheet = id === SOURCE_SHEET_ID;
  return {
    id,
    gid: isOriginalDoctorsSheet ? FULL_DATA_GID : (url.match(/[?#&]gid=(\d+)/)?.[1] || '0'),
    range: isOriginalDoctorsSheet ? 'A4:R' : ''
  };
}

function googleCsvUrl(raw) {
  const sheet = googleSheetInfo(raw);
  if (!sheet) return raw.trim();
  const params = new URLSearchParams({ tqx: 'out:csv', gid: sheet.gid, headers: '1' });
  if (sheet.range) params.set('range', sheet.range);
  return `https://docs.google.com/spreadsheets/d/${sheet.id}/gviz/tq?${params}`;
}

function googleTableRows(payload) {
  if (payload?.status !== 'ok' || !payload.table) throw new Error('Google Таблица вернула некорректный ответ');
  const headers = payload.table.cols.map(column => normalizeHeader(column.label || column.id || ''));
  return payload.table.rows.map(row => Object.fromEntries(headers.map((header, index) => {
    const cell = row.c?.[index];
    return [header, String(cell?.f ?? cell?.v ?? '').trim()];
  })));
}

function loadGoogleSheet(raw) {
  const sheet = googleSheetInfo(raw);
  if (!sheet) return Promise.reject(new Error('Это не ссылка на Google Таблицу'));
  return new Promise((resolve, reject) => {
    const callbackName = `__medkarta_doctors_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    let settled = false;
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      script.remove();
      delete window[callbackName];
      error ? reject(error) : resolve(value);
    };
    const timer = setTimeout(() => finish(new Error('Google Таблица не ответила вовремя')), 15000);
    window[callbackName] = payload => {
      try { finish(null, googleTableRows(payload)); }
      catch (error) { finish(error); }
    };
    const params = new URLSearchParams({ headers: '1', gid: sheet.gid, tqx: `out:json;responseHandler:${callbackName}`, _: String(Date.now()) });
    if (sheet.range) params.set('range', sheet.range);
    script.src = `https://docs.google.com/spreadsheets/d/${sheet.id}/gviz/tq?${params}`;
    script.async = true;
    script.onerror = () => finish(new Error('Не удалось загрузить Google Таблицу'));
    document.head.append(script);
  });
}

async function loadCsv(raw) {
  const csvUrl = googleCsvUrl(raw);
  const separator = csvUrl.includes('?') ? '&' : '?';
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timeout = setTimeout(() => controller?.abort(), 10000);
  try {
    const request = fetch(`${csvUrl}${separator}_=${Date.now()}`, { cache: 'no-store', signal: controller?.signal });
    const response = controller ? await request : await Promise.race([
      request,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Источник не ответил вовремя')), 10000))
    ]);
    if (!response.ok) throw new Error('Не удалось получить таблицу');
    return parseCsv(await response.text());
  } finally {
    clearTimeout(timeout);
  }
}

async function loadSourceRows(raw) {
  if (googleSheetInfo(raw)) {
    try { return await loadGoogleSheet(raw); }
    catch (jsonpError) {
      try { return await loadCsv(raw); }
      catch { throw jsonpError; }
    }
  }
  return loadCsv(raw);
}

function parseCsv(input) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];
    if (character === '"' && quoted && next === '"') { cell += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && next === '\n') index += 1;
      row.push(cell);
      if (row.some(value => value.trim())) rows.push(row);
      row = [];
      cell = '';
    } else cell += character;
  }
  row.push(cell);
  if (row.some(value => value.trim())) rows.push(row);
  if (rows.length < 2) return [];
  const headers = rows.shift().map(normalizeHeader);
  return rows.map(values => Object.fromEntries(headers.map((header, index) => [header, (values[index] || '').trim()])));
}

function pick(row, ...keys) {
  for (const key of keys) {
    const value = row[normalizeHeader(key)];
    if (value !== undefined && value !== '') return value;
  }
  return '';
}

function normalizeImported(rows) {
  return rows.map((row, index) => {
    const number = pick(row, '№', 'number', 'id');
    const name = pick(row, 'ФИО врача', 'ФИО', 'name');
    const record = {
      id: number ? `doctor-${number}` : stableSourceId(name),
      number,
      name,
      clinics: pick(row, 'Клиника(и)', 'Клиника', 'clinic', 'clinics'),
      address: pick(row, 'Адрес / метро', 'Адрес', 'address'),
      clinicSummary: pick(row, 'Кратко о клинике', 'clinic summary'),
      experience: pick(row, 'Стаж', 'experience'),
      degree: pick(row, 'Учёная степень', 'Ученая степень', 'degree'),
      qualification: pick(row, 'Квалификация', 'qualification'),
      specialty: pick(row, 'Специализация', 'specialty'),
      problems: pick(row, 'Ключевые направления / проблемы', 'Ключевые направления', 'problems', 'services'),
      achievements: pick(row, 'Достижения', 'achievements'),
      patients: pick(row, 'Пациенты', 'patients'),
      phone: pick(row, 'Телефон для записи', 'Телефон', 'phone'),
      price: pick(row, 'Стоимость', 'price'),
      online: pick(row, 'Онлайн-консультация', 'Онлайн консультация', 'online'),
      comments: pick(row, 'Дополнительные комментарии', 'Комментарий', 'comments', 'note'),
      sources: pick(row, 'Источники', 'sources').split(/\s*;\s*/).filter(Boolean),
      verifiedAt: pick(row, 'Карточка', 'Проверено', 'verified at'),
      _source: 'sheet'
    };
    return enrichRecord(record, index);
  }).filter(record => record.name && record.specialty);
}

function mergeSourceRecords(imported) {
  const deleted = deletedSourceIds();
  const localById = new Map(records.map(record => [record.id, record]));
  const localByName = new Map(records.map(record => [normalizeText(record.name), record]));
  const merged = imported.filter(record => !deleted.has(record.id)).map(sourceRecord => {
    const local = localById.get(sourceRecord.id) || localByName.get(normalizeText(sourceRecord.name));
    return local?._localOverride
      ? enrichRecord({ ...sourceRecord, ...local, id: sourceRecord.id, _source: 'sheet', _localOverride: true })
      : sourceRecord;
  });
  const sourceIds = new Set(merged.map(record => record.id));
  const sourceNames = new Set(merged.map(record => normalizeText(record.name)));
  const localOnly = records.filter(record => record._source !== 'sheet' && !sourceIds.has(record.id) && !sourceNames.has(normalizeText(record.name)));
  return [...merged, ...localOnly];
}

function activeSourceUrl() {
  return localStorage.getItem(SOURCE_URL_KEY) || DEFAULT_SOURCE_URL;
}

function setSyncStatus(state, text) {
  els.syncStatus.className = `sync-status is-${state}`;
  els.syncStatus.querySelector('span').textContent = text;
  els.syncNow.classList.toggle('is-spinning', state === 'syncing');
  els.syncNow.disabled = state === 'syncing';
}

function formatSyncTime(timestamp) {
  return new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp));
}

async function syncSourceSheet({ rawUrl = activeSourceUrl(), notify = false } = {}) {
  if (syncPromise) return syncPromise;
  setSyncStatus('syncing', 'Обновляем данные…');
  syncPromise = (async () => {
    const imported = normalizeImported(await loadSourceRows(rawUrl));
    if (!imported.length) throw new Error('В таблице не нашлось карточек врачей');
    records = mergeSourceRecords(imported);
    saveRecords();
    activeId = null;
    renderAll();
    lastSuccessfulSync = Date.now();
    localStorage.setItem(LAST_SYNC_KEY, String(lastSuccessfulSync));
    setSyncStatus('success', `Обновлено в ${formatSyncTime(lastSuccessfulSync)} · ${imported.length} врачей`);
    if (notify) showToast(`Данные обновлены: ${imported.length} врачей`);
    return imported.length;
  })();
  try {
    return await syncPromise;
  } catch (error) {
    const fallback = lastSuccessfulSync
      ? `Последнее обновление в ${formatSyncTime(lastSuccessfulSync)}`
      : `Встроенные данные · ${records.length} врачей`;
    setSyncStatus('error', fallback);
    throw error;
  } finally {
    syncPromise = null;
  }
}

els.sheetForm.addEventListener('submit', async event => {
  event.preventDefault();
  const raw = $('#sheetUrl').value.trim();
  if (!raw) {
    els.sheetMessage.textContent = 'Вставьте ссылку на таблицу или CSV.';
    return;
  }
  const button = $('#importSheet');
  button.disabled = true;
  button.textContent = 'Загружаем…';
  els.sheetMessage.textContent = '';
  try {
    await syncSourceSheet({ rawUrl: raw, notify: true });
    localStorage.setItem(SOURCE_URL_KEY, raw);
    els.sheetDialog.close();
  } catch (error) {
    els.sheetMessage.textContent = `${error.message}. Проверьте доступ по ссылке и заголовки колонок.`;
  } finally {
    button.disabled = false;
    button.textContent = 'Загрузить данные';
  }
});

els.syncNow.addEventListener('click', () => syncSourceSheet({ notify: true }).catch(error => showToast(error.message)));

initializeMap();
renderAll();
$('#sheetUrl').value = activeSourceUrl();
if (lastSuccessfulSync) setSyncStatus('success', `Последнее обновление в ${formatSyncTime(lastSuccessfulSync)}`);
syncSourceSheet().catch(() => {});
setInterval(() => syncSourceSheet().catch(() => {}), SYNC_INTERVAL_MS);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && Date.now() - lastSuccessfulSync > 60000) syncSourceSheet().catch(() => {});
});

window.__MEDKARTA_DOCTORS__ = {
  get records() { return records; },
  get filters() { return filters; },
  sync: syncSourceSheet,
  resetFilters
};
