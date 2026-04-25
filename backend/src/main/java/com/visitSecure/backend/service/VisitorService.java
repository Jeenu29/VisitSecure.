package com.visitSecure.backend.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.visitSecure.backend.model.Visitor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class VisitorService {

    @Autowired
    private EmailService emailService;

    public Visitor createVisitor(Visitor visitor) throws Exception {
        String hostCode = visitor.getHostCode().trim().toUpperCase();
        visitor.setHostCode(hostCode);

        System.out.println("RAW HOST CODE: [" + hostCode + "]");
        System.out.println("AFTER TRIM+UPPER: [" + hostCode.trim().toUpperCase() + "]");

        Firestore db = FirestoreClient.getFirestore();

        System.out.println("HOST CODE RECEIVED: " + hostCode);

        DocumentSnapshot doc = db.collection("hostCodes")
                .document(hostCode)
                .get()
                .get();

        System.out.println("LOOKING FOR: " + hostCode);
        System.out.println("DOC EXISTS: " + doc.exists());

        if (!doc.exists()) {
            throw new Exception("Invalid Host Code");
        }

        String hostEmail = doc.getString("email");

        if (hostEmail == null || hostEmail.isEmpty()) {
            throw new Exception("Host email not found");
        }

        String id = UUID.randomUUID().toString();
        visitor.setId(id);
        visitor.setStatus("PENDING");
        visitor.setCreatedAt(Timestamp.now());

        if (visitor.getVisitTime() != null && !visitor.getVisitTime().isEmpty()) {

            LocalDateTime ldt = LocalDateTime.parse(visitor.getVisitTime());

            Timestamp ts = Timestamp.ofTimeSecondsAndNanos(
                    ldt.atZone(ZoneId.systemDefault()).toEpochSecond(),
                    0
            );

            visitor.setVisitTimeTs(ts);

        } else {
            visitor.setVisitTimeTs(Timestamp.now()); // fallback
        }

        if (visitor.getSelfie() != null && !visitor.getSelfie().isEmpty()) {
            String selfieUrl = uploadSelfie(visitor.getSelfie());
            visitor.setSelfieUrl(selfieUrl);
        }

        visitor.setSelfie(null);

        db.collection("visitors").document(id).set(visitor).get();

        emailService.sendApprovalEmail(visitor, hostEmail);

        return visitor;
    }

    public List<Visitor> getVisitorsByHost(String hostCode) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        Query query = db.collection("visitors")
                .whereEqualTo("hostCode", hostCode);

        QuerySnapshot snapshot = query.get().get();

        return snapshot.getDocuments()
                .stream()
                .map(doc -> doc.toObject(Visitor.class))
                .collect(Collectors.toList());
    }

    @Autowired
    private Cloudinary cloudinary;

    public String uploadSelfie(String base64Image) throws Exception {

        Map uploadResult = cloudinary.uploader().upload(
                base64Image,
                ObjectUtils.asMap(
                        "folder", "visitors",
                        "resource_type", "image"
                )
        );

        return uploadResult.get("secure_url").toString();
    }

    public String approveVisitor(String id) throws Exception {

        Firestore db = FirestoreClient.getFirestore();
        DocumentReference ref = db.collection("visitors").document(id);

        DocumentSnapshot doc = ref.get().get();

        if (!doc.exists()) {
            throw new Exception("Visitor not found");
        }

        Visitor visitor = doc.toObject(Visitor.class);

        String visitCode = "VS-" + UUID.randomUUID()
                .toString()
                .substring(0, 6)
                .toUpperCase();

        int duration = visitor.getDurationHours() != null
                ? visitor.getDurationHours()
                : 2;

        Timestamp now = Timestamp.now();
        Timestamp visitStart = visitor.getVisitTimeTs();

        Timestamp start = visitStart != null && visitStart.getSeconds() > now.getSeconds()
                ? visitStart
                : now;

        Timestamp expiry = Timestamp.ofTimeSecondsAndNanos(
                start.getSeconds() + (duration * 3600),
                0
        );

        Map<String, Object> update = new HashMap<>();
        update.put("status", "APPROVED");
        update.put("visitCode", visitCode);
        update.put("approvedAt", now);
        update.put("expiresAt", expiry);

        ref.update(update);

        return visitCode;
    }

    public String rejectVisitor(String id) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        db.collection("visitors")
                .document(id)
                .update("status", "REJECTED");

        return "Rejected";
    }

    public List<Visitor> getTodayVisitors(String hostCode) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        String normalizedCode = hostCode.trim().toUpperCase();

        LocalDate today = LocalDate.now(ZoneId.systemDefault());

        Timestamp startOfDay = Timestamp.ofTimeSecondsAndNanos(
                today.atStartOfDay(ZoneId.systemDefault()).toEpochSecond(),
                0
        );

        Timestamp nextDayStart = Timestamp.ofTimeSecondsAndNanos(
                today.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toEpochSecond(),
                0
        );

        Query query = db.collection("visitors")
                .whereEqualTo("hostCode", normalizedCode)
                .whereGreaterThanOrEqualTo("visitTimeTs", startOfDay)
                .whereLessThan("visitTimeTs", nextDayStart); // 🔥 FIX

        QuerySnapshot snapshot = query.get().get();

        System.out.println("🔥 TODAY COUNT: " + snapshot.size());

        return snapshot.getDocuments()
                .stream()
                .map(doc -> doc.toObject(Visitor.class))
                .collect(Collectors.toList());
    }

    public List<Visitor> getAllVisitors() throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        ApiFuture<QuerySnapshot> future = db.collection("visitors").get();

        return future.get().getDocuments()
                .stream()
                .map(doc -> doc.toObject(Visitor.class))
                .collect(Collectors.toList());
    }
}