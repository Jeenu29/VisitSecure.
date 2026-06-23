package com.visitSecure.backend.service;

import com.visitSecure.backend.model.Visitor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String resendApiKey;

    @Value("${BACKEND_URL}")
    private String backendUrl;

    public void sendApprovalEmail(Visitor visitor, String hostEmail) throws Exception {

        String approveLink =
                backendUrl + "/api/visitor/approve?id="
                        + visitor.getId()
                        + "&token="
                        + visitor.getActionToken();

        String rejectLink =
                backendUrl + "/api/visitor/reject?id="
                        + visitor.getId()
                        + "&token="
                        + visitor.getActionToken();

        String htmlContent =
                "<div style='font-family:Segoe UI, sans-serif; background:#f3f4f6; padding:30px;'>"

                        + "<div style='max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.1);'>"

                        + "<div style='background:#ccaae6; padding:20px; text-align:center; color:white;'>"
                        + "<h2 style='margin:0;'>🚪 VisitSecure</h2>"
                        + "<p style='margin:5px 0 0;'>Visitor Approval Required</p>"
                        + "</div>"

                        + "<div style='padding:20px;'>"

                        + "<p style='font-size:16px;'>A visitor has requested access:</p>"

                        + "<div style='background:#f9fafb; padding:15px; border-radius:8px;'>"
                        + "<p><b>Name:</b> " + visitor.getName() + "</p>"
                        + "<p><b>Email:</b> " + visitor.getEmail() + "</p>"
                        + "<p><b>Purpose:</b> " + visitor.getPurpose() + "</p>"
                        + "<p><b>Visit Time:</b> " + visitor.getVisitTime() + "</p>"
                        + "</div>"

                        + "<div style='text-align:center; margin-top:20px;'>"
                        + "<p style='font-size:14px; color:gray;'>Visitor Selfie</p>"
                        + "<img src='" + visitor.getSelfieUrl() + "' style='width:140px; border-radius:12px; border:2px solid #e5e7eb;'/>"
                        + "</div>"

                        + "<div style='text-align:center; margin-top:25px;'>"

                        + "<a href='" + approveLink + "' "
                        + "style='background:#22c55e; color:white; padding:12px 25px; margin:10px; "
                        + "text-decoration:none; border-radius:8px; font-weight:bold;'>"
                        + "Approve</a>"

                        + "<a href='" + rejectLink + "' "
                        + "style='background:#ef4444; color:white; padding:12px 25px; margin:10px; "
                        + "text-decoration:none; border-radius:8px; font-weight:bold;'>"
                        + "Reject</a>"

                        + "</div>"

                        + "</div>"

                        + "<div style='text-align:center; padding:15px; font-size:12px; color:#9ca3af;'>"
                        + "VisitSecure • Smart Visitor Management"
                        + "</div>"

                        + "</div></div>";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey);

        String escapedHtml = htmlContent
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "");

        String requestBody =
                "{"
                        + "\"from\":\"VisitSecure <onboarding@resend.dev>\","
                        + "\"to\":[\"" + hostEmail + "\"],"
                        + "\"subject\":\"VisitSecure - Visitor Approval Needed\","
                        + "\"html\":\"" + escapedHtml + "\""
                        + "}";

        HttpEntity<String> request =
                new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        "https://api.resend.com/emails",
                        request,
                        String.class
                );

        System.out.println("EMAIL RESPONSE:");
        System.out.println(response.getStatusCode());
        System.out.println(response.getBody());
    }
}