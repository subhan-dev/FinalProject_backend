const conn = require('../connection/index')
const router = require('express').Router()
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')

const mailVerify = require('../helpers/nodemailer')
const upload = require('../helpers/multer')


// UPLOAD AVATAR
router.post('/users/avatar/:uname', upload.upstore(upload.photosdir1).single('avatar'), (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`
    const sql2 = `UPDATE users SET avatar = '${req.file.filename}'
                    WHERE username = '${req.params.uname}'`

    conn.query(sql, req.params.uname, (err, result) => {
        if(err) return res.send(err)

        const user = result[0]

        if(!user) return res.send('User not found')

        conn.query(sql2, (err, result2) => {
            if(err) return res.send(err)

            res.send({
                message: 'Upload berhasil',
                filename: req.file.filename
            })
        })
    })
})

// ACCESS IMAGE
router.get('/users/avatar/:imageName', (req, res) => {
    // Letak folder photo
    const options = {
        root: upload.photosdir1
    }

    // Filename / nama photo
    const fileName = req.params.imageName

    res.sendFile(fileName, options, function(err){
        if(err) return res.send(err)
        
    })

})

// DELETE IMAGE
router.delete('/users/avatar', (req, res)=> {
    const sql = `SELECT * FROM users WHERE username = '${req.body.uname}'`
    const sql2 = `UPDATE users SET avatar = null WHERE username = '${req.body.uname}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        // nama file
        const fileName = result[0].avatar

        // alamat file
        const imgpath = photosdir + '/' + fileName

        // delete image
        fs.unlink(imgpath, (err) => {
            if(err) return res.send(err)

            // ubah jadi null
            conn.query(sql2, (err, result2) => {
                if(err) res.send(err)

                res.send('Delete berhasil')
            })
        })
    })
})


// register user
router.post('/register-user', (req, res) => {
    const sql = `insert into users set ?`
    const sql2 = `select username, fullname, email from users where id = ?`

    if(req.body.username.includes(' ')) return res.send('Username must not contain spaces')

    if(!isEmail(req.body.email)) return res.send('Email is not valid')

    if(req.body.password.length < 6) return res.send('Minimal length character 6')

    req.body.password = bcrypt.hashSync(req.body.password, 8)

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err.message)

        conn.query(sql2, result.insertId, (err, result) => {
            if(err) return res.send(err.message)

            // mailVerify(result[0])
            res.send(result[0])
        })
    })
})

// login user
router.post('/login-user', (req, res) => {
    const sql = `select * from users where email = '${req.body.email}'`
    conn.query(sql, async (err, result) => {
        if(err) return res.send(err.message)
        const user = result[0]
        if(!user) return res.send('User not found')
        // if(!user[0].verified) return res.send("Please verify your email")
        const match = await bcrypt.compare(req.body.password, user.password)
        if(!match) return res.send('Wrong password !!!')
        res.send(user)
    })
})

// get users
router.get('/users/:id', (req, res) => {
    const sql = `select * from users where id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})
// cek regis
router.get('/gett-users/:username/:email', (req, res) => {
    const sql = `SELECT * FROM users WHERE username = '${req.params.username}' OR email = '${req.params.email}'`

    conn.query(sql, (err, result) => {
        // Jika ada error dalam menjalankan query, akan dikirim errornya
        if(err) return res.send(err.sqlMessage)
        res.send(result)
    })
})

// edit user
router.patch('/users/profile/:id', upload.upstore(upload.photosdir1).single('avatar'), (req, res) => {
    const sql = `UPDATE users SET ? WHERE id = '${req.params.id}'`
    const sql2 = `SELECT * FROM users WHERE id = '${req.params.id}'`
    if(!isEmail(req.body.email)) return res.send('Email is not valid')
    if(req.file === undefined) {
        conn.query(sql, req.body, (err, result) => {
            if(err) return res.send(err.message)
    
            conn.query(sql2, (err, result2) => {
                if(err) return res.send(err.message)
    
                res.send(result2)
            })
        })
    } else {
        
        const data = {...req.body, avatar: req.file.filename}
        conn.query(sql, data, (err, result) => {
            if(err) return res.send(err.message)
    
            conn.query(sql2, (err, result2) => {
                if(err) return res.send(err.message)
    
                res.send(result2)
            })
        })
    }
})

// VERIFY USER
router.get('/users/verify', (req, res) => {
    const sql = `UPDATE users SET verified = true 
                WHERE username = '${req.query.uname}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send('<h1>Verifikasi berhasil</h1>')
    })
})

var http = require("https");

var options = {
    "method": "GET",
    "hostname": "api.rajaongkir.com",
    "port": null,
    "path": "/starter/province?id=12",
    "headers": {
        "key": "48a348231181e42436d71f8c8efdd9b1"
    }
};
var http = require("https");
router.get('/get-provinsi', (req, res) => {
    
    
    var options = {
        "method": "GET",
        "hostname": "api.rajaongkir.com",
        "port": null,
        "path": "/starter/province",
        "headers": {
            "key": "48a348231181e42436d71f8c8efdd9b1"
        }
    };
    
    var reqData = http.request(options, function (result) {
        var chunks = [];
    
        result.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        result.on("end", function () {
            var body = Buffer.concat(chunks);
            // var buf = JSON.stringify(body)
            var data = JSON.parse(body.toString())
            // console.log(data.rajaongkir);
            
            res.send(data.rajaongkir)
        });
    });
    
    reqData.end();
})
router.get('/get-city/:provinsi_id', (req, res) => {
    
    
    var options = {
        "method": "GET",
        "hostname": "api.rajaongkir.com",
        "port": null,
        "path": `/starter/city?province=${req.params.provinsi_id}`,
        "headers": {
            "key": "48a348231181e42436d71f8c8efdd9b1"
        }
    };
    
    var reqData = http.request(options, function (result) {
        var chunks = [];
    
        result.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        result.on("end", function () {
            var body = Buffer.concat(chunks);
            // var buf = JSON.stringify(body)
            var data = JSON.parse(body.toString())
            // console.log(data.rajaongkir);
            
            res.send(data.rajaongkir)
        });
    });
    
    reqData.end();
})

var qs = require("querystring");
router.post('/get-cost', (req, res) => {
    
    let lengthContent = 50
    if(req.query.courier === 'tiki') {
        lengthContent = 51
    }

    var options = {
        "method": "POST",
        "hostname": "api.rajaongkir.com",
        "port": null,
        "path": "/starter/cost",
        "headers": {
          "key": "48a348231181e42436d71f8c8efdd9b1",
          "content-type": "application/x-www-form-urlencoded",
          "Content-Length": lengthContent
        }
    };
      
    var reqData = http.request(options, function (result) {
        var chunks = [];
      
        result.on("data", function (chunk) {
            chunks.push(chunk);
        });
      
        result.on("end", function () {
            if(chunks.length > 0) {
                var body = Buffer.concat(chunks);
                // var buf = JSON.stringify(body)
                var data = JSON.parse(body.toString())
                // console.log(data.rajaongkir);
                
                res.send(data.rajaongkir)
            } else {
                res.send('No Available')
            }
        });

    });

    // reqData.write(qs.stringify({origin: '501', destination: '114', weight: 1700, courier: 'jne'}));
    reqData.write(qs.stringify({origin: req.query.origin, destination: req.query.tujuan, weight: req.query.berat, courier: req.query.courier}));
    reqData.end();
})

// var options = {
//     "method": "POST",
//     "hostname": "api.rajaongkir.com",
//     "port": null,
//     "path": "/starter/cost",
//     "headers": {
//         "key": "48a348231181e42436d71f8c8efdd9b1",
//         "content-type": "application/x-www-form-urlencoded",
//         "Content-Length": 51
//     }
// };

// var req = http.request(options, function (res) {
//     var chunks = [];

//     res.on("data", function (chunk) {
//         chunks.push(chunk);
//     });

//     res.on("end", function () {
//         var body = Buffer.concat(chunks);
//         console.log(body.toString());
//     });
// });

// req.write(qs.stringify({origin: '501', destination: '114', weight: 1700, courier: 'tiki'}));
// req.end();

router.post('/review', (req, res) => {
    const sql = `insert into review set ?`
    const sql2 = 'select * from review where id = ?'
    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err.message)

        conn.query(sql2, result.insertId, (err, result) => {
            if(err) return res.send(err.message)

            res.send(result[0])
        })
    })
})

router.get(`/get-review/:id`, (req, res) => {
    const sql = `select fullname, rating, comment, avatar, create_at from review r join users u on u.id = r.user_id where r.product_id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.message)

        res.send(result)
    })
})

router.get(`/get-popularity`, (req, res) => {
    const sql = `select p.id, p.name, p.image, p.price, p.brand_id, count(r.id) as 'review' from products p 
        left join review r on r.product_id = p.id 
        group by p.id order by count(r.id) desc`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err.message)
            res.send(result)
        })
})

router.get(`/get-rating`, (req, res) => {
    const sql = `select p.id, p.name, p.image, p.price, p.brand_id, avg(r.rating) as 'rating' from products p 
        left join review r on r.product_id = p.id 
        group by p.id order by avg(r.rating) desc`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err.message)
            res.send(result)
        })
})

router.get(`/get-newness`, (req, res) => {
    const sql = `select * from products order by create_at desc`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err.message)
            res.send(result)
        })
})
router.get(`/get-pricelow`, (req, res) => {
    const sql = `select * from products order by price`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err.message)
            res.send(result)
        })
})
router.get(`/get-pricehigh`, (req, res) => {
    const sql = `select * from products order by price desc`

        conn.query(sql, (err, result) => {
            if(err) return res.send(err.message)
            res.send(result)
        })
})

module.exports = router