# Notes App

A simple and stylish **Notes Application** built using **Spring Boot**, **MongoDB**, and a clean **HTML/CSS/JS** frontend. This app allows users to create, read, update, and delete notes with a modern glassmorphism and neon-inspired design.
## Features

- Add new notes with a **title** and **content**.
- Edit existing notes.
- Delete notes with smooth animations.
- All notes are stored in **MongoDB**.
- Responsive design that looks good on desktop and mobile.
- Stylish gradient text and dark theme for a modern look.

---

## Tech Stack

- **Backend:** Java, Spring Boot
- **Database:** MongoDB
- **Frontend:** HTML, CSS (Glassmorphism + Neon Buttons), JavaScript
- **Build Tool:** Maven  
- **Dependency Management:** Spring Boot Starter

---

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/notes-app.git
cd notes-app


2. Setup MongoDB

Create a cluster on MongoDB Atlas (or use local MongoDB).

Get the connection string and update application.properties:

spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster0.mongodb.net/notesdb?retryWrites=true&w=majority


3. Run the Spring Boot App

mvn spring-boot:run


The backend will start at http://localhost:8080.

4. Open Frontend

Open index.html in a browser (or serve it using any static server).

Make sure the API URL in app.js points to your backend:

const API_URL = "http://localhost:8080/api/notes";

#Usage

Add a note using the form at the top.

Your notes appear below in stylish cards.

Edit or delete notes using the respective buttons.

Everything is synced with MongoDB in real-time.



#Contributing
Contributions are welcome! If you want to improve the app or fix bugs, feel free to open a pull request.

