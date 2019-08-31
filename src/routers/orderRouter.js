const conn = require('../connection/index');
const router = require('express').Router();
const upload = require('../helpers/multer')
const fs = require('fs')

// add carts
router.post('/carts', (req, res) => {
    const sql = `insert into carts set ?`
    const sql2 = `select * from carts where id = ?`

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, result.insertId, (err, result2) => {
            if(err) return res.send(err)
            res.send(result2)
        })
    })
})

// edit carts
router.patch('/carts/:id', (req, res) => {
    const sql = `update carts set ? where id = '${req.params.id}'`
    const sql2 = `select * from carts where id = '${req.params.id}'`
    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, (err, result2) => {
            if(err) return res.send(err)

            res.send(result2)
        })
    })
})

// delete carts
router.delete('/carts-del/:id', (req, res) => {
    const sql = `delete from carts where id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})
// delete cart by user id
router.delete('/carts/:id', (req, res) => {
    const sql = `delete from carts where user_id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// get carts
router.get('/carts', (req, res) => {
    const sql = `select * from carts`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//  get carts
router.get('/get-carts/:userid', (req, res) => {
    const sql = `select c.id, name, size_name, price, quantity from carts c join products p on p.id = c.product_id join size s on s.id = c.size_id where user_id = '${req.params.userid}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})
//  get carts for migrate
router.get('/get-carts-migrate/:userid', (req, res) => {
    const sql = `select * from carts c join products p on p.id = c.product_id join size s on s.id = c.size_id where user_id = '${req.params.userid}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})
router.get('/get-cart-user/:userid/:productid/:sizeid', (req, res) => {
    const sql = `select * from carts where user_id = '${req.params.userid}' and product_id = '${req.params.productid}' and size_id = '${req.params.sizeid}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// get BANK
router.get('/bank', (req, res) => {
    const sql = `select * from bank`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// get kurir
router.get('/kurir', (req, res) => {
    const sql = `select * from shipping`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

router.post('/address', (req, res) => {
    const sql = `insert into alamat_pengiriman set ?`
    const sql2 = `select * from alamat_pengiriman where id = ?`

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, result.insertId, (err, result2) => {
            if(err) return res.send(err)
            res.send(result2)
        })
    })
})

router.post('/order', (req, res) => {
    const sql = `insert into orders set ?`
    const sql2 = `select * from orders where id = ?`

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, result.insertId, (err, result2) => {
            if(err) return res.send(err)
            res.send(result2)
        })
    })
})

// GET order user
router.get('/order/:id', (req, res) => {
    const sql = `select * from orders where user_id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})
// get order by id order
router.get('/order/:order_id', (req, res) => {
    const sql = `select * from orders where user_id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})
// get order by id
router.get('/order-byid/:id', (req, res) => {
    const sql = `select * from orders o join shipping s on s.id = o.shipping_id
	    join bank b on b.id = o.bank_id where o.id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})
router.get('/order-byid2/:id', (req, res) => {
    const sql = `select name_bank, total_harga,kurir, norek, penerima, phone, address, city, kode_pos from orders o join shipping s on s.id = o.shipping_id
    join bank b on b.id = o.bank_id join alamat_pengiriman a on a.id = o.alamat_id where o.id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

//post to order detail
router.post('/order-detail', (req, res) => {
    const sql = `INSERT INTO order_detail (product_id, quantity, size_id, order_id) VALUES ?`
    const sql2 = `select * from orders where id = ?`

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)
        res.send(result)
        // conn.query(sql2, result.insertId, (err, result2) => {
        //     if(err) return res.send(err)
        //     res.send(result2)
        // })
    })
})

router.get('/order-detail/:id', (req, res) => {
    const sql = `select * from order_detail o 
	join products p on p.id = o.product_id
	join size s on s.id = o.size_id where order_id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})
// upload bukti transaksi
router.post('/upload-bukti/:id', upload.upstore(upload.photosdir4).single('image'), (req, res) => {
    const sql = `UPDATE orders SET user_upload = '${req.file.filename}', status = 'UPLOAD'
        WHERE id = '${req.params.id}'`

    conn.query(sql, (err, result2) => {
        if(err) return res.send(err)
        res.send({
            message: 'Upload berhasil',
            filename: req.file.filename
        })
    })        
})
router.get('/payment-upload/:imageName', (req, res) => {
    // Letak folder photo
    const options = {
        root: upload.photosdir4
    }

    // Filename / nama photo
    const fileName = req.params.imageName

    res.sendFile(fileName, options, function(err){
        if(err) return res.send(err)
        
    })

})
// get order by user upload not null and payment = false
router.get('/order-user-upload', (req, res) => {
    const sql = `SELECT * FROM orders WHERE user_upload IS NOT NULL and payment_status = false`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})
router.get('/history-transaksi', (req, res) => {
    const sql = `SELECT o.id, order_number, user_upload, order_date, total_harga, username FROM orders o join users u on u.id = o.user_id WHERE user_upload IS NOT NULL and payment_status = true`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})
// decline order
router.delete('/delete-bukti/:id', (req, res) => {
    const sql = `SELECT * FROM orders WHERE id = '${req.params.id}'`
    const sql2 = `UPDATE orders SET user_upload = null, status = 'REJECT' WHERE id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        // nama file
        const fileName = result[0].user_upload

        // alamat file
        const imgpath = upload.photosdir4 + '/' + fileName

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

// acc order
router.patch('/acc-order/:id', (req, res) => {
    const sql = `update orders set payment_status = true, status = 'DONE' WHERE id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

module.exports = router