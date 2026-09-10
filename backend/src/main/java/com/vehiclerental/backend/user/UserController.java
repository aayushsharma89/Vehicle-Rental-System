package com.vehiclerental.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Register User
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {

        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {
            return "Email already registered!";
        }

        userRepository.save(user);

        return "Registration successful!";
    }

    // Login User
    @PostMapping("/login")
    public User loginUser(@RequestBody User loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user != null &&
            user.getPassword().equals(loginRequest.getPassword())) {

            return user;
        }

        return null;
    }
}