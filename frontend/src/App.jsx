import { useState } from "react";
import "./App.css";

function App() {
  const [fuelType, setFuelType] = useState("Petrol");
  
const [quantityMode, setQuantityMode] = useState("litres");
const [quantityValue, setQuantityValue] = useState("5");
const [vehicleType, setVehicleType] = useState("Bike");
const [customerName, setCustomerName] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [coordinates, setCoordinates] = useState(null);
const [loadingLocation, setLoadingLocation] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [bookingMessage, setBookingMessage] = useState("");
const [bookingError, setBookingError] = useState("");

const fuelPrices = {
  Petrol: 100,
  Diesel: 90,
};

const deliveryFee = 50;
const enteredAmount = Number(quantityValue);

const estimatedFuelCost =
  quantityMode === "litres"
    ? enteredAmount * fuelPrices[fuelType]
    : enteredAmount;

const estimatedLitres =
  quantityMode === "litres"
    ? enteredAmount
    : enteredAmount / fuelPrices[fuelType];

const estimatedTotal = estimatedFuelCost + deliveryFee;

function getCurrentLocation() {
  if (!navigator.geolocation) {
    setBookingError("GPS is not supported by this browser.");
    return;
  }

  setLoadingLocation(true);
  setBookingError("");
  setBookingMessage("");

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      setLoadingLocation(false);
      setBookingMessage("GPS location captured successfully.");
    },
    (error) => {
      setLoadingLocation(false);

      const messages = {
        1: "Location permission was denied. Enter your address manually or allow location access.",
        2: "Your location could not be determined. Please try again or enter your address.",
        3: "GPS request timed out. Please try again.",
      };

      setBookingError(
        messages[error.code] || "Unable to get your location."
      );
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );
}

async function handleBookingSubmit(event) {
  event.preventDefault();

  setBookingError("");
  setBookingMessage("");

  if (!Number.isFinite(enteredAmount) || enteredAmount <= 0) {
    setBookingError("Enter a valid positive quantity or budget.");
    return;
  }

  if (!address.trim() && !coordinates) {
    setBookingError("Enter your address or capture your GPS location.");
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fuelType,
        quantityMode,
        quantityValue: enteredAmount,
        vehicleType,
        customerName,
        phone,
        address,
        latitude: coordinates?.latitude ?? null,
        longitude: coordinates?.longitude ?? null,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Booking failed.");
    }

    setBookingMessage(
      `Booking created successfully! Booking ID: ${data.booking._id}`
    );

    setQuantityValue("5");
    setQuantityMode("litres");
    setCustomerName("");
    setPhone("");
    setAddress("");
    setCoordinates(null);
  } catch (error) {
    setBookingError(
      error.message ||
        "Could not contact the FuelGo server. Check that your backend is running."
    );
  } finally {
    setSubmitting(false);
  }
}


  return (
    <div className="app">
      <nav className="navbar">
        <a href="/" className="logo">
          <span className="logo-icon">F</span>
          FuelGo
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <a href="#booking" className="nav-button">
          Order Fuel
        </a>
      </nav>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              <span className="live-dot"></span>
              FUEL DELIVERY AT YOUR LOCATION
            </span>

            <h1>
              Out of fuel?
              <br />
              <span>We've got you.</span>
            </h1>

            <p className="hero-description">
              Running low on fuel shouldn't stop your journey.
              Get petrol or diesel delivered wherever you are.
            </p>

            <div className="hero-actions">
              <a href="#booking" className="primary-button">
                Get Fuel Delivered <span>→</span>
              </a>
              <a href="#how-it-works" className="secondary-button">
                How it works
              </a>
            </div>

            <div className="hero-points">
              <span>✓ Easy booking</span>
              <span>✓ Transparent pricing</span>
              <span>✓ Convenient delivery</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow"></div>
            <div className="fuel-card">
              <div className="fuel-card-top">
                <span className="fuel-card-label">YOUR JOURNEY</span>
                <span className="fuel-card-symbol">↗</span>
              </div>

              <div className="fuel-illustration">
                <div className="fuel-ring ring-one"></div>
                <div className="fuel-ring ring-two"></div>
                <div className="fuel-can">
                  <div className="can-cap"></div>
                  <div className="can-handle"></div>
                  <div className="can-label">FUEL</div>
                  <div className="can-drop">◆</div>
                </div>
              </div>

              <div className="fuel-card-bottom">
                <div>
                  <strong>Fuel up. Move on.</strong>
                  <p>Your journey matters.</p>
                </div>
                <span className="check-circle">✓</span>
              </div>
            </div>

            <div className="floating-note note-top">
              <span className="note-icon">⚡</span>
              <div>
                <strong>Quick booking</strong>
                <p>Just a few simple steps</p>
              </div>
            </div>

            <div className="floating-note note-bottom">
              <span className="note-icon green-icon">✓</span>
              <div>
                <strong>You're in control</strong>
                <p>Choose your fuel type</p>
              </div>
            </div>
          </div>
        </section>

        <section className="services section" id="services">
          <div className="section-heading">
            <span className="eyebrow">OUR SERVICES</span>
            <h2>Fuel when you need it.</h2>
            <p>A simpler way to get back on the road.</p>
          </div>

          <div className="service-grid">
            <article className="service-card">
              <div className="service-icon petrol-icon">P</div>
              <h3>Petrol Delivery</h3>
              <p>Request petrol for your car or bike when you need it.</p>
              <a href="#booking" onClick={() => setFuelType("Petrol")}>
                Order petrol →
              </a>
            </article>

            <article className="service-card">
              <div className="service-icon diesel-icon">D</div>
              <h3>Diesel Delivery</h3>
              <p>Arrange diesel delivery for your eligible vehicle.</p>
              <a href="#booking" onClick={() => setFuelType("Diesel")}>
                Order diesel →
              </a>
            </article>

            <article className="service-card">
              <div className="service-icon support-icon">24</div>
              <h3>Roadside Convenience</h3>
              <p>Request help when an unexpected fuel shortage interrupts your trip.</p>
              <a href="#booking">Get started →</a>
            </article>
          </div>
        </section>

        
<section className="booking-section section" id="booking">
  <div className="booking-intro">
    <span className="eyebrow">GET STARTED</span>
    <h2>Your next stop is back on the road.</h2>
    <p>
      Choose your fuel, enter your quantity or budget, and
      provide your delivery location.
    </p>
  </div>

  <form className="booking-card" onSubmit={handleBookingSubmit}>
    <h3>Book your fuel delivery</h3>
    <p className="booking-subtitle">
      Fill in your details to create a booking.
    </p>

    <label className="form-label">Fuel type</label>

    <div className="fuel-options">
      {["Petrol", "Diesel"].map((fuel) => (
        <button
          key={fuel}
          type="button"
          className={`fuel-option ${
            fuelType === fuel ? "selected" : ""
          }`}
          onClick={() => setFuelType(fuel)}
        >
          <span
            className={`option-icon ${
              fuel === "Petrol" ? "petrol-icon" : "diesel-icon"
            }`}
          >
            {fuel === "Petrol" ? "P" : "D"}
          </span>

          <span>
            <strong>{fuel}</strong>
            <small>₹{fuelPrices[fuel]}/litre (sample)</small>
          </span>

          <span className="radio-dot"></span>
        </button>
      ))}
    </div>

    <label className="form-label">How would you like to order?</label>

    <div className="quantity-mode-options">
      <button
        type="button"
        className={quantityMode === "litres" ? "mode-selected" : ""}
        onClick={() => setQuantityMode("litres")}
      >
        By litres
      </button>

      <button
        type="button"
        className={quantityMode === "budget" ? "mode-selected" : ""}
        onClick={() => setQuantityMode("budget")}
      >
        By budget (₹)
      </button>
    </div>

    <label className="form-label" htmlFor="quantityValue">
      {quantityMode === "litres" ? "Fuel quantity (litres)" : "Fuel budget (₹)"}
    </label>

    <input
      id="quantityValue"
      className="form-input"
      type="number"
      min={quantityMode === "litres" ? "0.1" : "1"}
      max={quantityMode === "litres" ? "100" : "10000"}
      step={quantityMode === "litres" ? "0.1" : "1"}
      value={quantityValue}
      onChange={(event) => setQuantityValue(event.target.value)}
      required
    />

    <div className="price-summary">
      <div>
        <span>Estimated fuel</span>
        <strong>
          {Number.isFinite(estimatedLitres) && estimatedLitres > 0
            ? `${estimatedLitres.toFixed(2)} litres`
            : "—"}
        </strong>
      </div>

      <div>
        <span>Fuel cost</span>
        <strong>
          ₹
          {Number.isFinite(estimatedFuelCost) && estimatedFuelCost > 0
            ? estimatedFuelCost.toFixed(2)
            : "0.00"}
        </strong>
      </div>

      <div>
        <span>Delivery fee (sample)</span>
        <strong>₹{deliveryFee.toFixed(2)}</strong>
      </div>

      <div className="price-total">
        <span>Estimated total</span>
        <strong>
          ₹
          {Number.isFinite(estimatedTotal) && estimatedTotal > 0
            ? estimatedTotal.toFixed(2)
            : "0.00"}
        </strong>
      </div>
    </div>

    <label className="form-label" htmlFor="vehicleType">
      Vehicle type
    </label>

    <select
      id="vehicleType"
      className="form-input"
      value={vehicleType}
      onChange={(event) => setVehicleType(event.target.value)}
      required
    >
      <option value="Bike">Bike</option>
      <option value="Car">Car</option>
      <option value="Other">Other</option>
    </select>

    <label className="form-label" htmlFor="customerName">
      Your name
    </label>

    <input
      id="customerName"
      className="form-input"
      type="text"
      value={customerName}
      onChange={(event) => setCustomerName(event.target.value)}
      autoComplete="name"
      maxLength={100}
      required
      placeholder="Enter your full name"
    />

    <label className="form-label" htmlFor="phone">
      Phone number
    </label>

    <input
      id="phone"
      className="form-input"
      type="tel"
      inputMode="numeric"
      pattern="[0-9]{10}"
      maxLength={10}
      value={phone}
      onChange={(event) =>
        setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
      }
      autoComplete="tel-national"
      required
      placeholder="10-digit mobile number"
    />

    <label className="form-label" htmlFor="address">
      Delivery address
    </label>

    <textarea
      id="address"
      className="form-input form-textarea"
      value={address}
      onChange={(event) => setAddress(event.target.value)}
      maxLength={500}
      placeholder="Enter your address or a nearby landmark"
      rows={3}
    />

    <button
      type="button"
      className="gps-button"
      onClick={getCurrentLocation}
      disabled={loadingLocation}
    >
      {loadingLocation ? "Getting your location..." : "◎ Use my GPS location"}
    </button>

    {coordinates && (
      <p className="location-status">
        GPS captured: {coordinates.latitude.toFixed(5)},{" "}
        {coordinates.longitude.toFixed(5)}
        <button
          type="button"
          className="clear-location"
          onClick={() => setCoordinates(null)}
        >
          Remove GPS
        </button>
      </p>
    )}

    {bookingError && (
      <p className="booking-feedback error-message" role="alert">
        {bookingError}
      </p>
    )}

    {bookingMessage && (
      <p className="booking-feedback success-message" role="status">
        {bookingMessage}
      </p>
    )}

    <button
      type="submit"
      className="primary-button booking-button"
      disabled={submitting || loadingLocation}
    >
      {submitting ? "Submitting booking..." : "Confirm booking →"}
    </button>

    <p className="booking-disclaimer">
      Prices shown are development estimates. A booking request is not
      a confirmed delivery or payment. Delivery depends on availability,
      an authorized provider, and applicable local regulations.
      </p>
      </form>
      </section>
      </main>

      <footer className="footer">
        <a href="#home" className="logo">
          <span className="logo-icon">F</span>
          FuelGo
        </a>
        <p>Helping your journey move forward.</p>
        <span>© {new Date().getFullYear()} FuelGo</span>
      </footer>
    </div>
  );
}

export default App;
