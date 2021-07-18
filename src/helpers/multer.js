const multer = require('multer')
const path = require('path')

const FILE_DIR = path.join('./tmp')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_DIR)
  },
  filename: (req, file, cb) => {
    const [, extension] = file.originalname.split('.')
    cb(null, `${Date.now()}.${extension}`)
  }
})
const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 2000000 }
})

module.exports = { uploadMiddleware }
