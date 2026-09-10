package com.vehiclerental.backend.booking;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Get bookings for a specific user
    List<Booking> findByUserId(Long userId);


    // Find bookings for the same vehicle
    // where booking dates overlap
    List<Booking> findByVehicleIdAndStatusNotAndPickupDateLessThanEqualAndReturnDateGreaterThanEqual(
            Long vehicleId,
            String status,
            LocalDate returnDate,
            LocalDate pickupDate
    );

}