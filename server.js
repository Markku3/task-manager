const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const sqliteDb = require('./db');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/naytto', {
   useNewUrlParser: true,   
    useUnifiedTopology: true
});

// --- Add User Schema/Model (UNCOMMENTED and in use!) ---
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

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

// --- MongoDB Todo schema/model (after userSchema) ---
const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Todo = mongoose.model('Todo', todoSchema);

// --- Helper: Get SQLite user_id from username ---
function getSqliteUserId(username) {
  return new Promise((resolve, reject) => {
    sqliteDb.get('SELECT id FROM users WHERE username = ?', [username], (err, row) => {
      if (err || !row) reject('User not found');
      else resolve(row.id);
    });
  });
}

// --- GET all todos for user ---
app.get('/api/todos', async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: 'Missing username' });
  try {
    // MongoDB
    const user = await User.findOne({ username });
    const mongoTodos = user ? await Todo.find({ userId: user._id }).lean() : [];
    // SQLite
    const sqliteUserId = await getSqliteUserId(username);
    sqliteDb.all('SELECT * FROM todos WHERE user_id = ?', [sqliteUserId], (err, rows) => {
      if (err) return res.status(500).json({ error: 'SQLite error' });
      res.json({ mongo: mongoTodos, sqlite: rows });
    });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// --- CREATE todo ---
app.post('/api/todos', async (req, res) => {
  const { username, text, description = '' } = req.body;
  if (!username || !text) return res.status(400).json({ error: 'Missing fields' });
  try {
    // MongoDB
    const user = await User.findOne({ username });
    const mongoTodo = user ? await Todo.create({ userId: user._id, text, description, completed: false }) : null;
    // SQLite
    const sqliteUserId = await getSqliteUserId(username);
    sqliteDb.run(
      'INSERT INTO todos (user_id, text, description, completed) VALUES (?, ?, ?, 0)',
      [sqliteUserId, text, description],
      function (err) {
        if (err) return res.status(500).json({ error: 'SQLite error' });
        res.json({ mongo: mongoTodo, sqlite: { id: this.lastID, user_id: sqliteUserId, text, description, completed: 0 } });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// --- UPDATE todo ---
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { username, text, description, completed } = req.body;
  if (!username || !text) return res.status(400).json({ error: 'Missing data' });

  try {
    // Get user_id from SQLite
    sqliteDb.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'User not found' });

      sqliteDb.run(
        `UPDATE todos SET text = ?, description = ?, completed = ? WHERE id = ? AND user_id = ?`,
        [text, description, completed, id, user.id],
        function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update todo' });
          }
          res.json({ success: true });
        }
      );
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- DELETE todo ---
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Missing username' });

  try {
    sqliteDb.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'User not found' });

      sqliteDb.run(
        `DELETE FROM todos WHERE id = ? AND user_id = ?`,
        [id, user.id],
        function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete todo' });
          }
          res.json({ success: true });
        }
      );
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

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