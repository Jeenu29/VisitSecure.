package com.visitSecure.backend.service;

import com.visitSecure.backend.model.Visitor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendApprovalEmail(Visitor visitor, String hostEmail) throws Exception {

        String approveLink = "http://localhost:8080/api/visitor/approve?id=" + visitor.getId();
        String rejectLink = "http://localhost:8080/api/visitor/reject?id=" + visitor.getId();

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("visitesecure29@gmail.com");
        helper.setTo(hostEmail);
        helper.setSubject("VisitSecure - Visitor Approval Needed");

        String htmlContent =
                "<div style='font-family:Segoe UI, sans-serif; background:#f3f4f6; padding:30px;'>"

                        + "<div style='max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.1);'>"

                        // Header
                        + "<div style='background:#6366f1; padding:20px; text-align:center; color:white;'>"
                        + "<h2 style='margin:0;'>🚪 VisitSecure</h2>"
                        + "<p style='margin:5px 0 0;'>Visitor Approval Required</p>"
                        + "</div>"

                        // Body
                        + "<div style='padding:20px;'>"

                        + "<p style='font-size:16px;'>A visitor has requested access:</p>"

                        + "<div style='background:#f9fafb; padding:15px; border-radius:8px;'>"
                        + "<p><b>Name:</b> " + visitor.getName() + "</p>"
                        + "<p><b>Email:</b> " + visitor.getEmail() + "</p>"
                        + "<p><b>Purpose:</b> " + visitor.getPurpose() + "</p>"
                        + "<p><b>Visit Time:</b> " + visitor.getVisitTime() + "</p>"
                        + "</div>"

                        // Selfie
                        + "<div style='text-align:center; margin-top:20px;'>"
                        + "<p style='font-size:14px; color:gray;'>Visitor Selfie</p>"
                        + "<img src='" + visitor.getSelfieUrl() + "' style='width:140px; border-radius:12px; border:2px solid #e5e7eb;'/>"
                        + "</div>"

                        // Buttons
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

                        // Footer
                        + "<div style='text-align:center; padding:15px; font-size:12px; color:#9ca3af;'>"
                        + "VisitSecure • Smart Visitor Management"
                        + "</div>"

                        + "</div></div>";

        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}