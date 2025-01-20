# Task Manager Application

A modern task management application built with React, Node.js, MongoDB, and Firebase Authentication.

## Features

- 🔐 Secure authentication with Firebase
- 📋 Create, read, update, and delete tasks
- 🎯 Task prioritization (Low, Medium, High)
- 📊 Status tracking (Pending, In Progress, Completed)
- 🔄 Drag and drop task management
- 📱 Responsive design

## Tech Stack

- **Frontend:**
  - React.js
  - Redux Toolkit
  - React Bootstrap
  - React Beautiful DnD
  - Firebase Authentication

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (Mongodb Atlas)
  - Firebase Admin SDK

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone 
cd task-manager
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd api
npm install
```

3. Configuration:

Create `.env` files in both root and api directories:

Frontend `.env`:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Backend `.env`:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Start the application:

```bash
# Start backend server (from api directory)
npm run dev

# Start frontend (from root directory)
npm run dev
```

## Project Structure

```
task-manager/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   └── tasks/
│   ├── store/
│   │   └── slices/
│   ├── utils/
│   └── pages/
├── api/
│   ├── models/
│   ├── routes/
│   └── server.js
└── public/
```

## API Endpoints

- `POST /api/tasks` - Create new task
- `GET /api/tasks` - Get all tasks
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

