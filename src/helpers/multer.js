const multer = require('multer')
const path = require('path')

const AVATARS_DIR = path.join('./public/avatars')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AVATARS_DIR)
  },
  filename: (req, file, cb) => {
    const [, extension] = file.originalname.split('.')
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${Date.now()}.${extension}`)
  }
})
const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true)
      return
    }
    cb(null, false)
  }
})

module.exports = { uploadMiddleware }
