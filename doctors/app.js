const STORAGE_KEY = 'medkarta-doctors-records-v1';
const DELETED_SOURCE_KEY = 'medkarta-doctors-deleted-source-records';
const CITY_KEY = 'medkarta-doctors-city';
const FACILITY_SOURCE_STATE_KEY = 'medkarta-doctors-facility-source-state-v1';
const CATEGORY_LABELS = { doctor: 'Врач', hospital: 'Стационар', clinic: 'Амбулаторная клиника', laboratory: 'Лаборатория', diagnostic: 'Диагностический центр' };
const CITY_VIEWS = { Москва: { center: [55.753, 37.62], zoom: 10.4 }, Орск: { center: [51.229, 58.474], zoom: 12 } };

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
  sheetMessage: $('#sheetMessage'), syncStatus: $('#syncStatus'), syncNow: $('#syncNow'),
  city: $('#cityFilter'), type: $('#typeFilter'), emergencyOnly: $('#emergencyOnly'),
  facilitySyncStatus: $('#facilitySyncStatus'), resultsNotice: $('#resultsNotice')
};

const requestedCity = new URLSearchParams(window.location.search).get('city');
const initialCity = requestedCity !== null ? requestedCity : (localStorage.getItem(CITY_KEY) ?? 'Москва');
let filters = { query: '', city: ['Москва', 'Орск'].includes(initialCity) ? initialCity : '', type: '', emergencyOnly: false, patient: 'all', specialties: new Set(), district: '', onlineOnly: false, sort: 'number' };
let activeId = null;
let medicalMap = null;
let markersLayer = null;
let usesFallbackMap = false;

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

function resolveLocation(address = '', identity = '', city = 'Москва') {
  if (city !== 'Москва' || /(?:^|[^а-яё])орск(?:$|[^а-яё])/iu.test(address)) return { lat: null, lng: null, district: 'Не указано', approximate: true };
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
  if (Array.isArray(record.patientGroups)) {
    return [...new Set(record.patientGroups.filter(value => value === 'adult' || value === 'child'))];
  }
  const value = normalizeText(record.patients);
  if (record.type === 'facility' || record.category) {
    const confirmedClauses = value.split(/[;\n.]|,\s*(?=(?:дет|реб|новорожд|взросл|женщ))/i).filter(clause =>
      !/уточн|не подтверж|не указ|неизвест|возможност|по запросу|нет данных|не принима|не вед[её]т|не провод|не оказыва|отсутств|без дет|дет[^;]*(?:нет|недоступ)/.test(clause)
    );
    const confirmed = confirmedClauses.join('; ');
    const kinds = [];
    if (/взрос|18\s*(?:\+|лет)|женщин|беременн|рожениц/.test(confirmed)) kinds.push('adult');
    if (/дет|подрост|ребен|новорожден/.test(confirmed)) kinds.push('child');
    return kinds;
  }
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
  if (record.type === 'facility' || record.category) return enrichFacility(record, index);
  const id = record.id || `local-doctor-${Date.now()}-${index}`;
  const city = record.city || 'Москва';
  const resolved = resolveLocation(record.address, `${id}-${record.name}`, city);
  const lat = validCoordinate(record.lat, 90) ? Number(record.lat) : resolved.lat;
  const lng = validCoordinate(record.lng, 180) ? Number(record.lng) : resolved.lng;
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
    patientGroups: Array.isArray(record.patientGroups) ? record.patientGroups.filter(value => value === 'adult' || value === 'child') : undefined,
    phone: String(record.phone || '').trim(),
    price: String(record.price || '').trim(),
    online: String(record.online || '').trim(),
    comments: String(record.comments || '').trim(),
    sources: Array.isArray(record.sources) ? record.sources.filter(Boolean) : String(record.sources || '').split(/\s*;\s*/).filter(Boolean),
    verifiedAt: String(record.verifiedAt || '').trim(),
    id,
    city,
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

function validCoordinate(value, limit) {
  return value !== null && value !== undefined && String(value).trim() !== '' && Number.isFinite(Number(value)) && Math.abs(Number(value)) <= limit;
}

function hasCoordinates(value) {
  return validCoordinate(value?.lat, 90) && validCoordinate(value?.lng, 180);
}

function isMobileService(record) {
  return record.type === 'facility' && (record.mobileService === true || /выездная|по месту вызова/i.test(record.address));
}

function normalizeLocations(locations, fallbackAddress = '') {
  return (Array.isArray(locations) ? locations : []).filter(location => location && typeof location === 'object').map(location => ({
    ...location,
    address: String(location.address || fallbackAddress).trim(),
    lat: validCoordinate(location.lat, 90) ? Number(location.lat) : null,
    lng: validCoordinate(location.lng, 180) ? Number(location.lng) : null,
    source: String(location.source || '').trim(),
    precision: String(location.precision || '').trim(),
    note: String(location.note || '').trim()
  }));
}

function mapLocations(record) {
  if (isMobileService(record)) return [];
  if (record.type === 'facility') {
    const locations = normalizeLocations(record.locations, record.address).filter(hasCoordinates);
    if (locations.length) return locations;
  }
  return hasCoordinates(record) ? [{
    address: record.address || '', lat: Number(record.lat), lng: Number(record.lng),
    source: record.coordinateSource || '', precision: record.coordinatePrecision || '', note: ''
  }] : [];
}

function addressKey(value = '') {
  return normalizeText(value)
    .replace(/(?:г\.?\s*)?орск(?=$|[\s,])/giu, '')
    .replace(/оренбургская\s+область/giu, '')
    .replace(/улица/giu, 'ул')
    .replace(/проспект|пр-т/giu, 'пр')
    .replace(/переулок/giu, 'пер')
    .replace(/корпус/giu, 'корп')
    .replace(/[^а-яa-z0-9]/giu, '');
}

function matchingLocationDonor(record, donor) {
  if (!donor || record.id !== donor.id || record.city !== donor.city || isMobileService(record)) return [];
  const recordAddress = addressKey(record.address);
  if (!recordAddress) return [];
  const points = mapLocations(donor);
  if (recordAddress === addressKey(donor.address)) return points;
  const addresses = new Set(String(record.address).split(/[;\n]/).map(addressKey).filter(Boolean));
  return points.filter(location => addresses.has(addressKey(location.address)));
}

function supplementFacilityLocations(record, donors = []) {
  if (record.type !== 'facility' || isMobileService(record)) return record;
  const fallbackPoints = donors.flatMap(donor => matchingLocationDonor(record, donor));
  const points = mapLocations(record);
  // A legacy single pin refers to the first address. Preserve its coordinates
  // while allowing a newer multi-address snapshot to contribute other branches.
  if (!normalizeLocations(record.locations, record.address).some(hasCoordinates) && points.length && fallbackPoints.length) {
    points[0] = { ...points[0], address: fallbackPoints[0].address };
  }
  const knownAddresses = new Set(points.map(point => addressKey(point.address)));
  for (const point of fallbackPoints) {
    const key = addressKey(point.address);
    if (knownAddresses.has(key)) continue;
    points.push({ ...point });
    knownAddresses.add(key);
  }
  if (!points.length) return record;
  return { ...record, locations: points, lat: points[0].lat, lng: points[0].lng };
}

function textList(value) {
  return (Array.isArray(value) ? value : String(value || '').split(/[;\n]/)).map(item => String(item).trim()).filter(Boolean);
}

function facilityCategory(value = '') {
  if (Object.hasOwn(CATEGORY_LABELS, value) && value !== 'doctor') return value;
  const text = normalizeText(value);
  if (/стационар|больниц|перинатальн|роддом|hospital/.test(text)) return 'hospital';
  if (/лаборатор|laborator/.test(text)) return 'laboratory';
  if (/диагност|diagnost/.test(text)) return 'diagnostic';
  return 'clinic';
}

function enrichFacility(record, index = 0) {
  const specialties = textList(record.specialties);
  const diagnostics = textList(record.diagnostics);
  const category = facilityCategory(record.category);
  const categoryLabel = record.categoryLabel || (Object.hasOwn(CATEGORY_LABELS, record.category) ? CATEGORY_LABELS[category] : String(record.category || CATEGORY_LABELS[category]));
  const enriched = {
    ...record,
    id: record.id || `orsk-${stableHash(`${record.name}-${record.address}-${index}`).toString(36)}`,
    type: 'facility', city: String(record.city || 'Орск'), category, categoryLabel,
    name: String(record.name || '').trim(), address: String(record.address || '').trim(),
    phone: String(record.phone || '').trim(), hours: String(record.hours || '').trim(),
    patients: String(record.patients || '').trim(), access: String(record.access || '').trim(),
    website: String(record.website || '').trim(), notes: String(record.notes || '').trim(),
    emergency24h: record.emergency24h === true || /^(?:да|true)$/i.test(String(record.emergency24h || '').trim()),
    emergencyDetails: String(record.emergencyDetails || '').trim(),
    specialties, diagnostics, sources: textList(record.sources),
    verifiedAt: String(record.verifiedAt || '').trim(),
    timezone: String(record.timezone || 'Asia/Yekaterinburg (UTC+5)'),
    lat: validCoordinate(record.lat, 90) ? Number(record.lat) : null,
    lng: validCoordinate(record.lng, 180) ? Number(record.lng) : null,
    locations: normalizeLocations(record.locations, record.address),
    district: record.district || 'Не указано', metro: '',
    specialty: [...specialties, ...diagnostics].join(' · '), clinics: categoryLabel,
    directions: [...new Set([...specialties, ...diagnostics, ...diagnostics.filter(value => /^МРТ(?=$|[\s.,:;/()-])/iu.test(value)).map(() => 'МРТ')])], hasOnline: false,
    _source: record._source || 'orsk-snapshot', _localOverride: Boolean(record._localOverride)
  };
  enriched.patientKinds = patientKinds(enriched);
  return enriched;
}

const doctorSeedRecords = (Array.isArray(window.DOCTORS_SEED) ? window.DOCTORS_SEED : []).map(enrichRecord);
const facilitySeedRecords = (Array.isArray(window.ORSK_FACILITIES) ? window.ORSK_FACILITIES : []).map(enrichFacility);
const facilitySeedById = new Map(facilitySeedRecords.map(record => [record.id, record]));
const seedRecords = [...doctorSeedRecords, ...facilitySeedRecords];

function authoritativeFacilityIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(FACILITY_SOURCE_STATE_KEY));
    return Array.isArray(saved?.ids) ? new Set(saved.ids) : null;
  } catch { return null; }
}

function mergeFacilitySnapshot(local) {
  const deleted = deletedSourceIds();
  const authoritativeIds = authoritativeFacilityIds();
  const keep = record => record.type !== 'facility' || !authoritativeIds || authoritativeIds.has(record.id) || record._source === 'local' || record._localOverride;
  const existing = new Map(local.filter(keep).map(record => [record.id, record]));
  facilitySeedRecords.forEach(record => {
    if (deleted.has(record.id) || (authoritativeIds && !authoritativeIds.has(record.id))) return;
    const cached = existing.get(record.id);
    // Refresh bundled data even for same-day corrections. Successfully synced
    // source rows and local edits keep priority over the bundled snapshot.
    if (!cached || (!cached._localOverride && cached._source === 'orsk-snapshot' && record.verifiedAt >= (cached.verifiedAt || ''))) existing.set(record.id, record);
  });
  return [...existing.values()].filter(record => !deleted.has(record.id)).map(record =>
    supplementFacilityLocations(record, [facilitySeedById.get(record.id)])
  );
}

function loadRecords() {
  let cached = [];
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) cached = saved.map(enrichRecord);
  } catch {}
  const deleted = deletedSourceIds();
  const byId = new Map(cached.map(record => [record.id, record]));
  const bundledIds = new Set(seedRecords.map(record => record.id));
  const bundled = seedRecords.filter(record => !deleted.has(record.id)).map(record => {
    const local = byId.get(record.id);
    const current = local?._localOverride || local?._source === 'local'
      ? enrichRecord({ ...record, ...local }) : record;
    return supplementFacilityLocations(current, [facilitySeedById.get(record.id)]);
  });
  const personal = cached.filter(record => !bundledIds.has(record.id) && !deleted.has(record.id)
    && (record._source === 'local' || record._localOverride));
  return [...bundled, ...personal];
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
    record.patients, record.phone, record.price, record.online, record.comments,
    record.city, record.category, record.categoryLabel, record.specialties?.join(' '), record.diagnostics?.join(' '),
    record.hours, record.access, record.emergencyDetails, record.notes, record.locations?.map(location => location.address).join(' ')
  ].join(' '));
}

function matches(record) {
  const term = normalizeText(filters.query);
  return (!term || searchableText(record).includes(term))
    && (!filters.city || record.city === filters.city)
    && (!filters.type || (record.type === 'doctor' ? filters.type === 'doctor' : record.category === filters.type))
    && (!filters.emergencyOnly || record.emergency24h === true)
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
  return mapLocations(record).length > 0;
}

function displayCoordinates(record, location = mapLocations(record)[0]) {
  if (record.type === 'facility') return [Number(location.lat), Number(location.lng)];
  const hash = stableHash(record.id);
  const angle = (hash % 360) * (Math.PI / 180);
  const radius = ((Math.floor(hash / 360) % 5) + 1) * 0.00042;
  return [Number(record.lat) + Math.sin(angle) * radius, Number(record.lng) + Math.cos(angle) * radius];
}

function mapEntries(list) {
  return list.flatMap(record => mapLocations(record).map(location => ({ record, location, point: displayCoordinates(record, location) })));
}

function markerIcon(record, sharedCount = 1) {
  return L.divIcon({
    className: 'medical-map-marker',
    iconSize: [39, 46],
    iconAnchor: [19, 44],
    tooltipAnchor: [0, -38],
    html: `<span class="leaflet-pin ${record.hasOnline ? 'is-online' : ''} ${activeId === record.id ? 'is-active' : ''}">${sharedCount > 1 ? `<b style="position:absolute;top:-7px;right:-7px;min-width:17px;padding:2px;border-radius:12px;background:#fff;color:#0f6850;font:700 10px Arial;text-align:center;transform:rotate(45deg)">${sharedCount}</b>` : ''}</span>`
  });
}

function initializeMap() {
  if (!window.L) {
    usesFallbackMap = true;
    $('#leafletMap').classList.add('fallback-map');
    return;
  }
  const view = CITY_VIEWS[filters.city] || { center: [53.6, 47.5], zoom: 5 };
  medicalMap = L.map('leafletMap', { zoomControl: false, minZoom: 2, maxZoom: 16, preferCanvas: true }).setView(view.center, view.zoom);
  L.control.zoom({ position: 'bottomright' }).addTo(medicalMap);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(medicalMap);
  markersLayer = L.layerGroup().addTo(medicalMap);
}

function renderMapMarkers(list) {
  const entries = mapEntries(list);
  if (usesFallbackMap) {
    const [south, north, west, east] = filters.city === 'Орск' ? [51.10, 51.36, 58.30, 58.70] : filters.city === 'Москва' ? [55.50, 55.98, 37.05, 37.95] : [50, 57, 36, 60];
    const mappable = entries
      .filter(({ point }) => point[0] <= north && point[0] >= south && point[1] >= west && point[1] <= east);
    $('#leafletMap').innerHTML = `
      <span class="fallback-label fallback-label-center">${escapeHtml(filters.city || 'Москва и Орск')}</span>
      <span class="fallback-label fallback-label-west">Запад</span>
      <span class="fallback-label fallback-label-east">Восток</span>
      ${mappable.map(({ record, location, point }) => {
        const top = ((north - point[0]) / (north - south)) * 100;
        const left = ((point[1] - west) / (east - west)) * 100;
        return `<button class="fallback-pin ${record.hasOnline ? 'is-online' : ''} ${activeId === record.id ? 'is-active' : ''}" type="button" data-id="${escapeHtml(record.id)}" data-address="${escapeHtml(location.address)}" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%" aria-label="${escapeHtml(`${record.name} — ${location.address}`)}" title="${escapeHtml(`${record.name} — ${location.address}`)}"><span>${escapeHtml(initials(record.name))}</span></button>`;
      }).join('')}`;
    return;
  }
  if (!markersLayer) return;
  markersLayer.clearLayers();
  entries.forEach(({ record, location, point }) => {
    const coincidentCount = entries.filter(entry => Math.abs(entry.point[0] - point[0]) < 0.000001 && Math.abs(entry.point[1] - point[1]) < 0.000001).length;
    const marker = L.marker(point, {
      icon: markerIcon(record, coincidentCount), keyboard: true, title: `${record.name} — ${location.address}`
    });
    marker.bindTooltip(`<strong>${escapeHtml(record.name)}</strong><br>${escapeHtml(location.address)}<br><span>${escapeHtml(record.type === 'facility' ? record.categoryLabel : record.specialty)}</span>`, {
      direction: 'top', offset: [0, -24], className: 'medical-tooltip'
    });
    marker.on('click', () => {
      const choices = overlappingMapEntries(entries, point);
      if (choices.length > 1) {
        marker.bindPopup(`<strong>Учреждения рядом — выберите адрес</strong>${choices.map(choice => `<button type="button" class="edit-button" style="display:block;width:100%;margin-top:8px;text-align:left" data-map-choice="${escapeHtml(choice.record.id)}" data-address="${escapeHtml(choice.location.address)}">${escapeHtml(choice.record.name)}<br><small>${escapeHtml(choice.location.address)}</small></button>`).join('')}`, { maxWidth: 340 }).openPopup();
      } else openDetails(record.id, location.address);
    });
    marker.addTo(markersLayer);
  });
}

function overlappingMapEntries(entries, point) {
  if (!medicalMap?.latLngToContainerPoint) return entries.filter(entry => entry.point[0] === point[0] && entry.point[1] === point[1]);
  const origin = medicalMap.latLngToContainerPoint(point);
  return entries.filter(entry => {
    const candidate = medicalMap.latLngToContainerPoint(entry.point);
    return Math.hypot(candidate.x - origin.x, candidate.y - origin.y) <= 30;
  });
}

function renderFilterOptions() {
  const scoped = records.filter(record => (!filters.city || record.city === filters.city) && (!filters.type || (record.type === 'doctor' ? filters.type === 'doctor' : record.category === filters.type)));
  const specialties = [...new Set(scoped.flatMap(record => record.directions).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru'));
  filters.specialties = new Set([...filters.specialties].filter(value => specialties.includes(value)));
  els.specialtyCount.textContent = specialties.length;
  els.specialtyFilters.innerHTML = specialties.map(specialty => `
    <label class="check-item" title="${escapeHtml(specialty)}">
      <input type="checkbox" value="${escapeHtml(specialty)}" ${filters.specialties.has(specialty) ? 'checked' : ''} />
      <span>${escapeHtml(specialty)}</span>
    </label>`).join('');

  const districts = [...new Set(scoped.map(record => record.district).filter(value => value && value !== 'Не указано'))].sort((a, b) => a.localeCompare(b, 'ru'));
  if (!districts.includes(filters.district)) filters.district = '';
  els.district.innerHTML = '<option value="">Все районы</option>' + districts.map(district =>
    `<option value="${escapeHtml(district)}" ${filters.district === district ? 'selected' : ''}>${escapeHtml(district)}</option>`
  ).join('');
  els.district.disabled = !districts.length;
  els.city.value = filters.city;
  els.type.value = filters.type;
  $('#cityEyebrow').textContent = filters.city || 'Москва и Орск';
  $('#mapTitle').textContent = filters.city ? `Врачи и клиники · ${filters.city}` : 'Врачи и клиники';
  $('#emergencyHelp').hidden = filters.city === 'Москва' && !filters.emergencyOnly;
}

function render() {
  const list = currentRecords();
  const entries = mapEntries(list);
  els.mapCount.textContent = entries.length;
  els.mapCount.title = `Адресов на карте: ${entries.length} · записей в списке: ${list.length}`;
  els.resultCount.textContent = list.length;
  const onMap = list.filter(isMappable).length;
  const mobileCount = list.filter(isMobileService).length;
  const withoutCoordinates = list.length - onMap - mobileCount;
  els.empty.innerHTML = list.length ? (mobileCount === list.length ? 'Выездная помощь: вызов по 103 или 112.<br />Адреса самостоятельного приёма нет.' : 'Координаты ещё не проверены.<br />Откройте адрес на карте<br />из карточки учреждения.') : 'По этим фильтрам<br />ничего не найдено';
  els.empty.hidden = list.length > 0 && onMap > 0;
  const facilitiesOnMap = list.filter(record => record.type === 'facility' && isMappable(record)).length;
  const facilityAddresses = entries.filter(({ record }) => record.type === 'facility').length;
  const notices = [];
  if (facilitiesOnMap) notices.push(`Учреждений на карте: ${facilitiesOnMap} · адресов: ${facilityAddresses}.`);
  if (mobileCount) notices.push(`Выездная помощь: ${mobileCount}.`);
  if (withoutCoordinates) notices.push(`${withoutCoordinates} записей без проверенных координат; ссылка на адрес есть в карточке.`);
  els.resultsNotice.hidden = !notices.length;
  els.resultsNotice.textContent = notices.join(' ');
  $('#mapNote').textContent = usesFallbackMap ? 'Карта недоступна: показана условная схема' : filters.city === 'Орск' ? 'Адреса учреждений Орска · местное время UTC+5' : 'Маркеры врачей ориентировочные; первый адрес приёма';
  renderMapMarkers(list);
  els.resultList.innerHTML = list.map(record => record.type === 'facility' ? `
    <button class="result-card facility-card ${activeId === record.id ? 'is-active' : ''}" data-id="${escapeHtml(record.id)}" type="button">
      <span class="result-avatar facility-avatar">${record.category === 'laboratory' ? 'Л' : record.category === 'hospital' ? '+' : 'К'}</span>
      <span class="result-card-content">
        <span class="facility-card-kind">${escapeHtml(record.city)} · ${escapeHtml(record.categoryLabel)}</span>
        <h3>${escapeHtml(record.name)}</h3>
        <p>${escapeHtml(record.address || 'Адрес уточнить')}</p>
        <p class="facility-services">${escapeHtml(record.specialty || 'Услуги уточнить')}</p>
        <p class="facility-hours">${escapeHtml(record.hours || 'Режим уточнить')}</p>
        ${record.phone ? `<p class="facility-phone">${escapeHtml(record.phone)}</p>` : ''}
        <span class="result-card-meta"><span class="tag ${record.emergency24h ? 'tag-emergency' : ''}">${record.emergency24h ? 'Экстренная помощь 24/7' : 'Экстренный приём 24/7 не подтверждён'}</span><span class="verified-hint">${record.verifiedAt ? `Проверено ${escapeHtml(formatVerifiedDate(record.verifiedAt))}` : 'Дата проверки не указана'}</span></span>
      </span>
    </button>` : `
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
  const first = String(value).split(/[;,\n]/)[0];
  const number = first.match(/\+?\d[\d\s()−-]{7,}\d|\b(?:103|112)\b/)?.[0]?.replace(/[^\d+]/g, '');
  return number ? `tel:${number}` : '';
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

function locationDetails(record, selectedAddress = '') {
  if (record.type !== 'facility') return '';
  const locations = mapLocations(record);
  if (!locations.length) return '';
  const precisionLabels = { building: 'здание', entrance: 'вход', address: 'адрес', approximate: 'ориентировочно' };
  return `<section class="detail-section wide"><p>Адреса на карте</p>${locations.map(location => {
    const url = `https://yandex.ru/maps/?pt=${encodeURIComponent(`${location.lng},${location.lat}`)}&z=17&l=map`;
    const source = safeHttpUrl(location.source);
    const metadata = [location.precision ? `Точность: ${precisionLabels[location.precision] || location.precision}` : '', location.verifiedAt ? `Проверено: ${formatVerifiedDate(location.verifiedAt)}` : '', location.note].filter(Boolean).join('. ');
    return `<div>${selectedAddress === location.address ? '<strong>Выбранная точка: </strong>' : ''}<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(location.address)} ↗</a>${metadata ? `<br><small>${escapeHtml(metadata)}</small>` : ''}${source ? `<br><small><a href="${escapeHtml(source)}" target="_blank" rel="noreferrer">Источник положения ↗</a></small>` : ''}</div>`;
  }).join('<br>')}</section>`;
}

function openDetails(id, selectedAddress = '') {
  const record = records.find(item => item.id === id);
  if (!record) return;
  selectRecord(id);
  const label = record.type === 'facility' ? record.categoryLabel : 'Врач';
  $('#detailsEyebrow').textContent = `${record.city} · ${label}${record.verifiedAt ? ` · проверено ${formatVerifiedDate(record.verifiedAt)}` : ''}`;
  $('#detailsTitle').textContent = record.name;
  els.detailsTags.innerHTML = record.directions.map(direction => `<span>${escapeHtml(direction)}</span>`).join('');
  const summary = record.type === 'facility' ? [
    ['Режим работы', record.hours || 'Уточнить'],
    ['Экстренная помощь 24/7', record.emergency24h ? 'Подтверждена по указанному профилю' : 'Не подтверждена'],
    ['Пациенты', record.patients || 'Уточнить']
  ] : [
    ['Клиника', record.clinics || 'Не указана'],
    ['Стаж', record.experience || 'Не указан'],
    ['Пациенты', record.patients || 'Уточнить']
  ];
  els.detailsSummary.innerHTML = summary.map(([label, value]) => `<div class="summary-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join('');
  const sections = record.type === 'facility' ? [
    locationDetails(record, selectedAddress),
    detailSection('Условия круглосуточной помощи', record.emergencyDetails || (record.emergency24h ? 'Профиль и порядок обращения уточните по телефону.' : 'Круглосуточный приём не подтверждён источниками.'), true),
    detailSection('Специалисты', record.specialties.join('; '), true),
    detailSection('Диагностика и анализы', record.diagnostics.join('; '), true),
    detailSection('Адрес', record.address, true),
    detailSection('Телефоны / назначение линий', record.phone, true),
    detailSection('Порядок обращения', record.access, true),
    detailSection('Примечания', record.notes, true),
    detailSection('Часовой пояс', record.city === 'Орск' ? 'Режим указан по местному времени Орска: UTC+5 (на 2 часа больше Москвы).' : record.timezone, true)
  ] : [
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
  ];
  const mapLink = record.address && !isMobileService(record) && !(record.type === 'facility' && isMappable(record)) ? `<a href="https://yandex.ru/maps/?text=${encodeURIComponent(`${record.city}, ${record.address}`)}" target="_blank" rel="noreferrer">Адрес на карте ↗</a>` : '';
  const website = safeHttpUrl(record.website);
  const contactLinks = `<div class="detail-contact-links">${mapLink}${website ? `<a href="${escapeHtml(website)}" target="_blank" rel="noreferrer">Сайт учреждения ↗</a>` : ''}</div>`;
  els.detailsContent.innerHTML = sections.filter(Boolean).join('') + contactLinks;

  const sourceLinks = record.sources.map(safeHttpUrl).filter(Boolean).filter(url => !new URL(url).pathname.startsWith('/spreadsheets/'));
  els.detailsSource.innerHTML = sourceLinks.length
    ? `<span>Источники:</span>${sourceLinks.map((url, index) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${escapeHtml(sourceLabel(url, index))} ↗</a>`).join('')}`
    : '<span>Ссылки на источники не указаны.</span>';
  if (record._localOverride) els.detailsSource.innerHTML += '<span class="local-edit-note">Есть изменения, сохранённые в этом браузере.</span>';

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
  const facility = record.type === 'facility';
  prepareRecordForm(facility);
  $('#recordDialogEyebrow').textContent = facility ? record.categoryLabel : 'Врач';
  $('#recordDialogTitle').textContent = 'Редактировать карточку';
  $('#recordId').value = record.id;
  ['name', 'clinics', 'specialty', 'address', 'experience', 'patients', 'phone', 'price', 'online', 'problems', 'comments'].forEach(key => {
    $(`#${key}`).value = record[key] ?? '';
  });
  $('#recordCity').value = record.city;
  if (facility) ['category', 'specialties', 'diagnostics', 'hours', 'access', 'emergency24h', 'emergencyDetails', 'website', 'notes'].forEach(key => {
    $(`#${key}`).value = Array.isArray(record[key]) ? record[key].join('; ') : String(record[key] ?? '');
  });
  els.deleteButton.hidden = false;
  els.recordDialog.showModal();
}

function openAdd() {
  els.recordForm.reset();
  prepareRecordForm(false);
  $('#recordCity').value = filters.city || 'Москва';
  $('#recordDialogEyebrow').textContent = 'Новый врач';
  $('#recordDialogTitle').textContent = 'Добавить специалиста';
  $('#recordId').value = '';
  els.deleteButton.hidden = true;
  els.recordDialog.showModal();
}

function prepareRecordForm(facility) {
  $('#nameLabel').textContent = facility ? 'Название учреждения' : 'ФИО врача';
  for (const [selector, hidden] of [['.doctor-field', facility], ['.facility-field', !facility]]) {
    document.querySelectorAll(selector).forEach(label => {
      label.hidden = hidden;
      label.querySelectorAll('input, select, textarea').forEach(input => { input.disabled = hidden; });
    });
  }
}

function showToast(text) {
  const toast = $('#toast');
  toast.textContent = text;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 2700);
}

function resetFilters() {
  filters = { query: '', city: filters.city, type: '', emergencyOnly: false, patient: 'all', specialties: new Set(), district: '', onlineOnly: false, sort: filters.sort };
  els.search.value = '';
  els.onlineOnly.checked = false;
  els.emergencyOnly.checked = false;
  $('#patientFilters').querySelectorAll('button').forEach(button => button.classList.toggle('is-active', button.dataset.patient === 'all'));
  renderAll();
}

function centerMap() {
  const view = CITY_VIEWS[filters.city] || { center: [53.6, 47.5], zoom: 5 };
  if (medicalMap) {
    medicalMap.stop();
    const points = mapEntries(currentRecords()).map(entry => entry.point);
    if (points.length && typeof medicalMap.fitBounds === 'function') {
      const mobile = window.innerWidth <= 900;
      const panel = els.resultPanel.classList.contains('is-hidden') ? { width: 0, height: 0 } : els.resultPanel.getBoundingClientRect();
      const size = medicalMap.getSize();
      medicalMap.fitBounds(points, {
        animate: false, maxZoom: points.length === 1 ? 15 : 13,
        paddingTopLeft: [24, mobile ? 78 : 90],
        paddingBottomRight: [mobile ? 24 : Math.min(panel.width ? panel.width + 56 : 24, size.x * 0.65), mobile ? Math.min(panel.height ? panel.height + 30 : 40, size.y * 0.6) : 48]
      });
    } else medicalMap.setView(view.center, view.zoom, { animate: false });
  }
}

els.city.addEventListener('change', () => {
  filters.city = els.city.value;
  localStorage.setItem(CITY_KEY, filters.city);
  filters.district = '';
  filters.specialties.clear();
  activeId = null;
  renderAll();
  centerMap();
});
els.type.addEventListener('change', () => { filters.type = els.type.value; renderAll(); });
els.emergencyOnly.addEventListener('change', () => { filters.emergencyOnly = els.emergencyOnly.checked; renderAll(); });

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
  const choice = event.target.closest('[data-map-choice]');
  if (choice) {
    medicalMap?.closePopup();
    openDetails(choice.dataset.mapChoice, choice.dataset.address || '');
    return;
  }
  const marker = event.target.closest('.fallback-pin[data-id]');
  if (marker) openDetails(marker.dataset.id, marker.dataset.address || '');
});

$('#addRecord').addEventListener('click', openAdd);

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
  if (previous?.type === 'facility' && entry.category !== previous.category) delete entry.categoryLabel;
  if (previous?.type === 'facility' && (addressKey(entry.address) !== addressKey(previous.address) || entry.city !== previous.city)) {
    delete entry.lat;
    delete entry.lng;
    delete entry.locations;
  }
  delete entry.recordId;
  entry.number = previous?.number || String(Math.max(0, ...records.map(record => Number(record.number) || 0)) + 1);
  entry._source = previous?._source || 'local';
  entry._localOverride = (previous && previous._source !== 'local') || previous?._localOverride || false;
  const enriched = supplementFacilityLocations(enrichRecord(entry, records.length), [facilitySeedById.get(entry.id)]);
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
  if (record && record._source !== 'local') rememberDeletedSource(id);
  records = records.filter(item => item.id !== id);
  activeId = null;
  saveRecords();
  els.recordDialog.close();
  renderAll();
  showToast('Карточка удалена');
});

$('#closeResults').addEventListener('click', () => {
  els.resultPanel.classList.add('is-hidden');
  $('.map-area').classList.remove('results-visible');
  $('#listToggle').classList.remove('is-selected');
});

$('#listToggle').addEventListener('click', () => {
  els.resultPanel.classList.toggle('is-hidden');
  $('.map-area').classList.toggle('results-visible', !els.resultPanel.classList.contains('is-hidden'));
  $('#listToggle').classList.toggle('is-selected', !els.resultPanel.classList.contains('is-hidden'));
});

$('#locateButton').addEventListener('click', () => {
  activeId = null;
  render();
  centerMap();
  showToast(filters.city ? `Карта: ${filters.city}` : 'Карта: Москва и Орск');
});

$('#openSidebar').addEventListener('click', () => $('#sidebar').classList.add('is-open'));
$('#closeSidebar').addEventListener('click', () => $('#sidebar').classList.remove('is-open'));
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
    event.preventDefault();
    els.search.focus();
  }
});


initializeMap();
renderAll();
centerMap();

window.__MEDKARTA_DOCTORS__ = {
  get records() { return records; },
  get filters() { return filters; },
  snapshot: true,
  resetFilters
};
