# Airbnb Clone - Full Stack Capstone Project

A comprehensive, full-stack Airbnb clone built as a capstone project. This application features a fully responsive modern frontend, an Admin Dashboard for managing listings, and a robust Node.js backend.

![Live App Demo](https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80)

**🔗 [Live Demo on Heroku](https://blooming-waters-45921-40c591d120cc.herokuapp.com/)**

## ✨ Features

### Client Frontend
- **Modern UI/UX:** Pixel-perfect clone of Airbnb's core design system, fully responsive across mobile and desktop.
- **Dynamic Search & Filtering:** Browse properties by location.
- **Interactive Visual Calendar:** Custom-built interactive date picker for selecting check-in and check-out dates.
- **Dynamic Cost Calculator:** Automatically calculates nightly rates, cleaning fees, service fees, and occupancy taxes based on selected dates.
- **Property Details:** Rich image galleries and detailed static property descriptions.

### Admin / Host Dashboard
- **Role-Based Authentication:** Secure login using JWTs.
- **Listing Management (CRUD):** Create, read, update, and delete property listings seamlessly.
- **Image Uploads:** Robust multipart form handling to upload and store property images and host avatars.
- **Reservation Management:** View and manage reservations made by clients.

### Backend Infrastructure
- **RESTful API:** Clean, modular architecture built with Node.js and Express.
- **Database:** MongoDB and Mongoose ODM for efficient, schema-based data modeling.
- **Security:** Password hashing, JWT session handling, and protected API routes.

## 🛠 Tech Stack

- **Frontend:** React.js, Vite, Vanilla CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Deployment:** Heroku

## 🚀 Local Setup Instructions

If you want to run this project locally, follow these steps:

### Prerequisites
- Node.js installed
- A MongoDB cluster/URI

### 1. Clone the repository
```bash
git clone https://github.com/neomalesa/capstone_project.git
cd capstone_project
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside the `backend` directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```
The application will be running at `http://localhost:5173`.

---

*This project was built to demonstrate proficiency in full-stack web development, REST API design, React state management, and modern UI implementation.*
