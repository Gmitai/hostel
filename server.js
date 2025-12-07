const express = require('express');
const mysql = require('mysql2');
const urlencodedParser = express.urlencoded({extended: false});
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
    selected_menuId = 0;
    const buildId = parseInt(req.query.buildId);
    const floorId = parseInt(req.query.floorId);
    connection.execute("Select r.id, r.name, (r.placeCount-COUNT(r.id)) AS plCount from rooms r join buildings b on r.buildingId=b.id LEFT JOIN students s ON s.roomId=r.id WHERE s.liveInHostel>0 AND buildingId=? AND numFloor=? GROUP BY r.id, r.name HAVING plCount>0", [buildId, floorId], (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 5;
        console.log(result);
        res.send([result, selected_menuId]);
    })
});

app.get('/employees', (req, res) => {
    connection.execute("SELECT e.id, e.lastName,e.firstName, e.gender, e.birthDate, e.email, e.image, e.mobilePhone FROM employees e WHERE status = 1",(err, result) => {
            if (err) return console.log(err);
            res.send([result, selected_menuId]);
        }
    )
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
        selected_menuId = 6;
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
        selected_menuId = 6;
        res.send([result, selected_menuId]);
    })
});

app.get('/studentsBySpecGrade', (req, res) => {
    const specId = req.query.specId;
    const grade = req.query.gradeId;
    connection.execute("Select s.id as id, CONCAT(s.lastName,' ',s.firstName,' ') as name from students s JOIN `groups` g ON s.groupId=g.id where s.specId=? and g.course=? and g.year=2025 and s.status=2 AND s.liveInHostel=0", [specId, grade], (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 6;
        res.send([result, selected_menuId]);
    })
})

app.get('/rooms', (req, res) => {
    connection.execute("Select r.id, b.title as 'Хобгоҳ', r.name as '№-ҳуҷра', r.numFloor as 'Ошёна', r.placeCount as 'Миқдори ҷой', (r.placeCount-COUNT(r.id)) AS Ҷойи_холӣ  from rooms r join buildings b on r.buildingId=b.id LEFT JOIN students s ON s.roomId=r.id GROUP BY r.id, r.name, b.title, r.numFloor, r.placeCount ORDER BY b.title, r.numFloor, r.name", (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 6;
        res.send([result, selected_menuId]);
    })
});
app.get('/students', (req, res) => {
    connection.execute("Select s.id, Concat(s.lastName,' ',s.firstName,' ') as 'Ному насаб',IF(s.gender = 0, 'Зан', 'Мард') AS 'Ҷинс', r.name as 'Хона', s.mobilePhone as 'Рақами мобили', s.address as 'Суроға' from students s left join  rooms r on s.roomId=r.Id  where s.liveInHostel=1", (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 6;
        res.send([result, selected_menuId]);
    })
});
app.get('/users', (req, res) => {
    connection.execute("Select u.id, Concat(e.lastName,' ', e.firstName,' ', e.familyName) as 'Ному насаб', u.login  as 'Логин' from users u left join employees e on u.empId=e.Id", (err, result) => {
        if (err) return console.log(err);
        selected_menuId = 7;
        res.send([result, selected_menuId]);
    })
});

app.post('/registerStudent', (req, res) => {

})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));