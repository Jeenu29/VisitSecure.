package com.visitSecure.backend.model;

import lombok.Data;

@Data
public class Host {

    private String name;
    private String email;

    // 🔥 OPTIONAL but useful
    private String hostCode;

    public Host() {}

    public Host(String name, String email, String hostCode) {
        this.name = name;
        this.email = email;
        this.hostCode = hostCode;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getHostCode() { return hostCode; }
    public void setHostCode(String hostCode) { this.hostCode = hostCode; }
}