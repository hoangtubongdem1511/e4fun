const express = require('express');
const multer = require('multer');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { postUpload } = require('../controllers/upload.controller');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    // 5MB mặc định để tránh payload quá lớn.
    fileSize: Number(process.env.UPLOAD_MAX_FILE_SIZE || 5 * 1024 * 1024),
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!file.mimetype || !allowed.includes(file.mimetype)) {
      const err = new Error('Invalid file type');
      err.statusCode = 400;
      err.code = 'UPLOAD_ERROR';
      err.details = {
        allowedTypes: allowed,
        receivedType: file.mimetype,
      };
      return cb(err);
    }
    return cb(null, true);
  },
});

router.post('/', upload.single('image'), asyncHandler(postUpload));

module.exports = router;