const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');

exports.createReservation = async (req, res) => {
  try {
    const { accommodationId, startDate, endDate, guests, totalPrice } = req.body;
    
    // Find accommodation to get host id
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    const newReservation = new Reservation({
      accommodationId,
      userId: req.user.id,
      hostId: accommodation.host,
      startDate,
      endDate,
      guests,
      totalPrice
    });

    const savedReservation = await newReservation.save();
    res.status(201).json(savedReservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReservationsByHost = async (req, res) => {
  try {
    const reservations = await Reservation.find({ hostId: req.user.id }).populate('accommodationId').populate('userId', 'username email');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReservationsByUser = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id }).populate('accommodationId');
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.userId.toString() !== req.user.id && reservation.hostId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this reservation' });
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reservation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
