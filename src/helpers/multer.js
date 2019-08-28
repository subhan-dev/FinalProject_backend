let multer = require('multer')
const path = require('path')
const rootdir = path.join(__dirname,'/../..')

const photosdir1 = path.join(rootdir, '/upload/profileImages')
const photosdir2 = path.join(rootdir, '/upload/logoBrand')
const photosdir3 = path.join(rootdir, '/upload/productImage')

const upstore = (dir) => {
    return multer(
        {
            storage: multer.diskStorage(
                        {
                            destination: function (req, file, cb){
                                cb(null, dir)
                            },
                            filename: function (req, file, cb){
                                // Waktu upload, nama field, extension file
                                // cb(null, Date.now() + '.png')
                                cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
                            }
                        }
                    ),
            limits: {
                fileSize: 1000000 // Byte , default 1MB
            },
            fileFilter(req, file, cb) {
                if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
                    return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
                }
        
                cb(undefined, true)
            }
        }
    )
    
}

module.exports = {
    upstore,
    photosdir1,
    photosdir2,
    photosdir3
}
