const express = require('express');
const multer = require('multer');
const { addProducts, dispatchproducts } = require('../controllers/products');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/addproducts',upload.single("file"), addProducts ).post('/dispatchproducts', dispatchproducts);

module.exports = router;