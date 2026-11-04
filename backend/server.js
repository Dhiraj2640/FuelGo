/*
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();
 const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to FuelGo API",
    status: "Server is running",
  });
});

// Health-check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// Booking routes
app.use("/api/bookings", bookingRoutes);

// Connect to MongoDB and start server
async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`FuelGo API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer(); */



import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CHANGE 1: allow both localhost and your deployed frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL, // set this in Vercel, e.g. https://your-frontend.vercel.app
    ].filter(Boolean),
  })
);
app.use(express.json());

// CHANGE 2: connect to MongoDB per request (cached), instead of once at startup
let isConnected = false;

async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
  console.log("MongoDB connected successfully");
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB connection failed:", error.message);
    res.status(500).json({ success: false, error: "Database connection failed" });
  }
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to FuelGo API",
    status: "Server is running",
  });
});

// Health-check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Booking routes
app.use("/api/bookings", bookingRoutes);

// CHANGE 3: only listen locally; on Vercel, export the app instead
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`FuelGo API running at http://localhost:${PORT}`);
  });
}

export default app;