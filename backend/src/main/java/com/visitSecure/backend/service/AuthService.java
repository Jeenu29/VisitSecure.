package com.visitSecure.backend.service;

import com.google.cloud.firestore.*;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class AuthService {

    public FirebaseToken verifyToken(String token) throws Exception {
        return FirebaseAuth.getInstance().verifyIdToken(token);
    }

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;

    private final SecureRandom random = new SecureRandom();

    @Autowired
    private Firestore firestore;

    public String createUserIfNotExists(String uid, String email)
            throws ExecutionException, InterruptedException {

        // 🔹 1. Check if user exists
        DocumentReference userRef = firestore.collection("users").document(uid);
        DocumentSnapshot userDoc = userRef.get().get();

        if (userDoc.exists()) {
            return userDoc.getString("hostCode");
        }

        // 🔹 2. Generate hostCode
        String hostCode = generateCode();

        // 🔹 3. Save in USERS collection
        Map<String, Object> userData = new HashMap<>();
        userData.put("email", email);
        userData.put("hostCode", hostCode);
        userData.put("createdAt", FieldValue.serverTimestamp());

        userRef.set(userData);

        Map<String, Object> hostData = new HashMap<>();
        hostData.put("email", email);

        firestore.collection("hostCodes")
                .document(hostCode)
                .set(hostData);

        System.out.println("🔥 SAVING HOST: " + email);
        return hostCode;
    }

    private String generateCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
}