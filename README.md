# LTI - Talent Tracking System

A full-stack application for tracking and managing talent/candidates with a React frontend and Express backend using Prisma as an ORM.

## Project Structure

```
├── backend/           # Express.js backend with TypeScript
│   ├── src/
│   │   ├── application/    # Application logic
│   │   ├── domain/         # Business logic and models
│   │   ├── infrastructure/ # Infrastructure layer
│   │   ├── presentation/   # Controllers and API layer
│   │   ├── routes/         # Route definitions
│   │   └── index.ts        # Entry point
│   ├── prisma/             # Prisma schema and migrations
│   └── package.json
├── frontend/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── docker-compose.yml # Docker configuration for PostgreSQL
└── README.md
```

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lti-talent-tracking
   ```

2. **Start the PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up the database**
   ```bash
   # Make sure your .env file has the correct DATABASE_URL
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Build and start the backend**
   ```bash
   npm run build
   npm start
   ```

6. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

7. **Start the frontend**
   ```bash
   npm start
   ```

The backend will be running at `http://localhost:3010` and the frontend at `http://localhost:3000`.

## API Endpoints

### Candidates
- `POST /candidates` - Create a new candidate
- `GET /candidates` - Get all candidates
- `GET /candidates/:id` - Get a specific candidate
- `PUT /candidates/:id` - Update a candidate
- `DELETE /candidates/:id` - Delete a candidate

### Example POST /candidates
```json
{
  "firstName": "Albert",
  "lastName": "Saelices",
  "email": "albert.saelices@gmail.com",
  "phone": "656874937",
  "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
  "educations": [
    {
      "institution": "UC3M",
      "title": "Computer Science",
      "startDate": "2006-12-31",
      "endDate": "2010-12-26"
    }
  ],
  "workExperiences": [
    {
      "company": "Coca Cola",
      "position": "SWE",
      "description": "",
      "startDate": "2011-01-13",
      "endDate": "2013-01-17"
    }
  ],
  "cv": {
    "filePath": "uploads/1715760936750-cv.pdf",
    "fileType": "application/pdf"
  }
}
```

## Database Configuration

The PostgreSQL database runs in Docker with the following default settings:
- Host: localhost
- Port: 5432
- User: postgres
- Password: password
- Database: mydatabase

## Development

- Backend development server: `npm run dev` (in backend directory)
- Frontend development server: `npm start` (in frontend directory)
- Database migrations: `npx prisma migrate dev` (in backend directory) 