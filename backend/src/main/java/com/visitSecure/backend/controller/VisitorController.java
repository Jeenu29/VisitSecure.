package com.visitSecure.backend.controller;

import com.visitSecure.backend.model.Visitor;
import com.visitSecure.backend.service.VisitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // fix CORS
public class VisitorController {

    @Autowired
    private VisitorService visitorService;

    // 🔹 Create request
    @PostMapping("/pass")
    public String requestVisit(@RequestBody Visitor visitor) {
        try {
            visitor.setStatus("PENDING");
            visitor.setCreatedAt(LocalDateTime.now());

            visitorService.saveVisitor(visitor);

            return "Request submitted";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    // 🔹 Get all visitors
    @GetMapping("/visitors/{hostCode}")
    public List<Visitor> getVisitors(@PathVariable String hostCode) throws Exception {
        return visitorService.getVisitorsByHostCode(hostCode);
    }
}