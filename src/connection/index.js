const mysql = require('mysql')

const conn = mysql.createConnection(
    {
        user: 'root',
        password: '!@ahmadsubhan24',
        host: 'localhost',
        database: 'finalProject',
        port : 3306
    }
)

conn.connect(function (err){
    if(err) throw err;
});


module.exports = conn