const express = require('express');
const mysql = require('mysql2');
const urlencodedParser = express.urlencoded({extended: false});

const app = express();
app.use(express.static(__dirname + '/Public'));
app.use(express.static(__dirname + '/js'))
app.use(express.static(__dirname + '/css'))
app.use(express.json());

const connection =mysql.createConnection({
host: '192.168.31.122',
user: 'admin',
password: 'root',
database: 'hostel',
port: 3306
});
app.get('/', (req, res) =>{
    res.sendFile('index.html')
});
app.get('/buildings', (req,res) => {
     connection.execute("Select id, title as 'Номи хобгоҳ', floorCount as 'Миқдори ошёна' from buildings where status=1", (err, result) => {
        if(err) return console.log(err);
        res.send(result);
    })
});

app.get('/commendant', (req, res) => {
    connection.execute("Select id, Concat(lastName,' ', firstName, ' ', familyName) as 'Ному насаб', gender, mobilePhone from commendant where status = 1", (err, result) =>{
        if(err) return console.log(err);
        res.send(result);
    })
});
app.get('/employees', (req, res) => {
    connection.execute("Select id, Concat(lastName,' ', firstName, ' ', familyName) as 'Ному насаб', IF(gender = 0, 'Зан', 'Мард') AS 'Ҷинс', mobilePhone as 'Рақами мобили' from employees where status = 1", (err, result) =>{
        if(err) return console.log(err);
        res.send(result);
    })
});
app.get('/rooms', (req,res) => {
    connection.execute("Select r.id,r.name as 'Рақами Ҳуҷра', b.title as 'Хобгоҳ', r.floor as 'Ошёна', r.placeCount as 'Шумораи истиқоматкунандагон' from rooms r left join buildings b on r.buildingId=b.id", (err, result) => {
        if(err) return console.log(err);
        res.send(result);
    })
});
app.get('/students', (req, res) => {
    connection.execute("Select s.id, Concat(s.lastName,' ',s.firstName,' ') as 'Ному насаб',IF(s.gender = 0, 'Зан', 'Мард') AS 'Ҷинс', r.name as 'Хона', s.mobilePhone as 'Рақами мобили', s.address as 'Суроға' from students s left join  rooms r on s.roomId=r.Id", (err, result) => {
        if(err) return console.log(err);
        res.send(result);
    })
});
app.get('/users', (req, res) => {
    connection.execute("Select u.id, Concat(e.lastName,' ', e.firstName,' ', e.familyName) as 'Ному насаб', u.login  as 'Логин' from users u left join employees e on u.empId=e.Id", (err, result) => {
        if(err) return console.log(err);
        res.send(result);
    })
});

// const openLink = document.getElementById('openFormLink');
// const closeBtn = document.getElementById('closeFormBtn');
// const modal = document.getElementById('modalForm');

// closeBtn.onclick = () => modal.style.display = 'none';

// modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));