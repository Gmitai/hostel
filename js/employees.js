document.addEventListener("DOMContentLoaded", () => {

    let showTable = false; // по умолчанию показываем карточки

    const contentEl = document.getElementById("main-content");
    const addContentDiv = document.getElementById("add_content");
    let btnToggle = null;

    // --- создаем кнопку "Все" ---
    /*if(addContentDiv){
        btnToggle = document.createElement("button");
        btnToggle.className = "btn";
        btnToggle.textContent = "";
        btnToggle.style.marginLeft = "10px";
        btnToggle.disabled = true; // по умолчанию неактивна
        btnToggle.addEventListener("click", () => {
            showTable = !showTable; // переключаем вид
            loadEmployees();
        });
        addContentDiv.appendChild(btnToggle);
    }*/

    function updateToggleButton(){
        const activeBtn = document.querySelector('.nav button.active');
        if(btnToggle){
            if(activeBtn && activeBtn.dataset.key === "employees"){
                btnToggle.disabled = false;
                btnToggle.style.opacity = "1";
            } else {
                btnToggle.disabled = true;
                btnToggle.style.opacity = "0.5";
                showTable = false;
            }
        }
    }

    // --- обновляем кнопку при клике на меню ---
    document.querySelectorAll('.nav button').forEach(btn => {
        btn.addEventListener('click', updateToggleButton);
    });

    updateToggleButton(); // при загрузке страницы

    // ----------------------
    function loadEmployees() {
        if(!contentEl) return;

        contentEl.innerHTML = '<div class="loader">Загрузка сотрудников...</div>';

        fetch('/employees')
            .then(res => res.json())
            .then(data => {
                const employees = data[0];
                if(showTable){
                    renderEmployeeTable(employees);
                } else {
                    renderEmployees(employees);
                }
            })
            .catch(err => {
                contentEl.innerHTML = `<p>Ошибка загрузки: ${err}</p>`;
                console.error(err);
            });
    }

    function renderEmployees(list) {
        contentEl.innerHTML = "";
        if(!Array.isArray(list) || list.length === 0){
            contentEl.innerHTML = "<p>Сотрудники не найдены.</p>";
            return;
        }

        const container = document.createElement("div");
        container.className = "products";

        list.forEach(p => {
            const card = document.createElement("div");
            card.className = "card";
            card.style.background = "#fff";

            const img = document.createElement("img");
            img.src = p.image || "default.jpg";
            img.alt = `${p.firstName} ${p.lastName}`;
            card.appendChild(img);

            const h3 = document.createElement("h3");
            h3.textContent = `${p.firstName} ${p.lastName}`;
            card.appendChild(h3);

            const pEl = document.createElement("p");
            pEl.textContent = `Пол: ${p.gender === 1 ? "Мужской" : "Женский"}`;
            card.appendChild(pEl);

            const btnContainer = document.createElement("div");
            btnContainer.style.display = "flex";
            btnContainer.style.justifyContent = "center";
            btnContainer.style.gap = "10px";

            const btnEdit = document.createElement("button");
            btnEdit.className = "btn";
            btnEdit.style.cssText = "width:auto;height:auto;background:#fff;border:none;padding:5px;border-radius:4px;cursor:pointer;";

            const iconRedaktirovat = document.createElement("img");
            iconRedaktirovat.src = "/actionsBtn/Redaktirovat.png";
            iconRedaktirovat.style.cssText = "width:30px;height:30px;object-fit:contain;display:inline-block;margin:auto;";

            btnEdit.appendChild(iconRedaktirovat);
            btnEdit.addEventListener("click", () => editEmployee(p.id));
            btnContainer.appendChild(btnEdit);

            const btnDelete = document.createElement("button");
            btnDelete.className = "btn";
            btnDelete.style.cssText = "width:auto;height:auto;background:#f8f6f6;border:none;padding:5px;border-radius:4px;cursor:pointer;";

            const iconDelete = document.createElement("img");
            iconDelete.src = "/actionsBtn/Delete.png";
            iconDelete.style.cssText = "width:27px;height:27px;object-fit:contain;display:inline-block;margin:auto;";

            btnDelete.appendChild(iconDelete);
            btnDelete.addEventListener("click", () => deleteEmployee(p.id, card));
            btnContainer.appendChild(btnDelete);

            card.appendChild(btnContainer);
            container.appendChild(card);
        });

        contentEl.appendChild(container);
    }

    // ------------------ Таблица с кнопками вместо колонки image ------------------
    function renderEmployeeTable(list){
        contentEl.innerHTML = "";
        if(!Array.isArray(list) || list.length === 0){
            contentEl.innerHTML = "<p>Сотрудники не найдены.</p>";
            return;
        }

        const table = document.createElement("table");
        table.className = "data-table";

        const thead = document.createElement("thead");
        const trHead = document.createElement("tr");
        ["id","firstName","lastName","gender","mobilePhone","email","actions"].forEach(c => { // вместо image - actions
            const th = document.createElement("th");
            th.textContent = c === "actions" ? "Действия" : c;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        list.forEach(p => {
            const tr = document.createElement("tr");

            ["id","firstName","lastName","gender","mobilePhone","email","actions"].forEach(c => {
                const td = document.createElement("td");

                if(c === "gender") {
                    td.textContent = p.gender === 1 ? "Мард" : "Зан";
                } else if(c === "actions") {
                    const btnEdit = document.createElement("button");
                    btnEdit.className = "btn";
                    btnEdit.style.cssText = "width:30px;height:30px;background:#fff;border:none;padding:0;margin-right:5px;cursor:pointer;";
                    const iconEdit = document.createElement("img");
                    iconEdit.src = "/actionsBtn/Redaktirovat.png";
                    iconEdit.style.cssText = "width:100%;height:100%;object-fit:contain;";
                    btnEdit.appendChild(iconEdit);
                    btnEdit.addEventListener("click", () => editEmployee(p.id));

                    const btnDelete = document.createElement("button");
                    btnDelete.className = "btn";
                    btnDelete.style.cssText = "width:30px;height:30px;background:#f8f6f6;border:none;padding:0;cursor:pointer;";
                    const iconDelete = document.createElement("img");
                    iconDelete.src = "/actionsBtn/Delete.png";
                    iconDelete.style.cssText = "width:100%;height:100%;object-fit:contain;";
                    btnDelete.appendChild(iconDelete);
                    btnDelete.addEventListener("click", () => deleteEmployee(p.id, tr));

                    td.appendChild(btnEdit);
                    td.appendChild(btnDelete);
                } else {
                    td.textContent = p[c];
                }

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        contentEl.appendChild(table);
    }

    window.showEmployeeInfo = function(firstName, lastName, gender){
        alert(`Сотрудник: ${firstName} ${lastName}\nПол: ${gender === 1 ? 'Мужской' : 'Женский'}`);
    }

    function editEmployee(id){
        alert(`Редактирование сотрудника с ID: ${id}`);
        showForm(id);
    }

    function deleteEmployee(id, rowElement){
        if(confirm("Вы уверены, что хотите удалить этого сотрудника?")){
            fetch(`/employees/delete/${id}`, {method:"DELETE"})
                .then(res => {
                    if(res.ok){
                        rowElement.remove();
                        alert("Сотрудник удалён!");
                    } else {
                        alert("Ошибка при удалении!");
                    }
                })
                .catch(err => alert("Ошибка сети: "+err));
        }
    }
    window.loadEmployees = loadEmployees;
});
