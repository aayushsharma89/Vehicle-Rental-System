import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  // Fetch vehicles from Spring Boot API
  useEffect(() => {
    fetch("http://localhost:8080/api/vehicles")
      .then((response) => response.json())
      .then((data) => {
        // Show only first 3 vehicles as featured
        setVehicles(data.slice(0, 3));
      })
      .catch((error) => {
        console.error("Error fetching vehicles:", error);
      });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="container py-5">
        <div className="row align-items-center min-vh-75">

          <div className="col-md-6">
            <h1 className="display-4 fw-bold">
              Find Your Perfect <span className="text-primary">Ride</span>
            </h1>

            <p className="lead text-muted mt-3">
              Rent the perfect vehicle for your journey. Choose from cars,
              bikes, and premium vehicles at affordable prices.
            </p>

            <div className="mt-4">
              <button
                className="btn btn-primary btn-lg me-3"
                onClick={() => navigate("/vehicles")}
              >
                Explore Vehicles
              </button>

              <button className="btn btn-outline-dark btn-lg">
                Learn More
              </button>
            </div>
          </div>

          <div className="col-md-6 text-center mt-4 mt-md-0">
            <div className="p-5 bg-light rounded-4">
              <div style={{ fontSize: "120px" }}>🚗</div>

              <h3 className="fw-bold">Drive Your Journey</h3>

              <p className="text-muted">
                Easy booking. Affordable prices. Amazing vehicles.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Featured Vehicles Section */}
      <section className="bg-light py-5">
        <div className="container">

          <div className="text-center mb-5">
            <h2 className="fw-bold">Featured Vehicles</h2>
            <p className="text-muted">
              Choose from our most popular vehicles
            </p>
          </div>

          <div className="row g-4">
            {vehicles.map((vehicle) => (
              <div className="col-md-4" key={vehicle.id}>
                <div className="card h-100 shadow-sm border-0">

                  {/* Vehicle Image */}
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="card-img-top"
                    style={{
                      height: "200px",
                      objectFit: "cover"
                    }}
                  />

                  <div className="card-body">
                    <h4 className="card-title">
                      {vehicle.name}
                    </h4>

                    <p className="text-muted">
                      {vehicle.brand} • {vehicle.type}
                    </p>

                    <h5 className="text-primary fw-bold">
                      ₹{vehicle.pricePerDay} / day
                    </h5>

                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={() => navigate("/vehicles")}
                    >
                      View Vehicles
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default Home;