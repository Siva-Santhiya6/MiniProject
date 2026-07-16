# CGPA Calculator — Backend

Node.js + Express REST API with MongoDB (Mongoose) for CRUD operations on student CGPA records.

## Folder Structure
```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   └── recordController.js # CRUD logic + CGPA calculation
├── models/
│   └── Record.js           # Mongoose schema (auto-calculates CGPA)
├── routes/
│   └── recordRoutes.js     # API routes
├── server.js                # App entry point
├── .env.example
├── postman_collection.json  # Import into Postman to test all routes
└── package.json
```

## Setup

1. Install dependencies:
   ```
   cd backend
   npm install
   ```

2. Make sure MongoDB is running locally, or use MongoDB Atlas (cloud).
   Copy `.env.example` to `.env` and set your connection string:
   ```
   cp .env.example .env
   ```
   Example `.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/cgpa_calculator
   ```
   For Atlas, MONGO_URI looks like:
   `mongodb+srv://<user>:<password>@cluster0.mongodb.net/cgpa_calculator`

3. Run the server:
   ```
   npm run dev     # with nodemon (auto-restart)
   npm start       # plain node
   ```
   Server runs at `http://localhost:5000`

## API Endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|---------------------------------------|
| POST   | /api/records           | Create a new CGPA record              |
| GET    | /api/records           | Get all records                       |
| GET    | /api/records/:id       | Get a single record by ID             |
| PUT    | /api/records/:id       | Update a record (CGPA auto-recalculated) |
| DELETE | /api/records/:id       | Delete a record                       |
| POST   | /api/calculate          | Calculate CGPA without saving to DB   |

### Sample request body (POST /api/records)
```json
{
  "studentName": "Saumya S",
  "registerNumber": "7212XXXXXX",
  "semester": "Semester 4",
  "subjects": [
    { "subjectName": "DAA", "credit": 4, "gradePoint": 9 },
    { "subjectName": "DBMS", "credit": 3, "gradePoint": 8 },
    { "subjectName": "OS", "credit": 4, "gradePoint": 9 }
  ]
}
```
`cgpa` is calculated automatically as `sum(credit * gradePoint) / sum(credit)` — do not send it manually.

## Testing
- Import `postman_collection.json` into Postman (File > Import) to test every endpoint immediately.
- Or use Swagger/curl — all routes are plain REST/JSON.

## Notes for teammate
- This folder is self-contained; push it as its own repo/folder.
- `node_modules/` and `.env` are gitignored — don't commit them.
- The frontend (separate folder) expects this API at `http://localhost:5000/api`.
