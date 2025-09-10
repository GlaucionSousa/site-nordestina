const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: "*" })); // ajuste origin em produção
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// Rate limiting (proteção básica)
const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

// Routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

// Healthcheck
app.get("/", (req, res) =>
  res.json({ status: "ok", env: process.env.NODE_ENV || "dev" })
);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
