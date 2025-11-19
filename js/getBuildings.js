getBuildings();

async function getBuildings() {
    const  response =await fetch("/getBuildings");
    const data = await response.json();
    let buildings = [];
    data.forEach(element => {
        buildings.push(`<option value="${element.id}">${element.title}</option>`);
    });
    document.getElementById("buildingList").innerHTML = buildings.join("\n");
    console.log(buildings);
}