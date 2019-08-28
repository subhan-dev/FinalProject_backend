const conn = require('../connection/index');
const router = require('express').Router();

// add category
router.post('/category', (req, res) => {
    const sql = `insert into category set ?`
    const sql2 = `select * from category where id = ?`

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, result.insertId, (err, result2) => {
            if(err) return res.send(err)
            res.send(result2)
        })
    })
})

// edit category
router.patch('/category/:id', (req, res) => {
    const sql = `update category set ? where id = '${req.params.id}'`
    const sql2 = `select nama from category where id = '${req.params.id}'`
    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, (err, result2) => {
            if(err) return res.send(err)

            res.send(result2)
        })
    })
})

// delete category
router.delete('/category/:id', (req, res) => {
    const sql = `delete from category where id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// get category
router.get('/category', (req, res) => {
    const sql = `select * from category`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

module.exports = router