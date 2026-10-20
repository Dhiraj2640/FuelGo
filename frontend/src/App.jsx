import { useState } from "react";
import "./App.css";

function App() {
  const [fuelType, setFuelType] = useState("Petrol");

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
            <p>Choose your fuel type to begin your booking.</p>
          </div>

          <div className="booking-card">
            <h3>What fuel do you need?</h3>
            <p className="booking-subtitle">
              Select an option to continue.
            </p>

            <div className="fuel-options">
              <button
                type="button"
                className={`fuel-option ${fuelType === "Petrol" ? "selected" : ""}`}
                onClick={() => setFuelType("Petrol")}
              >
                <span className="option-icon petrol-icon">P</span>
                <span>
                  <strong>Petrol</strong>
                  <small>For petrol vehicles</small>
                </span>
                <span className="radio-dot"></span>
              </button>

              <button
                type="button"
                className={`fuel-option ${fuelType === "Diesel" ? "selected" : ""}`}
                onClick={() => setFuelType("Diesel")}
              >
                <span className="option-icon diesel-icon">D</span>
                <span>
                  <strong>Diesel</strong>
                  <small>For diesel vehicles</small>
                </span>
                <span className="radio-dot"></span>
              </button>
            </div>

            <button
              type="button"
              className="primary-button booking-button"
              onClick={() =>
                alert(`${fuelType} selected! We will build the complete booking form next.`)
              }
            >
              Continue with {fuelType} <span>→</span>
            </button>

            <p className="booking-disclaimer">
              This is a design preview. Booking and payment are not connected yet.
              Fuel delivery is subject to local laws and authorized providers.
            </p>
          </div>
        </section>

        <section className="how-section section" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>Three steps. Less stress.</h2>
          </div>

          <div className="steps-grid">
            <article className="step">
              <span className="step-number">01</span>
              <h3>Choose your fuel</h3>
              <p>Select petrol or diesel for your vehicle.</p>
            </article>
            <article className="step">
              <span className="step-number">02</span>
              <h3>Share your location</h3>
              <p>Tell us where an authorized delivery is needed.</p>
            </article>
            <article className="step">
              <span className="step-number">03</span>
              <h3>Confirm your request</h3>
              <p>Review the price and submit your booking.</p>
            </article>
          </div>
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
