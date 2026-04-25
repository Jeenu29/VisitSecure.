package com.visitSecure.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
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

    // 🔥 ALL TIME FIELDS AS TIMESTAMP
    private Timestamp createdAt;
    private String visitTime;
    private Timestamp approvedAt;
    private Timestamp expiresAt;
    private Timestamp visitTimeTs;   // ✅ actual stored value

    // 🔥 Use Integer (NOT int)
    private Integer durationHours;

    private Boolean entered; // optional but useful
}