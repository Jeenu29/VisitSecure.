package com.visitSecure.backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Visitor {

    private String id;

    private String name;
    private String email;
    private String phone;
    private String purpose;

    private String hostCode;
    private String visitCode;

    private String status;

    private LocalDateTime createdAt;
    private LocalDateTime visitTime;
}
