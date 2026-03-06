
# Employment Management System (EMS)

A comprehensive employment management system with features for HR, administrators and employees.

## Features

- Multi-role access (Admin, HR, Employee)
- Employee management
- Leave request management
- Task management
- Attendance tracking
- Payroll system
- Recruitment and job application processing

## Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/new-Varshit/employment-management-system.git
cd employment-management-system
```

2. Install dependencies for both frontend and backend

```bash
# Install frontend dependencies
npm install

# Navigate to backend directory
cd backend

# Install backend dependencies
npm install
```

3. Configure the environment variables

```bash
# In the backend directory, create a .env file with the following
MONGODB_URI=mongodb://localhost:27017/worknet360
JWT_SECRET=your_jwt_secret_key_should_be_secured
PORT=5000
```

4. Start the backend server

```bash
# In the backend directory
npm run dev
```

5. Start the frontend development server

```bash
# In the project root directory
npm run dev
```

The application should now be running at `http://localhost:5173`

## Default User Accounts

For testing purposes, the following accounts are available:

- **Admin:** admin@ems.com / admin123
- **HR:** hr@ems.com / hr123
- **Employee:** employee@ems.com / employee123

## Production Deployment

For production deployment:

1. Build the frontend

```bash
npm run build
```

2. Set up a production MongoDB database

3. Configure the backend for production by setting the appropriate environment variables

4. Deploy both the frontend and backend to your preferred hosting providers

## License

This project is licensed under the MIT License - see the LICENSE file for details.
