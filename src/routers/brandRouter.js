const conn = require('../connection/index')
const router = require('express').Router()

const upload = require('../helpers/multer')

// input brand
router.post('/brand', upload.upstore(upload.photosdir2).single('icon'), (req, res) => {
    const sql = `insert into brand set ?`
    const sql2 = `select * from brand where id = ?`

    const {
        brand_name
    } = req.body


    console.log(req)
    conn.query(sql, {brand_name:brand_name , logo:req.file.filename }, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, result.insertId, (err, result) => {
            if(err) return res.send(err)

            res.send(result)
        })
    })
})

// get brand
router.get('/brand/:id', (req, res) => {
    const sql = `select * from brand where id = ?`

    conn.query(sql, req.params.id, (err, result) => {
        if(err) return res.send(err)

        if(!result[0]) return res.send('Brand not found')

        res.send(result)
    })
})

// get all brand
router.get('/brands', (req, res) => {
    const sql = `select * from brand`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// update brand
router.patch('/brand/:id', (req, res) => {
    const sql = `update brand set ? where id = '${req.params.id}'`
    const sql2 = `select * from brand where id = '${req.params.id}'`

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err)

            res.send(result)
        })
    })
})

// delete brand
router.delete('/brand/:id', (req, res) => {
    const sql = `delete from brand where id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// access logo brand
router.get('/brand/logo/:id', (req, res) => {
    // Letak folder photo
    const options = {
        root: photosdir
    }

    res.sendFile(req.params.id, options, function(err){
        if(err) return res.send(err)
        
    })

})

module.exports = router