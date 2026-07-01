const express = require('express');
const router = express.Router();
const accommodationController = require('../controllers/accommodationController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.array('images', 10), accommodationController.createAccommodation);
router.get('/', accommodationController.getAllAccommodations);
router.delete('/:id', auth, accommodationController.deleteAccommodation);
router.put('/:id', auth, upload.array('images', 10), accommodationController.updateAccommodation);

module.exports = router;
