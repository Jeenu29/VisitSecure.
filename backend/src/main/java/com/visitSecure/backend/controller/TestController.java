package com.visitSecure.backend.controller;

import com.visitSecure.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private AuthService authService;

    @GetMapping
    public String testAuth(@RequestHeader("Authorization") String header) {
        try {
            System.out.println("HEADER: " + header);

            String token = header.replace("Bearer ", "");
            System.out.println("TOKEN: " + token);

            var decoded = authService.verifyToken(token);

            return "User authenticated: " + decoded.getUid();

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 IMPORTANT
            return "Invalid token ❌";
        }
    }
}