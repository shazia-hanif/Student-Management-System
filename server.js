const mysql = require('mysql');
const express = require('express'); 
const path = require('path');
const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : 'mysql098',
    database: 'test'
});
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL is connected..!')
});
//middleware used to parse incoming requests with JSON
app.use(express.json());
//middleware used to parse incoming requests with URL-encoded
app.use(express.urlencoded({ extended: true}));
//middleware used to serves static files(HTML, CSS, JavaScript) from a specified directory
app.use(express.static(path.join(__dirname)));

app.get('/data', (req, res) => {
    let selectQuery = "SELECT * FROM Students";
    db.query(selectQuery, function(error, results){
        if (error) throw error;
        res.json(results);
        //console.log(results);
    });
});

app.post('/add-data', (req, res) => {
    const { name, cnic, course, grade, gpa } = req.body;
    let sql = 'INSERT INTO Students (name, cnic, course, grade, gpa) VALUES (? , ?, ?, ?, ?)';
    db.query(sql, [name, cnic, course, grade, gpa], (err, results) => {
        if (err) throw err;
        res.send('Data added successfully');
    });
});

app.delete('/delete-user/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM Students WHERE ID = ?';
    db.query(sql, [id], (err, results) => {
        if (err) throw err;
        res.json( { message: 'User deleted successfully'} );
    });
});

app.put('/update-user/:id', (req, res) => {
    const id = req.params.id;
    const { name, cnic, course, grade, gpa } = req.body;

    // initialize the sql query and parameters
    let sql = 'UPDATE Students SET ';
    let params = [];

    // add fields to update based on provided data
    if(name){
        sql += 'name = ?, ';
        params.push(name);
    }
    if(cnic){
        sql += 'cnic = ?, ';
        params.push(cnic);
    }
    if(course){
        sql += 'course = ?, ';
        params.push(course);
    }
    if(grade){
        sql += 'grade = ?, ';
        params.push(grade);
    }
    if(gpa){
        sql += 'gpa = ?, ';
        params.push(gpa);
    }
    // remove trailing coma and space
    sql = sql.slice(0, -2);
    sql += ' WHERE ID = ?';
    params.push(id);

    db.query(sql, params, (err, result) => {
        if (err){
            console.error('Error executing query:', err);
            res.status(500).json( { message: 'Error updating user'});
            return;
        }
        res.json({ message: 'User updated successfully'});
    });
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
