# 🚀 Freelance Marketplace API (Upwork Clone)

![Website Preview](https://res.cloudinary.com/dgagbheuj/image/upload/v1774495924/qimodtcb83kflszta2zc.png)

A powerful **Full-Stack Backend API** for a freelance marketplace platform inspired by Upwork.  
Built with **NestJS, MongoDB, Redis, and Socket.IO**, this system provides real-time communication, project management, contracts, proposals, and notifications.

---

## 🧠 Overview

This project is a **production-ready backend** for a freelance platform where:

- Clients can post projects
- Freelancers can submit proposals
- Contracts manage agreements
- Users can chat in real-time
- Notifications are handled efficiently with Redis
- Clients can review freelancers after project completion

---

## ⚙️ Tech Stack

- **Framework:** NestJS
- **Database:** MongoDB (Mongoose)
- **Caching:** Redis
- **Realtime:** Socket.IO
- **Authentication:** JWT
- **File Uploads:** Cloudinary
- **Password Hashing:** bcrypt
- **Validation:** validator.js

---

## 🔐 Authentication & Roles

The system supports role-based access control:

- `CLIENT`
- `FREELANCER`
- `ADMIN`

### Features:

- Secure JWT authentication
- Custom Guards:
  - AuthGuard
  - ClientGuard
  - FreelancerGuard
  - AdminGuard

---

## 📦 Core Features

### 👤 User System

- User registration & login
- Role-based account creation
- Avatar upload via Cloudinary
- Get user profile
- Admin can delete users

### 💼 Projects

- Clients create and manage projects
- Budget types:
  - `FIXED`
  - `HOURLY`
- Project statuses:
  - `OPEN`
  - `IN_PROGRESS`
  - `COMPLETED`
  - `CANCELED`

### 📩 Proposals

- Freelancers submit proposals to projects
- Clients can accept/reject proposals
- Auto-reject other proposals when one is accepted

Proposal statuses:

- `PENDING`
- `ACCEPTED`
- `REJECTED`

### 📄 Contracts

- Created after proposal acceptance
- Tracks agreement between client and freelancer
- Includes:
  - Agreed price
  - Duration

Contract statuses:

- `ACTIVE`
- `COMPLETED`
- `CANCELLED`

### 💬 Real-Time Chat

- Messaging between client and freelancer
- Supports:
  - Text messages
  - Image uploads
- Features:
  - Read/Unread messages
  - Typing indicator (WebSocket)

### 🔔 Notifications System

- Real-time notifications using Redis + WebSockets
- Features:
  - Unread count (cached in Redis)
  - Instant push notifications
  - Mark as read / mark all as read
  - Delete notifications

### ⭐ Reviews & Ratings

- Clients can review freelancers after contract completion
- Rating categories:
  - Professionalism
  - Communication
  - Quality
  - Expertise
  - Delivery
  - Rehire likelihood
- Automatic average rating calculation

### 👨‍💼 Freelancer Profile

- Update:
  - Job title
  - Bio
  - Skills (validated enum)
  - Hourly rate

### 🏢 Client Profile

- Update:
  - Company name
  - Bio

---

## ⚡ Real-Time Features (WebSockets)

### Chat Gateway

- Online users tracking
- Typing indicator
- Real-time messaging
- Message seen events

### Notification Gateway

- Multi-device support
- Instant notification delivery
- Real-time sync

---

## 🧩 API Structure

/api/auth
/api/project
/api/proposal
/api/contract
/api/message
/api/notification
/api/review
/api/freelancer
/api/client

---

## 🛠️ Installation

```bash
git clone <your-repo-url>
cd backend
npm install
🔑 Environment Variables

Create a .env file:

DATABASE_URL=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=your_secret

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

REDIS_URL=xxx
PORT=3000

FRONTEND_URL=http://localhost:3000
▶️ Running the App
npm run start:dev
🚀 Future Improvements
💳 Payment Integration (Coming Soon)
Stripe integration
PayPal support
Wallet system (balance & frozen balance already prepared)
📊 Analytics Dashboard
🧠 Smart freelancer recommendations
🌍 Multi-language support
📌 Notes
Designed with scalability in mind
Clean architecture using NestJS modules & services
Optimized with Redis caching for performance
Real-time ready for modern applications
👨‍💻 Author

Built with ❤️ by a Staff/Senior Full-Stack Developer aiming to create production-level systems.

⭐ Support

If you like this project, give it a ⭐ on GitHub!
```
