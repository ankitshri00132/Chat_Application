const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer');
const cloudinary = require('../utils/cloudinary');

// Route to handle image upload
router.post('/upload', multer.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;
