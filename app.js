const express = require('express');
const {urlencoded, json} = require("express");
const app = express();
const mysql=require("mysql2");
const users=[];
const urlencodedParser = express.urlencoded({extended: false});
const connection=mysql.createConnection({
    host: "192.168.31.122",
    user: "admin",
    password: "root",
    database: "hostel"
});

connection.connect(function(err){
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});
app.use(express.static("js"));
app.use(express.static("public"));
app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/registration.html');
});
app.get('/addBuilding', (req, res) => {
    res.sendFile(__dirname + '/public/building.html');
});
app.get('/addRoom', (req, res) => {
    res.sendFile(__dirname + '/public/addRoom.html');
});
app.get('/getBuildings', (req, res) => {
    connection.execute("SELECT id, title FROM buildings where status=1 order by title", (err, results) => {
        res.send(results);
        console.log(results);
    });
})

app.post('/addRoom',urlencodedParser, (req, res) => {
    const buildingNum = req.body.buildingId;
    const roomName = req.body.roomName;
    const placeCount = req.body.placeCount;
    const floorNum = req.body.floor;
    connection.execute(`Select *
                        from rooms
                        WHERE name = '${roomName}'
                          AND buildingId = '${buildingNum}'`, function (err, result) {
        if (result.length > 0) {
            res.sendFile(__dirname + '/public/addRoom.html');
        } else {
            const sql = "INSERT INTO rooms (name, buildingId, floor, placeCount) VALUES (?,?,?,?)";
            connection.query(sql, [roomName, buildingNum, floorNum, placeCount], (err, result) => {
                if (err) console.error(err);
            });
        }
    });
});
app.post('/addBuilding',urlencodedParser, (req, res) => {
    const name= req.body.title;
    connection.execute(`Select * from buildings where title = '${name}'`, function(err, result) {
        if (result.length > 0) {
            res.sendFile(__dirname + '/public/addBuilding.html');
        }
        else {
            const sql="INSERT INTO buildings (title) VALUES (?)";
            connection.query(sql, name, (err, results) =>{
                if(err) console.log(err);

            });
        }
    });

    console.log(req.body.title);
})
app.post('/register', urlencodedParser, (req, res) => {
    console.log(req.body.fullname);
    const fullName=req.body.fullname;
    const birthDay=req.body.birthDate;
    const gender=req.body.gender;
    const phoneNumber=req.body.phone;
    const email=req.body.email;
    const address=req.body.address;
    const lastName = fullName.split(" ")[0];
    const firstName=fullName.split(" ")[1];
    const familyName= fullName.split(" ").length>2?fullName.split(" ")[2]:"";
    const sql = "INSERT INTO commendant(lastName, firstName, familyName, birthDate, gender, mobilePhone, address, email) VALUES(?,?,?,?,?,?,?,?)";

    connection.query(sql,[lastName, firstName, familyName, birthDay, gender, phoneNumber, address, email ],function(err, results) {
        if(err) console.log(err);
        else console.log("Данные добавлены");
    });
    console.log(req.body);
    res.sendFile(__dirname + '/public/registration.html');
})
app.listen(3000, '192.168.31.122', () => {
    console.log('Сервер дар порти 3000 ҷойгир шудааст');
});