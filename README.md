🎉 Event Management Platform – Frontend
This is the React.js frontend for the Event Management Platform, designed for seamless event browsing, ticket booking, event creation, and role-based dashboards for Users, Organizers, and Admins.

Built using React, Vite, Tailwind CSS, and connected to the backend via secure API calls.

🌐 Live Demo
🔗 Frontend Hosted On: https://famous-souffle-ff686b.netlify.app/
🔗 Backend API: https://eventmanagement-backend-u4yf.onrender.com/api

⚙️ Tech Stack
Frontend: React.js + Vite

Styling: Tailwind CSS

Routing: React Router DOM

HTTP: Axios

State Management: React Context API

Icons: React Icons

Notifications: React Toastify

PDF & QR Code: jsPDF, html2canvas, react-qrcode-logo

🧑‍💻 Features by Role

👤 User
Register/Login

Browse and view events

Book tickets with Stripe

Cancel or transfer tickets

View and download tickets (PDF/QR)

Update user profile

🧑‍💼 Organizer
Create, edit, delete events

View all own events

View attendees for each event

Export attendee list (CSV)

View stats for events and bookings

🛡️ Admin
Approve or reject events

View/manage all users & organizers

View pending events

Analyze registrations & platform metrics

Create or edit events manually

🧩 Project Structure

EventManagement-Frontend/
│
├── src/
│   ├── api/                # Axios API configs
│   ├── assets/             # Images, videos, etc.
│   ├── components/Shared/  # Navbar, Footer
│   ├── context/            # Auth Context
│   ├── pages/
│   │   ├── Auth/           # Login/Register
│   │   ├── User/           # User flow
│   │   ├── Organizer/      # Organizer dashboard + tools
│   │   ├── Admin/          # Admin panel & management
│   ├── routes/             # Role-based route protection
│   ├── App.jsx             # App setup with routing
│   └── index.js            # Main entry point
├── public/
├── tailwind.config.js
├── postcss.config.js
├── package.json

🚀 Getting Started
1. Clone the repository
bash

git clone https://github.com/SwaminathanVK/EventManagement-Frontend.git
cd EventManagement-Frontend

2. Install dependencies
bash
npm install

4. Setup .env (optional)
Set your backend base URL if using axios.create() or proxy.

4. Run the app
bash

npm run dev
🧪 Available Scripts
Script	Description
npm run dev	Start local dev server
npm run build	Build for production
npm run preview	Preview production build
npm run lint	Run ESLint (if configured)

🖼 Sample UI Pages
Include screenshots in future versions:

User Ticket Page with QR code

Admin Dashboard

Organizer Event Analytics

🔐 Authentication & Routing
Token stored in localStorage

Role-based route protection (AdminRoutes, UserRoutes, OrganizerRoutes)

Redirects after login based on user role

🧠 Smart Integrations
Stripe Checkout for secure payments

QR Code + PDF Download for tickets

CSV export for attendee lists

Toast notifications for all user feedback

🔗 Backend Repository
Connects with:
👉 Backend GitHub Repo
https://github.com/SwaminathanVK/EventManagement_Backend

📄 License
This project is open-source under the MIT License.

🙌 Developed By
Swaminathan VK
MERN Stack Developer | B.E. ECE
