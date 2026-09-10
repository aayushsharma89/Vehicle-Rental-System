import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const vehicle = location.state?.vehicle;
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");

  if (!vehicle) {
    return (
      <div className="container py-5 text-center">
        <h2>No Vehicle Selected 🚗</h2>

        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/vehicles")}
        >
          View Vehicles
        </button>
      </div>
    );
  }

  // Calculate number of rental days
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 0;

    const start = new Date(pickupDate);
    const end = new Date(returnDate);

    const difference = end - start;

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return days > 0 ? days : 0;
  };

  const rentalDays = calculateDays();

  // Use pricePerDay from Spring Boot/MySQL
  const totalPrice = rentalDays * vehicle.pricePerDay;

  const handleBooking = async (e) => {
  e.preventDefault();

  // Check if user is logged in
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    alert("Please login before booking a vehicle.");
    navigate("/login");
    return;
  }

  const user = JSON.parse(storedUser);

  // Validate booking details
  if (!pickupDate || !returnDate || !pickupLocation) {
    alert("Please fill in all booking details.");
    return;
  }

  // Validate rental days
  if (rentalDays <= 0) {
    alert("Return date must be after pickup date.");
    return;
  }

  // Booking data
  const bookingData = {
    userId: user.id,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    pickupDate: pickupDate,
    returnDate: returnDate,
    pickupLocation: pickupLocation,
    rentalDays: rentalDays,
    totalPrice: totalPrice
  };

  console.log("Selected vehicle:", vehicle);
  console.log("Logged-in user:", user);
  console.log("Booking data:", bookingData);

  try {
    const response = await fetch(
      "http://localhost:8080/api/bookings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      }
    );

    if (!response.ok) {
  const errorMessage = await response.text();

  throw new Error(
    errorMessage || "Booking failed"
  );
}

    const savedBooking = await response.json();

    console.log("Saved booking:", savedBooking);

    alert(
      `Booking Successful! 🎉🚗\n\n` +
      `Booking ID: ${savedBooking.id}\n` +
      `Vehicle: ${savedBooking.vehicleName}\n` +
      `Rental Days: ${savedBooking.rentalDays}\n` +
      `Total Price: ₹${savedBooking.totalPrice}`
    );

    // Go to dashboard
    navigate("/dashboard");

  }  catch (error) {
  console.error("Error saving booking:", error);

  alert(
    "Booking Failed ❌\n\n" + error.message
  );
}
};

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">

          <h1 className="text-center fw-bold mb-5">
            Complete Your Booking
          </h1>

          {/* Selected Vehicle */}
          <div className="card shadow-sm border-0 mb-4">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="card-img-top"
              style={{
                height: "250px",
                objectFit: "cover"
              }}
            />

            <div className="card-body text-center">

              <h3 className="fw-bold">
                {vehicle.name}
              </h3>

              <p className="text-muted">
                {vehicle.brand} • {vehicle.type}
              </p>

              <h4 className="text-primary">
                ₹{vehicle.pricePerDay} / day
              </h4>

            </div>
          </div>

          {/* Booking Form */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              <h4 className="mb-4">Booking Details</h4>

              <form onSubmit={handleBooking}>

                {/* Pickup Date */}
                <div className="mb-3">
                  <label className="form-label">
                    Pickup Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>

                {/* Return Date */}
                <div className="mb-3">
                  <label className="form-label">
                    Return Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>

                {/* Pickup Location */}
                <div className="mb-4">
                  <label className="form-label">
                    Pickup Location
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter pickup location"
                    value={pickupLocation}
                    onChange={(e) =>
                      setPickupLocation(e.target.value)
                    }
                  />
                </div>

                {/* Booking Summary */}
                {rentalDays > 0 && (
                  <div className="alert alert-info">
                    <h5 className="fw-bold">Booking Summary</h5>

                    <p className="mb-1">
                      Rental Days: <strong>{rentalDays}</strong>
                    </p>

                    <p className="mb-0">
                      Total Price:{" "}
                      <strong>₹{totalPrice}</strong>
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-success w-100 btn-lg"
                >
                  Confirm Booking 🚗
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Booking;