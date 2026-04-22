require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   TEST ROUTE
========================= */
app.get('/test', (req, res) => {
  res.json({ message: 'API is working 🚀' });
});

/* =========================
   AUTH ROUTES
========================= */
app.use('/api/auth', require('./routes/authRoutes'));

/* =========================
   BOARD ROUTES
========================= */
app.use('/api/boards', require('./routes/boardRoutes'));

/* =========================
   COLUMN ROUTES
========================= */
app.use('/api/columns', require('./routes/columnRoutes'));

/* =========================
   TASK ROUTES
========================= */
app.use('/api/tasks', require('./routes/taskRoutes'));

/* =========================
   COMMENT ROUTES
========================= */
app.use('/api/comments', require('./routes/commentRoutes'));

/* =========================
   MEMBER ROUTES
========================= */
app.use('/api/members', require('./routes/memberRoutes'));

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

/* =========================
   ERROR HANDLER (опционально, но полезно)
========================= */
app.use((err, req, res, next) => {
  console.error('🔥 SERVER ERROR:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});