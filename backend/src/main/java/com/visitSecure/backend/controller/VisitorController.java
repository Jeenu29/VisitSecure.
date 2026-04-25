package com.visitSecure.backend.controller;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.visitSecure.backend.model.Visitor;
import com.visitSecure.backend.service.VisitorService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitor")
@CrossOrigin(origins = "http://localhost:5173")
public class VisitorController {

    @GetMapping("/status")
    public Visitor getStatus(@RequestParam String id) throws Exception {
        Firestore db = FirestoreClient.getFirestore();
        DocumentSnapshot doc = db.collection("visitors").document(id).get().get();
        return doc.toObject(Visitor.class);
    }
    @GetMapping("/today")
    public List<Visitor> todayVisitors(@RequestParam String hostCode) throws Exception {
        return visitorService.getTodayVisitors(hostCode);
    }

    @GetMapping("/approve")
    public String approve(@RequestParam String id) throws Exception {
        visitorService.approveVisitor(id);
        return "<h2 style='font-family:sans-serif; text-align:center; margin-top:50px;'>"
                + "Visitor Approved Successfully"
                + "</h2>";
    }

    @GetMapping("/reject")
    public String reject(@RequestParam String id) throws Exception {
        visitorService.rejectVisitor(id);
        return "<h2 style='font-family:sans-serif; text-align:center; margin-top:50px;'>"
                + "Visitor Rejected Successfully"
                + "</h2>";
    }


    @Autowired
    private VisitorService visitorService;

    @PostMapping("/request")
    public Visitor create(@RequestBody Visitor visitor) throws Exception {
        visitorService.createVisitor(visitor);
        return visitor;
    }

    @GetMapping("/history")
    public List<Visitor> myVisitors(@RequestParam String hostCode) throws Exception {
        return visitorService.getVisitorsByHost(hostCode);
    }

    @GetMapping("/pass")
    public Visitor getPass(@RequestParam String visitCode) throws Exception {

        if (visitCode == null || visitCode.trim().isEmpty()) {
            throw new Exception("VisitCode missing");
        }

        Firestore db = FirestoreClient.getFirestore();

        QuerySnapshot query = db.collection("visitors")
                .whereEqualTo("visitCode", visitCode)
                .get()
                .get();

        if (query.isEmpty()) {
            throw new Exception("Invalid pass");
        }

        return query.getDocuments().get(0).toObject(Visitor.class);
    }
}