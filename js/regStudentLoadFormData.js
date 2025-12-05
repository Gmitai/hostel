const faculty = document.getElementById("faculty");
const specialty = document.getElementById("specialty");
const grade = document.getElementById("grade");
const student = document.getElementById("students");

let faculties = []
let specialties = [];
let grades = []

startFill();

async function startFill() {
    faculties = await getData("/faculties");
    await fillSelect(faculty, faculties);
    faculty.dispatchEvent(new CustomEvent('change'));
}


async function fillSelect(select, items) {
    console.log("In fill select");
    console.log(Array.isArray(items));
    select.innerHTML = "";
    items.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v['id'];
        opt.textContent = v['name']
        select.appendChild(opt);
    });
}

faculty.addEventListener("change", (e) => {
    const selFaculty =parseInt(e.target.value);
    console.log('факултетхооо');
    console.log(faculties);
    if (!selFaculty || !faculties.find(f => f.id === selFaculty)) {
        fillSelect(specialty, []);
        fillSelect(grade, []);
        fillSelect(student, []);
        return;
    }
    specialties = getData(`/specialtyByFacId?id=${selFaculty}`).then((sp)=>fillSelect(specialty, sp));

});

specialty.addEventListener("change", (e) => {
    console.log(specialties);
    const selSpecialty = parseInt(e.target.value);
    if (!selSpecialty) {
        fillSelect(grade, []);
        fillSelect(student, []);
        return;
    }
    grades = getData(`/grades?specId=${selSpecialty}`).then((gd)=>fillSelect(grade, gd));
});

grade.addEventListener("change", (e) => {
    const selGrade = e.target.value;
    if (!selGrade || !grades[selGrade]) {
        fillSelect(student, []);
        return;
    }
    const selSpecialty = specialty.value;
    const students = getData(`/studentsBySpecGrade?specId=${selSpecialty}&gradeId=${selGrade}`)
    fillSelect(student, students);
});

async function getData(url) {
    const arr = [];
    const response = await fetch(url).then(res => res.json());
    response[0].forEach(v => {
        arr.push(v);
    })
    console.log("In getData");
    arr.forEach(v => {
        console.log(v['id'], v['name']);
    });
    console.log(Array.isArray(arr));
    return arr;
}