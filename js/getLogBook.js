// Элементы формы
const building = document.getElementById("building");
const commendant = document.getElementById("commendant");
const studentInput = document.getElementById("student");
const studentList = document.getElementById("student-list");

let studentsCache = []; // Для автокомплита

// Стартовая функция
startFill();

async function startFill() {
    // Подгружаем здания
    const buildings = await getData("/buildings");
    fillSelect(building, buildings);

    // Подгружаем комендантов
    const commendants = await getData("/employees");
    fillSelect(commendant, commendants);


}

// Универсальная функция для select
function fillSelect(select, items) {
    select.innerHTML = "";
    items.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v.id || v[Object.keys(v)[0]];
        opt.textContent = v['Ному насаб'] || v[Object.keys(v)[1]];
        select.appendChild(opt);
    });
}

// Получение данных
async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data[0]; // backend возвращает [result, selected_menuId]
}



// Отправка формы — передаем ID студента
/*document.getElementById("eventForm").addEventListener("submit", (e) => {
    if (studentInput.dataset.id) {
        studentInput.value = studentInput.dataset.id; // ID студента
    } else {
        e.preventDefault();
        alert("Лутфан студенти интихоб кунед!");
    }
});*/
