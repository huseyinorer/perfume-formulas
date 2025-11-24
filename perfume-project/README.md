# Perfume Formulas - Parfüm Formülleri Platformu

A full-stack web application for perfume formula management, sharing, and collaboration. Users can browse perfume formulas, submit their own recipes, rate and comment on formulas, and manage perfume stock.

![GitHub Actions](https://github.com/huseyinorer/perfume-formulas/workflows/Node.js%20CI/badge.svg)

## Features

- 🔐 User authentication with JWT
- 👥 Role-based access (Admin/User)
- 📝 Formula submission and approval workflow
- ⭐ Rating and commenting system
- ❤️ Favorites management
- 📦 Stock management and maturation tracking
- 🌓 Dark mode support
- 📱 Responsive design

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Radix UI components
- Axios for API calls
- Vitest for testing

### Backend
- Node.js with Express.js
- PostgreSQL database
- JWT authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/huseyinorer/perfume-formulas.git
cd perfume-formulas/perfume-project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Database

Create a PostgreSQL database:
```sql
CREATE DATABASE perfume_formulas;
```

Run the database schema (you'll need to create the tables - see Database Schema section below)

### 4. Configure Environment Variables

**Frontend (.env in root):**
```bash
cp .env.example .env
```
Edit `.env` and set:
```
VITE_API_URL=http://localhost:10000/api
```

**Backend (server/.env):**
```bash
cp server/.env.example server/.env
```
Edit `server/.env` and set your database credentials and JWT secret.

### 5. Start Development Servers

Run both frontend and backend:
```bash
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Frontend (port 5173)
npm run dev:frontend

# Terminal 2 - Backend (port 10000)
npm run dev:backend
```

### 6. Access the Application

Open your browser and navigate to:
- Frontend: http://localhost:5173
- Backend API: http://localhost:10000/api

## Database Schema

Key tables:
- `Users` - User accounts with authentication
- `Brands` - Perfume brands
- `Perfumes` - Perfume catalog
- `PerfumeFormulas` - Approved formulas
- `FormulaPendingRequests` - User-submitted formulas awaiting approval
- `FormulaRatings` - Ratings and comments
- `Favorites` - User favorite perfumes
- `PerfumeStock` - Stock management

## Available Scripts

### Development
- `npm run dev` - Run both frontend and backend concurrently
- `npm run dev:frontend` - Run Vite dev server only
- `npm run dev:backend` - Run Express server only

### Testing
- `npm test` - Run all tests with Vitest

### Build & Deploy
- `npm run build` - Build frontend for production
- `npm run deploy` - Deploy to GitHub Pages
- `npm start` - Start production server

## User Roles

### Admin
- Add/delete perfumes and formulas directly
- Approve or reject user-submitted formulas
- Manage stock and maturation records
- All user permissions

### User
- Browse perfume formulas
- Submit formula requests (requires approval)
- Rate and comment on formulas
- Manage favorites
- View stock information

## Project Structure

```
perfume-project/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service layer
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main app component
├── server/                # Backend source
│   ├── routes/            # Express route handlers
│   ├── middleware/        # Express middleware
│   ├── db.js              # Database connection
│   └── server.js          # Server entry point
├── public/                # Static assets
└── dist/                  # Production build output
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub: https://github.com/huseyinorer/perfume-formulas/issues

## Live Demo

Visit: https://huseyinorer.github.io/perfume-formulas
