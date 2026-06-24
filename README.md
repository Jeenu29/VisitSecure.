VisitSecure 🚪

VisitSecure is a smart visitor management system that replaces traditional paper-based visitor logs with a secure digital workflow. Visitors can request access online, hosts can approve or reject requests, and approved visitors receive a time-limited digital pass for entry verification.

✨ Features

Visitor Side

• Submit visitor requests online
• Upload selfie for identity verification
• Enter host code provided by the host
• Track approval status in real-time
• Receive a digital visitor pass upon approval
• View pass validity and expiration status

Host Side

• Secure authentication using Firebase Authentication
• Unique host code generation
• Approve or reject visitor requests
• View visitors scheduled for today
• Access complete visitor history
• Monitor visitor status and visit details

Security Features

• Firebase Authentication for host login
• Protected API endpoints using Spring Security
• Time-limited visitor passes
• Unique approval tokens
• Visitor selfie verification
• CORS protection and backend authorization

🏗️ System Architecture

Frontend → React + Vite + Tailwind CSS

Backend → Spring Boot

Database → Firebase Firestore

Image Storage → Cloudinary

Authentication → Firebase Authentication

Email Service → Resend API

Deployment:

• Frontend: Vercel
• Backend: Render

🛠️ Tech Stack

Frontend

• React
• React Router
• Vite
• Tailwind CSS

Backend

• Java
• Spring Boot
• Spring Security
• Firebase Admin SDK

Cloud Services

• Firebase Firestore
• Firebase Authentication
• Cloudinary
• Resend Email API

🔄 Workflow

1. Host logs in and receives a unique host code.
2. Visitor enters the host code and submits a visit request.
3. Visitor selfie is uploaded to Cloudinary.
4. Request details are stored in Firestore.
5. Host receives an approval email.
6. Host approves or rejects the request.
7. Upon approval, a digital pass is generated.
8. Pass automatically expires after the configured duration.

📸 Screens

Landing Page

Host login and project introduction.

Host Dashboard

• Host Code
• Today's Visitors
• Visitor History
• Visitor Request Management

Visitor Request Form

• Personal Details
• Visit Purpose
• Visit Time
• Selfie Upload

Digital Visitor Pass

• Unique Visit Code
• Visitor Details
• Approval Status
• Expiry Information

🚀 Future Improvements

• QR Code based entry scanning
• Guard verification dashboard
• Real-time notifications
• Multi-organization support
• Analytics and visitor insights
• Domain-based email approvals
• Admin panel for organization management

👨‍💻 Author

Jeenu Bishnoi

B.Tech Student | Full Stack Developer

Focused on building secure, scalable, and user-friendly web applications.
