const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'v1234567',
    database:'node_crud',
    multipleStatements: true
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set views file
app.set('views',path.join(__dirname,'views'));

//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/',(req, res) => {
    // show all users in database
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'Credit Transfer ',
            users : rows
        });
    });
});


app.get('/add',(req, res) => {
    let sql = "SELECT * FROM transfers";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_add', {
            title : 'Credit Transfer ',
            transfers : rows
        });
    });
});


app.get('/transfer/:userId',(req, res) => {

    let sqlquery1 = "SELECT * FROM users";
    const userId = req.params.userId;
    let sqlquery2 = `Select * from users where id = ${userId}`;

    connection.query(sqlquery2, (err, rows1) => {
      connection.query(sqlquery1, (err, rows) => {
        if(err) throw err;
        res.render('user_transfer', {
            title : 'Credit Transfer ',
            users : rows,
            user:rows1[0]
                
        });
     });
    });
  
});

app.post('/updatecredits',(req, res) => {
    const userId1 = req.body.id1;
    const userId2 = req.body.id2;
 

    let data = {sender: req.body.name1, reciever: req.body.id2, amount: req.body.quantity};    

    var sql = "UPDATE users SET credits = credits - '"+req.body.quantity+"'   WHERE id = "+userId1 ; 
    var sql2 = "UPDATE users SET credits = credits + '"+req.body.quantity+"' WHERE name = "+ "'"+userId2 +"'";
    var sql3 = "INSERT INTO transfers SET ?";
     
    connection.query(sql3, data,(err, results1) => {
    connection.query(sql,(err, results2) => {
    connection.query(sql2,(err, results3) => {
      if(err) throw err;
      res.redirect('/');
    });
  });
});
});



app.get('/view/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from users where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'USER DETAILS',
            user : result[0]
        });
    });
});








// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});
