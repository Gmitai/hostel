const nav = document.getElementById('nav');
const contentEl = document.getElementById('main-content');
const titleEl = document.getElementById('page-title');



const TABLES = [
    "buildings",
    "employees",
    "cities",
    "faculties",
    "department",
    "log_book",
    "rooms",
    "students",
    "users"
];

createNav();

// ----------------------
// Создание меню
function createNav() {
    TABLES.forEach(key => {
        const btn = document.createElement('button');
        btn.textContent = humanizeKey(key);
        btn.dataset.key = key;
        btn.addEventListener('click', onNavClick);
        nav.appendChild(btn);
    });

    // Автоматически открываем первый пункт
    const first = nav.querySelector('button');
    if(first) {
        setActive(first);
        loadForKey(first.dataset.key);
    }
}

function humanizeKey(key){
    const map = {
        buildings:'Биноҳо',
        cities:'Шаҳру/Ноҳияҳо',
        employees:'Кормандон',
        faculties:"Факултетҳо",
        department:'Кафедраҳо',
        log_book:'Журнал',
        rooms:'Ҳучраҳо',
        students:'Донишҷӯён',
        users:'Истифодабарандагон'
    };
    return map[key] || key;
}

function onNavClick(e){
    const btn = e.currentTarget;
    setActive(btn);
    const key = btn.dataset.key;
    titleEl.textContent = humanizeKey(key);
    loadForKey(key);
}

function setActive(btn){
    document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ----------------------
// Загрузка данных с сервера
async function loadForKey(key) {
    showLoading();

    try {
        if(key === 'employees') {
            // Вместо таблицы показываем карточки сотрудников
            window.loadEmployees();
            return;
        }

        // Для остальных таблиц рендерим как таблицу
        const res = await fetch(`/${encodeURIComponent(key)}`);
        if(!res.ok) throw new Error(res.statusText || 'Ошибка сети');
        const data = await res.json();
        renderTable(key, data[0]);
        localStorage.setItem('frmId', JSON.stringify(data[1]));
    } catch(err) {
        showError(err);
    }
}



function showLoading(){
    contentEl.innerHTML = '';
    const loaderWrap = document.createElement('div');
    loaderWrap.className = 'placeholder';
    loaderWrap.innerHTML = '<div class="loader" aria-hidden="true"></div><div>Загрузка...</div>';
    contentEl.appendChild(loaderWrap);
}

function showError(err){
    contentEl.innerHTML = `<div class="error">Ошибка при загрузке: ${err.message || err}</div>`;
}

// ----------------------
// Рендер таблицы
function renderTable(key, rows) {
    contentEl.innerHTML = '';
    if (!Array.isArray(rows) || rows.length === 0) {
        contentEl.innerHTML = `<div class="placeholder">Нет данных для таблицы <strong>${key}</strong>.</div>`;
        return;
    }

    const table = document.createElement('table');
    table.className = 'data-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const cols = Object.keys(rows[0]);

    cols.forEach(c => {
        const th = document.createElement('th');
        th.textContent = humanizeKey(c);  // Преобразуем имена колонок в читаемые
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    rows.forEach(r => {
        const tr = document.createElement('tr');

        cols.forEach(c => {
            const td = document.createElement('td');

            // Обработка изображения
            if (c === 'image' && r[c]) {
                const imgPath = r[c]; // Путь из базы данных
                const img = document.createElement('img');

                // Убедимся, что путь начинается с '/' или добавим его
                img.src = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;

                img.style.width = '50px';
                img.style.height = '50px';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                td.appendChild(img);
            } else {
                td.textContent = r[c] === null ? '' : r[c];
            }

            tr.appendChild(td);
        });

        // Кнопка редактирования
        const tdNew = document.createElement('td');
        const button = document.createElement('button');
        button.textContent = 'Tahrir';  // Язык кнопки на таджикском, но если нужен перевод на русский — заменить
        button.addEventListener('click', () => { showForm(0) });
        tdNew.appendChild(button);
        tr.appendChild(tdNew);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    contentEl.appendChild(table);
}

// ----------------------



// === ПЕРЕКЛЮЧАТЕЛЬ ВИДА ДЛЯ СОТРУДНИКОВ ===
let showTable = false; // false = карточки, true = таблица

const toggleBtn = document.getElementById("toggleViewBtn");
toggleBtn.addEventListener("click", () => {
    showTable = !showTable;

    // Меняем текст кнопки
    toggleBtn.textContent = showTable ? "Карточки" : "Все";

    // Проверяем, выбраны ли сотрудники
    const active = document.querySelector('.nav button.active');
    if(active && active.dataset.key === "employees") {
        window.loadEmployees(showTable);
    } else {
        alert("Сначала выберите раздел: Кормандон");
    }
});
