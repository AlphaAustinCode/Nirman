const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Mock memory store for OTPs
const otpStore = new Map();

app.post('/check-passbook', (req, res) => {
    const { passbookNumber } = req.body;
    if (!passbookNumber || passbookNumber.length !== 17 || !/^\d+$/.test(passbookNumber)) {
        return res.status(400).json({ success: false, message: 'Invalid 17-digit passbook number' });
    }
    return res.status(200).json({ success: true, message: 'Passbook verified' });
});

app.post('/send-otp', (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone required' });
    // Secure static 6 digit for test or random
    const otp = "123456"; 
    otpStore.set(phone, otp);
    return res.status(200).json({ success: true, message: 'OTP Sent successfully' });
});

app.post('/verify-otp', (req, res) => {
    const { phone, otp } = req.body;
    const storedOtp = otpStore.get(phone);
    if (!storedOtp || storedOtp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    otpStore.delete(phone);
    return res.status(200).json({ success: true, message: 'OTP verified successfully' });
});

app.post('/register', async (req, res) => {
    try {
        const { phone, passbookNumber, name, address, email, secondaryPhone, password } = req.body;
        
        let userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with this phone number' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            phone,
            passbookNumber,
            name,
            address,
            email,
            secondaryPhone,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Logged in successfully',
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                trustScore: user.trustScore
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
