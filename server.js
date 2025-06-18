const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const sqliteDb = require('./db');
require('dotenv').config();

const app = express();

//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager', {
//    useNewUrlParser: true,
//    useUnifiedTopology: true
//});

/*const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});*/
// const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve all static files (JS, CSS, images)
app.use(express.static(__dirname));

// Routing for pages
app.get('/', (req, res) => res.render('index'));
app.get('/auth', (req, res) => res.render('auth'));
app.get('/personal', (req, res) => res.render('personal'));

// API endpoints (unchanged)
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (e) {
        res.status(400).json({ error: 'Username already exists' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    res.json({ message: 'Login successful', username });
});


// SQLite registration endpoint
app.post('/api/sqlite/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    sqliteDb.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function (err) {
        if (err) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(201).json({ message: 'User created (SQLite)' });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// SQLite login endpoint
app.post('/api/sqlite/login', (req, res) => {
  const { username, password } = req.body;
  sqliteDb.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err || !user) return res.status(400).json({ error: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: 'Invalid credentials' });
      res.json({ message: 'Login successful (SQLite)', username });
    }
  );
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));