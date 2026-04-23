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
// 404
app.use((req, res, next) => {
   const error = new Error(`Route not found: ${req.originalUrl}`);
   error.status = 404;
   next(error);
 });
 
 // GLOBAL ERROR HANDLER
 app.use((err, req, res, next) => {
   console.error('🔥 ERROR:', err);
 
   res.status(err.status || 500).json({
     success: false,
     message: err.message || 'Server error',
   });
 });

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});