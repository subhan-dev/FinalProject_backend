const conn = require('../connection/index');
const router = require('express').Router();

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
    const sql = `select * from carts c join products p on p.id = c.product_id join size s on s.id = c.size_id where user_id = '${req.params.userid}'`

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
	join size s on s.id = o.size_id where order_id = '${req.params.id}';`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

module.exports = router