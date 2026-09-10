import { useEffect, useState } from "react";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  // Fetch bookings for logged-in user
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/user/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        return response.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      });
  }, [userId]);

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to cancel booking");
      }

      // Update booking status on screen
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "CANCELLED" }
            : booking
        )
      );

      alert("Booking cancelled successfully ❌");

    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert(`Failed to cancel booking ❌\n\n${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h3>Loading your bookings... 🚗</h3>
      </div>
    );
  }

  // Statistics
  const totalBookings = bookings.length;

  const activeBookings = bookings.filter(
    (booking) => booking.status === "ACTIVE"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "CANCELLED"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;

  return (
    <div className="container py-5">

      {/* Heading */}
      <div className="mb-5">
        <h1 className="fw-bold">
          Welcome Back, {user ? user.name : "User"} 👋
        </h1>

        <p className="text-muted">
          Manage your bookings and rental activities.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-5">

        {/* Total Bookings */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">

              <h2 className="text-primary fw-bold">
                {totalBookings}
              </h2>

              <p className="mb-0 text-muted">
                Total Bookings
              </p>

            </div>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">

              <h2 className="text-success fw-bold">
                {activeBookings}
              </h2>

              <p className="mb-0 text-muted">
                Active Bookings
              </p>

            </div>
          </div>
        </div>

        {/* Cancelled Bookings */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">

              <h2 className="text-danger fw-bold">
                {cancelledBookings}
              </h2>

              <p className="mb-0 text-muted">
                Cancelled Bookings
              </p>

            </div>
          </div>
        </div>

        {/* Completed Bookings */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">

              <h2 className="text-secondary fw-bold">
                {completedBookings}
              </h2>

              <p className="mb-0 text-muted">
                Completed Bookings
              </p>

            </div>
          </div>
        </div>

      </div>

      {/* Booking History */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">

          <h3 className="fw-bold mb-4">My Bookings</h3>

          {bookings.length === 0 ? (

            <div className="text-center py-4">
              <h5>No bookings found 🚗</h5>

              <p className="text-muted">
                Book a vehicle to see your bookings here.
              </p>
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Vehicle</th>
                    <th>Pickup Date</th>
                    <th>Return Date</th>
                    <th>Location</th>
                    <th>Days</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {bookings.map((booking) => (

                    <tr key={booking.id}>

                      <td>{booking.id}</td>

                      <td className="fw-bold">
                        {booking.vehicleName}
                      </td>

                      <td>{booking.pickupDate}</td>

                      <td>{booking.returnDate}</td>

                      <td>{booking.pickupLocation}</td>

                      <td>{booking.rentalDays}</td>

                      <td className="text-primary fw-bold">
                        ₹{booking.totalPrice}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge ${
                            booking.status === "ACTIVE"
                              ? "text-bg-success"
                              : booking.status === "CANCELLED"
                              ? "text-bg-danger"
                              : booking.status === "COMPLETED"
                              ? "text-bg-primary"
                              : "text-bg-secondary"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td>
                        {booking.status === "ACTIVE" ? (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => cancelBooking(booking.id)}
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>
      </div>

    </div>
  );
}

export default Dashboard;