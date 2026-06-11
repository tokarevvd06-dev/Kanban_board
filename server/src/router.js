require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({
    success: true,
    data: "API is working",
  });
});

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/boards", require("./routes/boardRoutes"));

app.use("/api/columns", require("./routes/columnRoutes"));

app.use("/api/tasks", require("./routes/taskRoutes"));

app.use("/api/comments", require("./routes/commentRoutes"));

app.use("/api/members", require("./routes/memberRoutes"));

app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
