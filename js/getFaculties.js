getFaculties();
getSpecialties(1);
async function getFaculties() {
    const response = await fetch("/faculties");
    const data = await response.json();
    let faculties = [];
    data[0].forEach(faculty => {
        faculties.push(`<option value="${faculty.id}">${faculty['Факултет']}</option>`);
    });
    const select = document.getElementById('faculty');
    select.addEventListener('change', function (event) {
        const value = event.target.value;
        getSpecialties(value);
    });
    document.getElementById("faculty").innerHTML = faculties.join("\n");
}
async function getSpecialties(facId) {
    const res = await fetch(`/specialtyByFacId?id=${facId}`);
    const dat = await res.json();
    let specialties = [];
    dat.forEach(specialty => {
        specialties.push(`<option value="${specialty.id}">${specialty.name}</option>`);
    });
    document.getElementById("specialty").innerHTML = specialties.join("\n");
}
const gradeElements = document.getElementById("course");
const specEl=document.getElementById('specialty');
specEl.addEventListener('change', () => {
    const ev = new Event('change');
    gradeElements.dispatchEvent(ev);
});


gradeElements.addEventListener("change", (e) => {
    const grade = e.target.value;
    const specId=document.getElementById("specialty").value;
    console.log(grade);
    getStudentsBySpecialty(specId, grade);
});


async function getStudentsBySpecialty(specialtyId, grade) {
    const res = await fetch(`/studentsBySpecGrade?specId=${specialtyId}&gradeId=${grade}`);
    const data = await res.json();
    let students = [];
    data.forEach(student => {
        students.push(`<option value="${student.id}">${student.fullName}</option>`);
    });
    document.getElementById("students").innerHTML = students.join("\n");

}


