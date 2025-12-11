const build=document.getElementById('buildingList');

getBuildings();

async function getBuildings() {
    const response = await fetch("/buildings");
    const data = await response.json();
    console.log(data[0]);
    let buildings = [];
    data[0].forEach(building => {
        buildings.push(`<option value="${building.id}">${building[Object.keys(building)[1]]}</option>`);
    });
    build.innerHTML = buildings.join("\n");
}

document.getElementById("buildingList").addEventListener('change', (e)=> {
    const value = e.target.value;
    console.log(value);
    let numFloors = [];
    getData(`/buildings/${value}`).then((data) => {
        data.forEach(numFloor => {
            numFloors.push(`<option value="${numFloor.id}">${numFloor.name}</option>`);
        });
    });
    console.log(numFloors);
    document.getElementById('numFloor').innerHTML = numFloors.join('\n');
});