
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Booking from "./models/Booking.js";

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


const FUEL_PRICES = {
  Petrol: 105,
  Diesel: 92,
};

const DELIVERY_FEE = 49;

// Create a new booking
app.post("/api/bookings", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      vehicleType,
      fuelType,
      entryMode,
      amount,
      address,
      latitude,
      longitude,
    } = req.body;

    // Validate required text fields
    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      typeof phone !== "string" ||
      !/^[0-9]{10}$/.test(phone.trim()) ||
      typeof address !== "string" ||
      !address.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter your name, a 10-digit phone number, and delivery address.",
      });
    }

    if (!["Bike", "Car", "Other"].includes(vehicleType)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid vehicle type.",
      });
    }

    if (!["Petrol", "Diesel"].includes(fuelType)) {
      return res.status(400).json({
        success: false,
        message: "Please select Petrol or Diesel.",
      });
    }

    if (!["litres", "budget"].includes(entryMode)) {
      return res.status(400).json({
        success: false,
        message: "Choose litres or budget.",
      });
    }

    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid positive quantity or budget.",
      });
    }

    const fuelPricePerLitre = FUEL_PRICES[fuelType];

    let quantityLitres;
    let budgetAmount = null;

    if (entryMode === "litres") {
      quantityLitres = amount;

      if (quantityLitres < 0.1 || quantityLitres > 100) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be between 0.1 and 100 litres for this demo.",
        });
      }
    } else {
      budgetAmount = amount;

      if (budgetAmount < fuelPricePerLitre * 0.1 || budgetAmount > 10000) {
        return res.status(400).json({
          success: false,
          message: "Enter a budget within the allowed demo range.",
        });
      }

      quantityLitres = budgetAmount / fuelPricePerLitre;
    }

    const estimatedFuelCost = Number(
      (quantityLitres * fuelPricePerLitre).toFixed(2)
    );

    const estimatedTotal = Number(
      (estimatedFuelCost + DELIVERY_FEE).toFixed(2)
    );

    // Accept GPS coordinates only when both are valid numbers.
    const hasCoordinates =
      typeof latitude === "number" &&
      Number.isFinite(latitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      typeof longitude === "number" &&
      Number.isFinite(longitude) &&
      longitude >= -180 &&
      longitude <= 180;

    const booking = await Booking.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      vehicleType,
      fuelType,
      entryMode,
      quantityLitres: Number(quantityLitres.toFixed(2)),
      budgetAmount,
      fuelPricePerLitre,
      estimatedFuelCost,
      deliveryFee: DELIVERY_FEE,
      estimatedTotal,
      location: {
        address: address.trim(),
        latitude: hasCoordinates ? latitude : null,
        longitude: hasCoordinates ? longitude : null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Booking saved successfully.",
      booking,
    });
  } catch (error) {
    console.error("Booking creation failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save the booking. Please try again.",
    });
  }
});

// Get bookings for development and testing
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Fetching bookings failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve bookings.",
    });
  }
});


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

startServer();
