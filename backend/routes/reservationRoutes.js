const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const auth = require('../middleware/auth');

router.post('/', auth, reservationController.createReservation);
router.get('/host', auth, reservationController.getReservationsByHost);
router.get('/user', auth, reservationController.getReservationsByUser);
router.delete('/:id', auth, reservationController.deleteReservation);

module.exports = router;
