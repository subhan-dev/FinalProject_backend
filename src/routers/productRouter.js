const conn = require('../connection/index');
const router = require('express').Router();

const upload = require('../helpers/multer')
// add products
router.post('/products', upload.upstore(upload.photosdir3).single('image'),(req, res) => {
    const sql = `insert into products set ?`
    const sql2 = `select * from products where id = ?`

    const { name, description, price, brand_id, category_id} = req.body

    conn.query(sql, {name: name, description: description, price: price, brand_id: brand_id, category_id: category_id, image: req.file.filename}, (err, result) => {
        if(err) return res.send(err.message)

        conn.query(sql2, result.insertId, (err, result2) => {
            if(err) return res.send(err.message)
            res.send(result2)
        })
    })
})

// edit products
router.patch('/products/:id', upload.upstore(upload.photosdir3).single('image'),(req, res) => {
    const sql = `update products set ? where id = '${req.params.id}'`
    const sql2 = `select * from products where id = '${req.params.id}'`
    
    // console.log(data)
    // if(req.file !== undefined) {
    //     const data = {...req.body, image: req.file.filename}
    //     console.log(data)
    // }
    if(req.file === undefined) {
        conn.query(sql, req.body, (err, result) => {
            if(err) return res.send(err.message)
    
            conn.query(sql2, (err, result2) => {
                if(err) return res.send(err.message)
    
                res.send(result2)
            })
        })
    } else {
        const data = {...req.body, image: req.file.filename}
        conn.query(sql, data, (err, result) => {
            if(err) return res.send(err.message)
    
            conn.query(sql2, (err, result2) => {
                if(err) return res.send(err.message)
    
                res.send(result2)
            })
        })
    }
})

// delete products
router.delete('/products/:id', (req, res) => {
    const sql = `select * from products where id = '${req.params.id}'`
    const sql2 = `delete from products where id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        const fileName = result[0].image
        const imgpath = upload.photosdir3 + '/' + fileName
        
        fs.unlink(imgpath, (err) => {
            if(err) return res.send(err.message)
            
            conn.query(sql2, (err, result2) => {
                if(err) return res.send(err)
        
                res.send(result2)
            })
        })

    })
})

// get products
router.get('/products', (req, res) => {
    const sql = `select * from products`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// get product by id
router.get('/products/:id', (req, res) => {
    const sql = `select * from products where id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

/////////////////////////////////////////////////////



module.exports = router