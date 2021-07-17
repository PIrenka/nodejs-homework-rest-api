const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs').promises
const jimp = require('jimp')
const FILE_DIR = path.join('./tmp')
const AVATARS_DIR = path.join('./public/avatars')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_DIR)
  },
  filename: (req, file, cb) => {
    const [, extension] = file.originalname.split('.')
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${Date.now()}.${extension}`)
  }
})
const router = express.Router()
// const { asyncWrapper } = require('../../helpers/apiHelpers')
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

// const {
//   uploadController
// } = require('../../controllers/filesController')

router.post(
  '/upload',
  uploadMiddleware.single('avatar'),
  async (req, res, next) => {
    if (req.file) {
      const { file } = req
      const avatars = await jimp.read(file.path)
      console.log('file.path', file.path)
      await avatars
        .autocrop()
        .cover(
          250,
          250,
          jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE
        )
        .writeAsync(file.path)
      await fs.rename(
        file.path,
        path.join(AVATARS_DIR, file.fieldname + '-' + Date.now())
      )
    }
    res.status(200).json('success')
  }
)
router.use('/download', express.static(AVATARS_DIR))
module.exports = router
