package com.visitSecure.backend.service;

import com.google.cloud.firestore.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class AuthService {

    private static final String COLLECTION = "users";
    private static final String CODE_COLLECTION = "hostCodes";

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;

    private final SecureRandom random = new SecureRandom();

    @Autowired
    private Firestore firestore;

    public String createUserIfNotExists(String uid, String email)
            throws ExecutionException, InterruptedException {

        DocumentReference userRef = firestore.collection(COLLECTION).document(uid);
        DocumentSnapshot userDoc = userRef.get().get();

        // ✅ If user exists → return same hostCode
        if (userDoc.exists()) {
            return userDoc.getString("hostCode");
        }

        // ✅ Generate UNIQUE host code
        String hostCode = generateUniqueHostCode();

        // ✅ Save user
        Map<String, Object> userData = new HashMap<>();
        userData.put("email", email);
        userData.put("hostCode", hostCode);
        userData.put("createdAt", FieldValue.serverTimestamp());

        userRef.set(userData);

        return hostCode;
    }

    // 🔐 Generate unique code (collision-safe)
    private String generateUniqueHostCode()
            throws ExecutionException, InterruptedException {

        String code;
        DocumentReference codeRef;

        do {
            code = generateCode();
            codeRef = firestore.collection(CODE_COLLECTION).document(code);
        } while (codeRef.get().get().exists()); // retry if collision

        // Reserve the code
        Map<String, Object> codeData = new HashMap<>();
        codeData.put("createdAt", FieldValue.serverTimestamp());
        codeRef.set(codeData);

        return code;
    }

    // 🎯 Generate random 6-char code
    private String generateCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
}