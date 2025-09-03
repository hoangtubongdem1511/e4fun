const nextConnect = require('next-connect');
const multer = require('multer');
const { uploadToCloudinary } = require('../lib/services/cloudinary');

export const config = { api: { bodyParser: false } };

const upload = multer({ storage: multer.memoryStorage() });
const handler = nextConnect();

handler.use(upload.single('image'));
handler.post(async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file);
    res.status(200).json({ url: result.secure_url });
  } catch (e) {
    console.error('upload error:', e.message);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = handler;
