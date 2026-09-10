package com.vehiclerental.backend.controller;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vehiclerental.backend.entity.Vehicle;
import com.vehiclerental.backend.repository.VehicleRepository;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://vehicle-rental-system-1-wtsb.onrender.com"
})
public class VehicleController {

    @Autowired
    private VehicleRepository vehicleRepository;

    // Get all vehicles
    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }
}