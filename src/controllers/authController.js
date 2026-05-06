const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(user) {
    return jwt.sign(
        { id: user._id.toString(), email: user.email, name: user.name },
        process.env.JWT_SECRET || 'dev-secret-change-me',
        { expiresIn: '7d' }
    );
}

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ detail: 'Name, email, and password are required.' });
        }

        if (String(password).length < 6) {
            return res.status(400).json({ detail: 'Password must be at least 6 characters.' });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({ detail: 'An account with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(String(password), 10);
        const user = await User.create({
            name: String(name).trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        const token = createToken(user);

        return res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ detail: 'Failed to create account.' });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ detail: 'Email and password are required.' });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ detail: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(String(password), user.password);
        if (!isMatch) {
            return res.status(401).json({ detail: 'Invalid email or password.' });
        }

        const token = createToken(user);

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signin error:', error);
        return res.status(500).json({ detail: 'Failed to sign in.' });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('_id name email');
        if (!user) {
            return res.status(404).json({ detail: 'User not found.' });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Me endpoint error:', error);
        return res.status(500).json({ detail: 'Failed to fetch user profile.' });
    }
};
