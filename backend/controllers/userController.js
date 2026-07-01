const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Not all fields have been entered." });
    }

    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // if user exists, we check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Not all fields have been entered." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Set role (default to 'user' if not explicitly 'admin')
    const userRole = role === 'admin' ? 'admin' : 'user';

    const newUser = new User({
      email,
      username,
      password: passwordHash,
      role: userRole
    });
    
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id, role: savedUser.role, email: savedUser.email, username: savedUser.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
