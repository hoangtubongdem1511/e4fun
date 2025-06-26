const express = require('express');
const multer = require('multer');
const { uploadToCloudinary } = require('../services/cloudinary');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;