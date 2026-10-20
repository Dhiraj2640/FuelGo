
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      required: true,
      enum: ["Bike", "Car", "Other"],
    },

    fuelType: {
      type: String,
      required: true,
      enum: ["Petrol", "Diesel"],
    },

    entryMode: {
      type: String,
      required: true,
      enum: ["litres", "budget"],
    },

    quantityLitres: {
      type: Number,
      required: true,
      min: 0.1,
    },

    budgetAmount: {
      type: Number,
      default: null,
      min: 0,
    },

    fuelPricePerLitre: {
      type: Number,
      required: true,
    },

    estimatedFuelCost: {
      type: Number,
      required: true,
    },

    deliveryFee: {
      type: Number,
      required: true,
    },

    estimatedTotal: {
      type: Number,
      required: true,
    },

    location: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
