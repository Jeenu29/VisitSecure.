package com.visitSecure.backend.model;

import lombok.Data;
import com.google.cloud.Timestamp;

@Data
public class Visitor {

    private String id;

    private String name;
    private String email;
    private String phone;
    private String purpose;

    private String selfie;      // base64 (incoming only)
    private String selfieUrl;   // stored URL

    private String hostCode;
    private String visitCode;

    private String status; // PENDING, APPROVED, REJECTED

    private Timestamp createdAt;
    private String visitTime;
    private Timestamp approvedAt;
    private Timestamp expiresAt;
    private Timestamp visitTimeTs;

    private Integer durationHours;

    private Boolean entered;

    private String actionToken;
    private Timestamp tokenExpiry;
}