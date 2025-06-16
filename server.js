const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://localhost:27017/taskmanager', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: String,
    created_at: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hashedPassword, email });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (e) {
        res.status(400).json({ error: 'Username already exists' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login successful', username });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));