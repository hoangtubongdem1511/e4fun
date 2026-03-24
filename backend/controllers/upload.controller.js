const { uploadToCloudinary } = require('../services/cloudinary');

async function postUpload(req, res) {
  const result = await uploadToCloudinary(req.file);
  return res.json({ url: result.secure_url });
}

module.exports = {
  postUpload,
};

