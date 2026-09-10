import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Vehicles() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch vehicles from Spring Boot API
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/vehicles`)
      .then((response) => response.json())
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching vehicles:", error);
        setLoading(false);
      });
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      selectedType === "All" || vehicle.type === selectedType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading vehicles... 🚗</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Our Vehicles</h1>
        <p className="text-muted">
          Browse our vehicles and choose the perfect ride for your journey
        </p>
      </div>

      {/* Search and Filter */}
      <div className="row mb-5">
        <div className="col-md-8 mb-3">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="Search vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select form-select-lg"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="All">All Vehicles</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Bike">Bike</option>
            <option value="Hatchback">Hatchback</option>
          </select>
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className="row g-4">
        {filteredVehicles.map((vehicle) => (
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
                <h4 className="card-title fw-bold">
                  {vehicle.name}
                </h4>

                <p className="text-muted mb-2">
                  {vehicle.brand} • {vehicle.type}
                </p>

               <h5 className="text-primary">
                  ₹{vehicle.pricePerDay} / day
                </h5>

                {/* Vehicle Availability */}
                <p className="mt-3 mb-2">
                  {vehicle.available ? (
                    <span className="badge text-bg-success">
                      Available
                    </span>
                  ) : (
                    <span className="badge text-bg-danger">
                      Unavailable
                    </span>
                  )}
                </p>

                {/* Rent Button */}
                <button
                  className={`btn w-100 mt-2 ${
                    vehicle.available
                      ? "btn-primary"
                      : "btn-secondary"
                  }`}
                  disabled={!vehicle.available}
                  onClick={() =>
                    navigate("/booking", { state: { vehicle } })
                  }
                >
                  {vehicle.available
                    ? "Rent Now 🚗"
                    : "Currently Unavailable"}
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center mt-5">
          <h4>No vehicles found 😔</h4>
        </div>
      )}
    </div>
  );
}

export default Vehicles;