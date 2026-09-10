package com.vehiclerental.backend.booking;

import com.vehiclerental.backend.entity.Vehicle;
import com.vehiclerental.backend.repository.VehicleRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VehicleRepository vehicleRepository;


    // Save a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {

        // Check if vehicle exists
        Vehicle vehicle = vehicleRepository.findById(booking.getVehicleId())
                .orElse(null);

        if (vehicle == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Vehicle not found");
        }

        // Check if vehicle is available
        if (!vehicle.isAvailable()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Vehicle is currently unavailable");
        }

        // Check overlapping bookings
        List<Booking> overlappingBookings =
                bookingRepository
                        .findByVehicleIdAndStatusNotAndPickupDateLessThanEqualAndReturnDateGreaterThanEqual(
                                booking.getVehicleId(),
                                "CANCELLED",
                                booking.getReturnDate(),
                                booking.getPickupDate()
                        );

        if (!overlappingBookings.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Vehicle is already booked for the selected dates");
        }

        // New booking
        booking.setStatus("ACTIVE");

        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }


    // Get all bookings
    @GetMapping
    public List<Booking> getAllBookings() {

        updateCompletedBookings();

        return bookingRepository.findAll();
    }


    // Get bookings for a specific user
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUserId(
            @PathVariable Long userId) {

        updateCompletedBookings();

        return bookingRepository.findByUserId(userId);
    }


    // Cancel a booking
    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        // Don't cancel completed bookings
        if ("COMPLETED".equals(booking.getStatus())) {
            throw new RuntimeException(
                    "Completed booking cannot be cancelled"
            );
        }

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }


    // Automatically update completed bookings
    private void updateCompletedBookings() {

        List<Booking> bookings = bookingRepository.findAll();

        LocalDate today = LocalDate.now();

        for (Booking booking : bookings) {

            // Keep cancelled bookings unchanged
            if ("CANCELLED".equals(booking.getStatus())) {
                continue;
            }

            // If return date has passed → COMPLETED
            if (booking.getReturnDate() != null &&
                    booking.getReturnDate().isBefore(today)) {

                booking.setStatus("COMPLETED");

                bookingRepository.save(booking);
            }
        }
    }
}