getFaculties();
getSpecialties(1);
async function getStudentsBySpec() {
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


