const mysql = require('mysql')
const con = mysql.createConnection({
    host: 'localhost',
    user: 'sethkdee',
    password: 'piseth123',
    database: 'React4kids'
})

con.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
    con.query("CREATE DATABASE React4kids", (err, result) => {
        if (err) throw err;
        console.log(result);
    })
})

