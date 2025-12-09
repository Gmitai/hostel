const faculty = document.getElementById("faculty");
const specialty = document.getElementById("specialty");
const grade = document.getElementById("grade");
const student = document.getElementById("student");
const building = document.getElementById("building");
const numFloor=document.getElementById("numFloor");
const roomNumber = document.getElementById("roomNumber");
let faculties = []
let specialties = [];

startFill();

async function startFill() {
    faculties = await getData("/faculties");
    await fillSelect(faculty, faculties);
    faculty.dispatchEvent(new Event("change"));
    getData(`/buildings`).then((bd) => fillSelect(building, bd)).then(()=>building.dispatchEvent(new Event("change")));
}


async function fillSelect(select, items) {
    select.innerHTML = "";
    items.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v[Object.keys(v)[0]]
        opt.textContent = v[Object.keys(v)[1]]
        select.appendChild(opt);
    });
}

faculty.addEventListener("change", (e) => {
    const selFaculty = parseInt(e.target.value);
    if (!selFaculty || !faculties.find(f => f.id === selFaculty)) {
        fillSelect(specialty, []);
        fillSelect(grade, []);
        fillSelect(student, []);
        return;
    }
    specialties = getData(`/specialtyByFacId?id=${selFaculty}`).then((sp) => fillSelect(specialty, sp)).then(()=>specialty.dispatchEvent(new CustomEvent('change')));
});
specialty.addEventListener("change", (e) => {
    const selSpecialty = parseInt(e.target.value);
    if (!selSpecialty) {
        fillSelect(grade, []);
        fillSelect(student, []);
        return;
    }
    getData(`/grades?specId=${selSpecialty}`).then((gd) => fillSelect(grade, gd)).then(()=> grade.dispatchEvent(new CustomEvent('change')));
});

grade.addEventListener("change", (e) => {
    const selGrade = parseInt(e.target.value);
    if (!selGrade) {
        fillSelect(student, []);
        return;
    }
    const selSpecialty = specialty.value;
    getData(`/studentsBySpecGrade?specId=${selSpecialty}&gradeId=${selGrade}`).then((std) => fillSelect(student, std));

});

async function getData(url) {
    const response = await fetch(url).then(res => res.json());
    return response[0];
}

building.addEventListener("change", (e) => {
    const selBuilding = parseInt(e.target.value);
    if (!selBuilding) {
        fillSelect(building, []);
        return;
    }
    getData(`/buildings/${selBuilding}`).then((fl) => fillSelect(numFloor, fl)).then(()=>numFloor.dispatchEvent(new CustomEvent('change')));
});

numFloor.addEventListener("change", async (e) => {
    const selFloor = parseInt(numFloor.value);
    const selBuilding = parseInt(building.value);

    if (!selBuilding || !selFloor) {
        fillSelect(roomNumber, []);
        return;
    }
   getData(`/roomsByBuildFloorId?buildId=${selBuilding}&floorId=${selFloor}`).then((rm)=>fillSelect(roomNumber, rm));
});
