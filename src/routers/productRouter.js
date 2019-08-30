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

///////////////////////////////////////////////////// stock



// add stock
router.post('/stock', (req, res) => {
    const sql = `insert into stock set ?`
    const sql2 = `select * from stock where id = ?`

    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, result.insertId, (err, result2) => {
            if(err) return res.send(err)
            res.send(result2)
        })
    })
})

// edit stock
router.patch('/stock/:id', (req, res) => {
    const sql = `update stock set ? where id = '${req.params.id}'`
    const sql2 = `select nama from stock where id = '${req.params.id}'`
    conn.query(sql, req.body, (err, result) => {
        if(err) return res.send(err)

        conn.query(sql2, (err, result2) => {
            if(err) return res.send(err)

            res.send(result2)
        })
    })
})

// delete stock
router.delete('/stock/:id', (req, res) => {
    const sql = `delete from stock where id = '${req.params.id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

// get stock by category
router.get('/stock/:category_id', (req, res) => {
    const sql = `select * from stock where category_id = '${req.params.category_id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

router.get('/stock-product/:product_id', (req, res) => {
    const sql = `select * from stock where product_id = '${req.params.product_id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

router.get('/stock', (req, res) => {
    const sql = `select p.name, p.id as 'idproduct', sz.size_name, s.stock, s.id from stock s join products p on p.id = s.product_id join size sz on sz.id = s.size_id`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})



///////////////////////////////////////////////////// size
// get stock by category
router.get('/size/:category_id', (req, res) => {
    const sql = `select * from size where category_id = '${req.params.category_id}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})

router.get('/size', (req, res) => {
    const sql = `select * from size`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})



module.exports = router