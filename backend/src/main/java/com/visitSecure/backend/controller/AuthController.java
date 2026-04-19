package com.visitSecure.backend.controller;

import com.visitSecure.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String registerUser(
            @RequestHeader("Authorization") String header
    ) {
        try {
            String token = header.replace("Bearer ", "");

            var decoded = authService.verifyToken(token);

            String uid = decoded.getUid();
            String email = decoded.getEmail();

            return authService.createUserIfNotExists(uid, email);

        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}