// server.js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Імпортуємо дані
const { users, documents, employees } = require('./data');

// --- MIDDLEWARE ---
const authMiddleware = (req, res, next) => {
  const login = req.headers['x-login'];
  const password = req.headers['x-password'];

  if (!login || !password) {
    return res.status(400).json({ message: 'Please provide X-Login and X-Password headers.' });
  }

  const user = users.find(u => u.login === login && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed. Invalid credentials.' });
  }

  req.user = user;
  next();
};

const adminOnlyMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};
// --- КІНЕЦЬ MIDDLEWARE ---

// --- МАРШРУТИ ---
app.get('/documents', authMiddleware, (req, res) => {
  res.status(200).json(documents);
});

app.post('/documents', authMiddleware, (req, res) => {
  const newDocument = { ...req.body, id: Date.now() };
  documents.push(newDocument);
  res.status(201).json(newDocument);
});

app.get('/employees', authMiddleware, adminOnlyMiddleware, (req, res) => {
  res.status(200).json(employees);
});
// --- КІНЕЦЬ МАРШРУТІВ ---

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});







