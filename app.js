const STORAGE_KEY = 'medkarta-records-v1';

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
function sourceClinic(id, name, services, metro, note, district, x, y) {
  const directions = classifyDirections(services);
  return { id:`clinic-${id}`, name, type:'clinic', specialty:directions[0], directions, district, metro, price:'', services, note, x, y };
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
  pins: $('#pinsLayer'), resultList: $('#resultList'), resultCount: $('#resultsCount'), mapCount: $('#mapResultCount'),
  specialtyFilters: $('#specialtyFilters'), specialtyCount: $('#specialtyCount'), district: $('#districtFilter'),
  search: $('#searchInput'), empty: $('#emptyMapState'), resultPanel: $('#resultsPanel'), recordDialog: $('#recordDialog'),
  recordForm: $('#recordForm'), deleteButton: $('#deleteRecord'), toast: $('#toast'), sheetDialog: $('#sheetDialog'), sheetForm: $('#sheetForm'), sheetMessage: $('#sheetMessage')
};

function loadRecords() {
  try { const local = JSON.parse(localStorage.getItem(STORAGE_KEY)); return Array.isArray(local) && local.length ? local : seedRecords; }
  catch { return seedRecords; }
}
function saveRecords() { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
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
  els.pins.innerHTML = list.map(r => `<button class="pin ${r.type} ${activeId === r.id ? 'is-active':''}" data-id="${r.id}" style="left:${Number(r.x)}%;top:${Number(r.y)}%" aria-label="${escapeHtml(r.name)}"><span class="pin-shape">${icon(r.type)}</span><span class="pin-label"><strong>${escapeHtml(r.name)}</strong>${escapeHtml(getDirections(r).join(' · '))} · ${escapeHtml(r.district)}</span></button>`).join('');
  els.resultList.innerHTML = list.map(r => `<button class="result-card ${activeId === r.id ? 'is-active':''}" data-id="${r.id}"><span class="result-type ${r.type}">${icon(r.type)}</span><span class="result-card-content"><h3>${escapeHtml(r.name)}</h3><p>${escapeHtml(getDirections(r).slice(0, 2).join(' · '))} · ${escapeHtml(r.metro || r.district)}</p><span class="tag">${escapeHtml(typeName(r.type))}</span></span></button>`).join('') || '<div class="no-results">Попробуйте изменить фильтры.</div>';
  document.querySelectorAll('[data-id]').forEach(element => element.addEventListener('click', () => openEdit(element.dataset.id)));
}
function selectRecord(id) { activeId = id; render(); }
function openEdit(id) {
  const record = records.find(r => r.id === id); if (!record) return;
  selectRecord(id);
  $('#recordDialogEyebrow').textContent = typeName(record.type);
  $('#recordDialogTitle').textContent = 'Карточка записи';
  $('#recordId').value = record.id;
  ['name','type','specialty','district','metro','price','services','note','x','y'].forEach(key => { $(`#${key}`).value = record[key] ?? ''; });
  els.deleteButton.hidden = false;
  els.recordDialog.showModal();
}
function openAdd() {
  els.recordForm.reset();
  $('#recordDialogEyebrow').textContent = 'Новая карточка'; $('#recordDialogTitle').textContent = 'Добавить запись'; $('#recordId').value = ''; $('#x').value = 50; $('#y').value = 50; els.deleteButton.hidden = true; els.recordDialog.showModal();
}
function showToast(text) { els.toast.textContent = text; els.toast.classList.add('is-visible'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => els.toast.classList.remove('is-visible'), 2600); }
function renderAll() { renderFilterOptions(); render(); }

$('#typeFilters').addEventListener('click', event => { const button = event.target.closest('button[data-type]'); if (!button) return; filters.type = button.dataset.type; $('#typeFilters').querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b === button)); render(); });
els.search.addEventListener('input', () => { filters.query = els.search.value; render(); });
els.district.addEventListener('change', () => { filters.district = els.district.value; render(); });
$('#resetFilters').addEventListener('click', () => { filters = {query:'',type:'all',specialties:new Set(),district:''}; els.search.value=''; $('#typeFilters').querySelectorAll('button').forEach(b=>b.classList.toggle('is-active',b.dataset.type==='all')); renderAll(); });
$('#addRecord').addEventListener('click', openAdd); $('#openSheetDialog').addEventListener('click', () => { els.sheetMessage.textContent=''; $('#sheetUrl').value = localStorage.getItem('medkarta-sheet-url') || ''; els.sheetDialog.showModal(); });
document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => $(`#${button.dataset.closeDialog}`).close()));
els.recordForm.addEventListener('submit', event => { event.preventDefault(); const form = new FormData(els.recordForm); const id = form.get('recordId') || `m-${Date.now()}`; const entry = Object.fromEntries(form.entries()); entry.id=id; entry.x=Number(entry.x);entry.y=Number(entry.y);entry.directions=classifyDirections(`${entry.specialty} ${entry.services}`); const index=records.findIndex(r=>r.id===id); if(index >= 0) records[index]=entry; else records.unshift(entry); saveRecords(); activeId=id; els.recordDialog.close(); renderAll(); showToast(index >= 0 ? 'Карточка сохранена' : 'Карточка добавлена'); });
els.deleteButton.addEventListener('click', () => { const id=$('#recordId').value; records=records.filter(r=>r.id!==id); activeId=null; saveRecords(); els.recordDialog.close(); renderAll(); showToast('Карточка удалена'); });
$('#closeResults').addEventListener('click', () => { els.resultPanel.classList.add('is-hidden'); $('#listToggle').classList.remove('is-selected'); }); $('#listToggle').addEventListener('click', () => { els.resultPanel.classList.toggle('is-hidden'); $('#listToggle').classList.toggle('is-selected', !els.resultPanel.classList.contains('is-hidden')); });
$('#locateButton').addEventListener('click', () => { activeId=null; render(); showToast('Карта центрирована на Москве'); });
$('#openSidebar').addEventListener('click', () => $('#sidebar').classList.add('is-open')); $('#closeSidebar').addEventListener('click', () => $('#sidebar').classList.remove('is-open'));
document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase()==='k') { event.preventDefault(); els.search.focus(); } });

function googleCsvUrl(raw) { const url = raw.trim(); if (!url.includes('docs.google.com/spreadsheets')) return url; const id = url.match(/\/d\/([^/]+)/)?.[1]; if (!id) return url; const gid = url.match(/[?#&]gid=(\d+)/)?.[1] || '0'; return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&gid=${gid}`; }
function parseCsv(input) { const rows=[]; let row=[], cell='', quoted=false; for(let i=0;i<input.length;i++){ const c=input[i], n=input[i+1]; if(c==='"' && quoted && n==='"'){cell+='"';i++;} else if(c==='"'){quoted=!quoted;} else if(c===',' && !quoted){row.push(cell);cell='';} else if((c==='\n' || c==='\r') && !quoted){ if(c==='\r'&&n==='\n')i++;row.push(cell); if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';} else cell+=c; } row.push(cell); if(row.some(v=>v.trim()))rows.push(row); if(rows.length<2)return []; const headers=rows.shift().map(x=>x.trim().toLowerCase()); return rows.map(row=>Object.fromEntries(headers.map((h,i)=>[h,(row[i]||'').trim()]))); }
function sourcePlacement(address = '', index = 0) {
  const value = address.toLocaleLowerCase('ru'); let district='Центр', base=[51, 42];
  if (/кашир|коломен|орехов|бакин|коммунарк/.test(value)) { district='Юг'; base=[52, 72]; }
  else if (/волоколам|боткин|талдом|панфилов|сходнен|селигер/.test(value)) { district='Север'; base=[50, 21]; }
  else if (/первомай|энтузиаст|госпиталь|обуха|лефорт/.test(value)) { district='Восток'; base=[74, 45]; }
  else if (/рублев|лобачев|саляма|молодеж|деловой/.test(value)) { district='Запад'; base=[27, 47]; }
  else if (/островит|опарин|ленинск|вернад/.test(value)) { district='Юго-запад'; base=[38, 65]; }
  return { district, x:base[0] + ((index * 17) % 13) - 6, y:base[1] + ((index * 11) % 11) - 5 };
}
function extractMetro(address = '') { return (address.match(/(?:метро|м\.)\s*([^.,;]+)/i) || [])[1]?.trim() || ''; }
function optionalNumber(value) { return value === '' || value === undefined ? null : Number(value); }
function normalizeImported(rows) {
  const validTypes=['doctor','clinic','research'];
  return rows.map((r,index) => {
    const address=r.address || r['адрес'] || ''; const placement=sourcePlacement(address, index); const services=r.services || r['услуги'] || r['основные направления'] || r.specialty || r['направление'] || '';
    const directions=classifyDirections(services); const x=optionalNumber(r.x); const y=optionalNumber(r.y); const sourceFormat=[r['возраст'],r['уровень учреждения'],r['формат помощи'],r['экстренная госпитализация']==='Да'?'Экстренная госпитализация':'',r['плановая госпитализация']==='Да'?'Плановая госпитализация':''].filter(Boolean).join(' · ');
    return { id:r.id || r[''] || `sheet-${Date.now()}-${index}`, name:r.name || r['фио'] || r['название'] || r['краткое название'] || '', type:validTypes.includes((r.type||'').toLowerCase()) ? r.type.toLowerCase() : (r['краткое название'] ? 'clinic' : 'doctor'), specialty:r.specialty || r['направление'] || directions[0], directions, district:r.district || r['район'] || placement.district, metro:r.metro || r['метро'] || extractMetro(address), price:r.price || r['стоимость'] || '', services, note:r.note || r['комментарий'] || r['общий комментарий'] || sourceFormat, x:Number.isFinite(x) ? x : placement.x, y:Number.isFinite(y) ? y : placement.y };
  }).filter(r=>r.name && r.specialty && r.district && r.x>=0 && r.x<=100 && r.y>=0 && r.y<=100);
}
els.sheetForm.addEventListener('submit', async event => { event.preventDefault(); const raw=$('#sheetUrl').value; if(!raw){els.sheetMessage.textContent='Вставьте ссылку на опубликованный CSV.';return;} const button=$('#importSheet'); button.disabled=true; button.textContent='Загружаем…'; els.sheetMessage.textContent=''; try { const response=await fetch(googleCsvUrl(raw)); if(!response.ok) throw new Error('Не удалось получить файл'); const imported=normalizeImported(parseCsv(await response.text())); if(!imported.length) throw new Error('Не нашлось подходящих строк. Проверьте названия колонок.'); records=imported; saveRecords(); localStorage.setItem('medkarta-sheet-url',raw); activeId=null; els.sheetDialog.close(); renderAll(); showToast(`Загружено карточек: ${imported.length}`); } catch(error) { els.sheetMessage.textContent=`${error.message}. Убедитесь, что именно лист опубликован как CSV и доступен по ссылке.`; } finally { button.disabled=false; button.textContent='Загрузить данные'; } });

renderAll();
