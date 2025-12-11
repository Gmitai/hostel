const express = require('express');
const mysql = require('mysql2');
const urlencodedParser = express.urlencoded({extended: false});
const multer = require('multer');
const upload = multer();
let selected_menuId = 0;
const app = express();
app.use(express.static(__dirname + '/Public'));
app.use(express.static(__dirname + '/js'))
app.use(express.static(__dirname + '/css'))
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hostel',
    port: 3306
});
app.get('/', (req, res) => {
    res.sendFile('index.html')
});

app.get('/buildings', (req, res) => {
    selected_menuId = 0;
    connection.execute("Select id, title as 'Номи хобгоҳ', floorCount as 'Миқдори ошёна' from buildings where status=1", (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 0;
        res.send([result, selected_menuId]);
    })
});

app.get('/buildings/:id', (req, res) => {
    selected_menuId = 0;
    const id = parseInt(req.params.id);
    connection.execute(`SELECT floorCount
                        FROM buildings
                        WHERE id = ${id}`, (err, result) => {
        if (err) return console.log(err);
        const floors = [];
        for (let i = 1; i <= result[0]['floorCount']; i++) {
            floors.push({'id': i, 'name': `Ошёнаи ${i}`});
        }
        res.send([floors, selected_menuId]);
    })
});

app.get('/roomsByBuildFloorId', (req, res) => {
    const buildId = parseInt(req.query.buildId);
    const floorId = parseInt(req.query.floorId);
    const params = [buildId, floorId, buildId, floorId];
    const sql = `SELECT a.id, a.name
                 FROM (SELECT r.id, r.name, r.placeCount AS plCount
                       FROM rooms r
                       WHERE r.buildingId = ? AND r.numFloor = ?) a
                          LEFT JOIN (SELECT r.id AS id, COUNT(s.id) AS plCount
                                     FROM rooms r
                                              JOIN students s ON s.roomId = r.id
                                     WHERE s.liveInHostel > 0
                                       AND r.buildingId = ?
                                       AND r.numFloor = ?
                                     GROUP BY r.id, r.name) b ON a.id = b.id
                 WHERE a.plCount - IFNULL(b.plCount, 0) > 0;`;
    connection.execute(sql, params, (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 5;
        res.send([result, selected_menuId]);
    })
});

app.get('/employees', (req, res) => {
    connection.execute("SELECT e.id, Concat(e.lastName,' ', e.firstName, ' ', ifnull(e.familyName, '')) as 'Ному насаб', IF(e.gender>0, 'Мард', 'Зан') as 'Ҷинс', DATE_FORMAT(e.birthDate, '%d.%m.%Y') as 'Санаи таваллуд', e.email as 'Почтаи электронӣ', e.mobilePhone as 'Телефон' FROM employees e WHERE status = 1", (err, result) => {
            if (err) return console.log(err);
            selected_menuId = 1;
            res.send([result, selected_menuId]);
        }
    )
});
app.get('/log_book', (req, res) => {
    connection.execute("Select lb.id, Concat(e.lastName,' ', e.firstName,' ', e.familyName) as 'Комендант', CASE when regType=1 then 'Даромад' when regType=2 then 'Баромад' else 'Ҳодиса' END as 'Ҳодиса',lb.comment AS 'Қайд', DATE_FORMAT(lb.eventDate, '%d.%m.%Y %H:%i:%s') as 'Санаи ҳодиса', DATE_FORMAT(lb.createdAt, '%d.%m.%Y %H:%i:%s') as 'Санаи сабтшуда' from log_book lb JOIN employees e  on lb.commendantId=e.id", (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 2;
        res.send([result, selected_menuId]);
    });
});


app.get('/cities', (req, res) => {
    connection.execute("SELECT title as 'Шаҳр', if(typeOf=1, 'Давлат', 'Шаҳр') as 'Шаҳр/Давлат/Ноҳия' from cities", (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 2;
        res.send([result, selected_menuId]);
    })
});
app.get('/faculties', (req, res) => {
    connection.execute("SELECT id, facultyName as 'Факултет' FROM faculties", (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 3;
        res.send([result, selected_menuId]);

    });
});
app.get('/grades', (req, res) => {
    const specId = parseInt(req.query.specId);
    connection.execute("SELECT DISTINCT course as id, CONCAT('Бахши ', course) as name  FROM `groups` WHERE year=2025 AND status=1 AND specialtyId=? ORDER BY course", [specId], (err, result) => {
        if (err) return console.log(err);
        res.send([result, selected_menuId]);
    })
})
app.get('/department', (req, res) => {
    connection.execute("Select id, name as 'Кафедраҳо' from departments", (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 4;
        res.send([result, selected_menuId]);
    });
});

app.get('/specialtyByFacId', (req, res) => {
    const facId = req.query.id;
    connection.execute(`Select s.id as id, CONCAT(s.code, '-', s.name) as name
                        from specialties s
                                 JOIN departments d
                                 JOIN faculties f ON s.departmentId = d.id AND d.facultyId = f.id
                        where f.id = '${facId}'
                        ORDER BY name`, (err, result) => {
        if (err) return console.log(err);
        res.send([result, selected_menuId]);
    })
});

app.get('/studentsBySpecGrade', (req, res) => {
    const specId = req.query.specId;
    const grade = req.query.gradeId;
    connection.execute("Select s.id as id, CONCAT(s.lastName,' ',s.firstName,' ') as name from students s JOIN `groups` g ON s.groupId=g.id where s.specId=? and g.course=? and g.year=2025 and s.status=2 AND s.liveInHostel=0", [specId, grade], (err, result) => {
        if (err) return console.log(err);
        res.send([result, selected_menuId]);
    })
})

app.get('/rooms', (req, res) => {
    connection.execute("Select r.id, b.title as 'Хобгоҳ', r.numFloor as 'Ошёна', r.name as '№-ҳуҷра', r.placeCount as 'Миқдори ҷой', (r.placeCount-COUNT(s.id)) AS Ҷойи_холӣ  from rooms r join buildings b on r.buildingId=b.id LEFT JOIN students s ON s.roomId=r.id GROUP BY r.id, r.name, b.title, r.numFloor, r.placeCount ORDER BY b.title, r.numFloor, r.name", (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 3;
        res.send([result, selected_menuId]);
    })
});

app.get('/students', (req, res) => {
    connection.execute("Select s.id, Concat(s.lastName,' ',s.firstName,' ') as 'Ному насаб',IF(s.gender = 0, 'Зан', 'Мард') AS 'Ҷинс', b.title AS Бино, r.numFloor AS Ошёна, r.name as 'Ҳуҷра', s.mobilePhone as 'Рақами мобили', s.address as 'Суроға' from students s left join rooms r on s.roomId=r.Id LEFT JOIN buildings b ON b.id=r.buildingId where s.liveInHostel=1", (err, result) => {
        selected_menuId = 4;
        if (err) return console.log(err);

        res.send([result, selected_menuId]);
    })
});
app.get('/duty', (req, res) => {
    connection.execute("Select d.id, b.title AS 'Номи хобгоҳ', Concat(e.lastName,' ', e.firstName,' ', e.familyName) AS 'Навбадор', d.comment AS 'Қайд', DATE_FORMAT(d.fromDate, '%d.%m.%Y %H:%i:%s') AS 'Аз санаи', DATE_FORMAT(d.toDate,'%d.%m.%Y %H:%i:%s') AS 'То санаи' FROM duty d JOIN buildings b ON d.buildingId = b.id JOIN employees e ON d.empId = e.id", (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 5;
        res.send([result, selected_menuId]);
    })
});

app.post('/registerStudent', urlencodedParser, (req, res) => {
    console.log(req.body);
    const studId = req.body.student;
    const roomId = req.body.roomNumber;
    connection.execute("UPDATE students SET roomId=?, liveInHostel=1 WHERE id=?", [roomId, studId], (err, result) => {
        if (err) return console.log(err);

    });
});

app.post('/register', urlencodedParser, (req, res) => {
    console.log(req.body);
    const fullName = req.body.fullName.split(' ');
    const birthDate=req.body.birthDate;
    const phoneNumber=req.body.phone;
    const email=req.body.email;
    const address=req.body.address;
    const lastName=fullName[0].charAt(0).toUpperCase() + fullName[0].substring(1).toLowerCase();
    const firstName=fullName[1].charAt(0).toUpperCase() + fullName[1].substring(1).toLowerCase();
    let familyName=null;
    if (fullName.length>2) {
        familyName=fullName[2].charAt(0).toUpperCase() + fullName[2].substring(1).toLowerCase();
    }

    connection.execute(`SELECT * FROM employees WHERE firstName = '${firstName}' AND lastName='${lastName}'`, function (err, result){
        if(result.length > 0){
            res.sendFile(__dirname + '/public/registration.html');
        }
        else {
            const sql="Insert into employees (firstName, lastName, familyName, birthDate, mobilePhone, email, address) VALUES (?,?,?,?,?,?,?)";
            connection.query(sql, [firstName, lastName, familyName, birthDate, phoneNumber, email, address], (err, result) => {
                if (err) {console.log(err)}
            });
        }
    });

});

app.post('/registerLog', urlencodedParser, (req, res) => {
    const commendantId=req.body.commendant;
    const eventId=req.body.eventType;
    const comment=req.body.comment;
    const eventDate=req.body.eventDate;
    const buildingId=req.body.building;
    connection.execute("Insert into log_book (commendantId, buildingId, regType, comment, eventDate) VALUES (?,?,?,?,?)",[commendantId, buildingId, eventId, comment, eventDate], (err, result) => {
        if (err) return console.log(err);
    });
});

app.post('/dutyAddInfo', upload.none(), (req, res) => {
    const commendantId=req.body.commendant;
    const building=req.body.building;
    const comment=req.body.comment;
    const fromDate=req.body.fromDate;
    const toDate=req.body.toDate;
    connection.execute("Insert into duty (empId, buildingId, comment, fromDate, toDate) VALUES (?,?,?,?,?)",[commendantId, building, comment, fromDate, toDate], (err, result) => {
        if (err) return console.log(err);
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));