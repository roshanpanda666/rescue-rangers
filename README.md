# Rescue Rangers — Vehicle Breakdown Assistance

A modern web application for requesting roadside mechanic assistance. Users can request help, managers coordinate responses, and mechanics get assigned to jobs.

## 🔑 Credentials

### Manager Portal
- **Email:** `steady-gear-manager@mail.com`
- **Password:** `steady-gear-admin-manager`

### Mechanic Portal
- **Email:** `mechanique@gmail.com`
- **Password:** `steady-gear-mechanique`

### User Portal
- Users register themselves with name, email, password, and phone number.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Features

### User Portal (`/user`)
- Register / Login
- Submit breakdown requests (car model, electric/not, location, people count, photo upload, description)
- Track request status

### Manager Portal (`/manager`)
- Accept incoming requests
- Assign mechanics to jobs
- View mechanic profiles with FREE/BUSY availability
- Contact users directly
- Customize platform theme and content

### Mechanic Portal (`/mechanic`)
- Login with shared credentials
- Create personal profile (name, email, skills, experience)
- View assigned jobs
- Mark jobs as complete (status returns to FREE)

## 🛠️ Tech Stack
- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes
- **Database:** MongoDB Atlas (Mongoose)
- **Styling:** Glass-morphism, orange theme, modern animations
