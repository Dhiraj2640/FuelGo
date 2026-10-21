/*
import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// Development prices only — replace with verified provider prices.
const FUEL_PRICES = {
  Petrol: 100,
  Diesel: 90,
};

const DELIVERY_FEE = 50;

// Create a booking
router.post("/", async (req, res) => {
  try {
    const {
      fuelType,
      quantityMode,
      quantityValue,
      address,
      latitude,
      longitude,
      vehicleType,
      customerName,
      phone,
    } = req.body;

    if (!["Petrol", "Diesel"].includes(fuelType)) {
      return res.status(400).json({
        success: false,
        message: "Choose Petrol or Diesel.",
      });
    }

    if (!["litres", "budget"].includes(quantityMode)) {
      return res.status(400).json({
        success: false,
        message: "Choose litres or budget.",
      });
    }

    if (!["Car", "Bike", "Other"].includes(vehicleType)) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid vehicle type.",
      });
    }

    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      typeof phone !== "string" ||
      !/^[0-9]{10}$/.test(phone.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter your name and a valid 10-digit phone number.",
      });
    }

    const amount = Number(quantityValue);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid quantity or budget.",
      });
    }

    const hasAddress =
      typeof address === "string" && address.trim().length > 0;

    const hasCoordinates =
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180;

    if (!hasAddress && !hasCoordinates) {
      return res.status(400).json({
        success: false,
        message: "Enter a delivery address or use GPS location.",
      });
    }

    const fuelPricePerLitre = FUEL_PRICES[fuelType];

    let quantityLitres;
    let budgetRupees;

    if (quantityMode === "litres") {
      quantityLitres = amount;
      budgetRupees = Math.round(amount * fuelPricePerLitre * 100) / 100;
    } else {
      budgetRupees = amount;
      quantityLitres =
        Math.floor((amount / fuelPricePerLitre) * 1000) / 1000;
    }

    if (
      !Number.isFinite(quantityLitres) ||
      quantityLitres < 0.1 ||
      quantityLitres > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "The requested quantity must be between 0.1 and 100 litres.",
      });
    }

    const totalAmount =
      Math.round((budgetRupees + DELIVERY_FEE) * 100) / 100;

    const booking = await Booking.create({
      fuelType,
      quantityMode,
      quantityLitres,
      budgetRupees,
      fuelPricePerLitre,
      deliveryFee: DELIVERY_FEE,
      totalAmount,
      address: hasAddress ? address.trim() : "",
      latitude: hasCoordinates ? latitude : null,
      longitude: hasCoordinates ? longitude : null,
      vehicleType,
      customerName: customerName.trim(),
      phone: phone.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    console.error("Booking creation failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create booking. Please try again.",
    });
  }
});

// List recent bookings for development testing
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-phone");

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Fetching bookings failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch bookings.",
    });
  }
});

export default router;
*/







import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// Demo prices only. Verify actual fuel prices before real use.
const FUEL_PRICES = {
  Petrol: 105,
  Diesel: 92,
};

const DELIVERY_FEE = 49;

// Create a booking
router.post("/", async (req, res) => {
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

    if (
      typeof customerName !== "string" ||
      !customerName.trim() ||
      typeof phone !== "string" ||
      !/^[0-9]{10}$/.test(phone.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter your name and a valid 10-digit phone number.",
      });
    }

    if (!["Bike", "Car", "Other"].includes(vehicleType)) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid vehicle type.",
      });
    }

    if (!["Petrol", "Diesel"].includes(fuelType)) {
      return res.status(400).json({
        success: false,
        message: "Choose Petrol or Diesel.",
      });
    }

    if (!["litres", "budget"].includes(entryMode)) {
      return res.status(400).json({
        success: false,
        message: "Choose litres or budget.",
      });
    }

    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid positive quantity or budget.",
      });
    }

    const hasAddress =
      typeof address === "string" && address.trim().length > 0;

    const hasCoordinates =
      typeof latitude === "number" &&
      Number.isFinite(latitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      typeof longitude === "number" &&
      Number.isFinite(longitude) &&
      longitude >= -180 &&
      longitude <= 180;

    if (!hasAddress && !hasCoordinates) {
      return res.status(400).json({
        success: false,
        message: "Enter a delivery address or use GPS location.",
      });
    }

    const fuelPricePerLitre = FUEL_PRICES[fuelType];

    let quantityLitres;
    let budgetAmount = null;

    if (entryMode === "litres") {
      quantityLitres = value;

      if (quantityLitres < 0.1 || quantityLitres > 100) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be between 0.1 and 100 litres.",
        });
      }
    } else {
      budgetAmount = value;

      if (budgetAmount < fuelPricePerLitre * 0.1 || budgetAmount > 10000) {
        return res.status(400).json({
          success: false,
          message: "Budget must be sufficient for 0.1 litres and no more than ₹10,000.",
        });
      }

      quantityLitres =
        Math.floor((budgetAmount / fuelPricePerLitre) * 100) / 100;
    }

    if (quantityLitres < 0.1 || quantityLitres > 100) {
      return res.status(400).json({
        success: false,
        message: "The requested quantity must be between 0.1 and 100 litres.",
      });
    }

    const estimatedFuelCost = Number(
      (quantityLitres * fuelPricePerLitre).toFixed(2)
    );

    const estimatedTotal = Number(
      (estimatedFuelCost + DELIVERY_FEE).toFixed(2)
    );

    const booking = await Booking.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      vehicleType,
      fuelType,
      entryMode,
      quantityLitres,
      budgetAmount,
      fuelPricePerLitre,
      estimatedFuelCost,
      deliveryFee: DELIVERY_FEE,
      estimatedTotal,
      location: {
        address: hasAddress ? address.trim() : "GPS location selected",
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
    console.error("Booking creation failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save the booking. Please try again.",
    });
  }
});

// List recent bookings for development testing
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-phone");

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

export default router;
