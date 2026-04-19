package com.visitSecure.backend.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.visitSecure.backend.model.Visitor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class VisitorService {

    private static final String COLLECTION_NAME = "visitors";

    public String saveVisitor(Visitor visitor) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        String id = UUID.randomUUID().toString();
        visitor.setId(id);

        db.collection(COLLECTION_NAME).document(id).set(visitor);

        return id;
    }

    public List<Visitor> getVisitorsByHostCode(String hostCode) throws Exception {

        Firestore db = FirestoreClient.getFirestore();

        return db.collection(COLLECTION_NAME)
                .whereEqualTo("hostCode", hostCode)
                .get()
                .get()
                .getDocuments()
                .stream()
                .map(doc -> doc.toObject(Visitor.class))
                .collect(Collectors.toList());
    }
}