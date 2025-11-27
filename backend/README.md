# CogNote Backend API

Complete Express.js backend for the CogNote application with JWT authentication, Prisma ORM, PDF processing, and AI feature placeholders.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

**Required environment variables:**
- `DATABASE_URL` - Your NeonDB connection string
- `DIRECT_URL` - Direct connection URL (same as DATABASE_URL for Neon)
- `JWT_SECRET` - Secret key for JWT tokens (generate a secure random string)
- `PORT` - Server port (default: 4000)

### 3. Set Up Database

**Get your NeonDB connection string:**
1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Copy the connection string (it looks like this):
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Paste it into your `.env` file for both `DATABASE_URL` and `DIRECT_URL`

**Generate Prisma Client:**
```bash
npx prisma generate
```

**Push schema to database:**
```bash
npx prisma db push
```

This will create the following tables:
- `User` - User accounts
- `File` - Uploaded PDF files with extracted text
- `Note` - Notes created from extracted PDF text

### 4. Start the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:4000`

---

## 📡 API Endpoints

### Health Check
```bash
GET /health
```
Returns server status.

### Authentication

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### PDF Processing

#### Upload PDF
```bash
POST /api/pdf/upload
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data

pdf=@/path/to/file.pdf
```

**Response:**
```json
{
  "file": {
    "id": "...",
    "filename": "document.pdf",
    "filepath": "/path/to/uploads/document-123456.pdf",
    "createdAt": "2025-11-23T04:00:00.000Z"
  },
  "extractedText": "Preview of extracted text...",
  "note": {
    "id": "...",
    "content": "Full extracted text..."
  }
}
```

### AI Features (Placeholders)

These endpoints are **not yet implemented** and will return a 501 status with implementation guidance.

```bash
POST /api/ai/summarize      # Generate summary from text
POST /api/ai/flashcards     # Generate flashcards
POST /api/ai/quiz           # Generate quiz questions
POST /api/ai/chat           # Chat with your notes
```

See [`api/ai/README.md`](./api/ai/README.md) for implementation guide.

---

## 🧪 Testing the API

### Test Registration
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test PDF Upload
```bash
# First, get a token from login/register, then:
curl -X POST http://localhost:4000/api/pdf/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "pdf=@/path/to/your/file.pdf"
```

---

## 📁 Project Structure

```
backend/
├── server.js                 # Express server entry point
├── package.json              # Dependencies and scripts
├── prismaClient.js           # Prisma client singleton
├── .env.example              # Environment variables template
├── .env                      # Your actual environment variables (gitignored)
├── prisma/
│   └── schema.prisma         # Database schema
├── api/
│   ├── auth/
│   │   ├── login.js          # Login endpoint
│   │   ├── register.js       # Registration endpoint
│   │   └── verifyToken.js    # JWT verification middleware
│   ├── pdf/
│   │   ├── upload.js         # PDF upload endpoint
│   │   └── extract.js        # PDF text extraction utility
│   └── ai/
│       ├── README.md         # AI implementation guide
│       └── placeholders.js   # AI route placeholders
└── uploads/                  # Uploaded PDF files (auto-created)
```

---

## 🔧 Prisma Commands

### View Database in Browser
```bash
npx prisma studio
```

### Create Migration
```bash
npx prisma migrate dev --name your_migration_name
```

### Reset Database
```bash
npx prisma migrate reset
```

### Update Prisma Client (after schema changes)
```bash
npx prisma generate
```

---

## 🔐 Security Notes

1. **JWT Secret**: Generate a secure random string for production:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **CORS**: Update `server.js` to restrict CORS to your frontend domain in production

3. **File Upload Limits**: Currently set to 10MB, adjust in `api/pdf/upload.js` if needed

4. **Environment Variables**: Never commit `.env` file to version control

---

## 🐛 Troubleshooting

### "Prisma Client not found"
Run: `npx prisma generate`

### "Database connection failed"
- Check your `DATABASE_URL` in `.env`
- Ensure your NeonDB instance is running
- Verify network connectivity

### "Token verification failed"
- Ensure `JWT_SECRET` is the same across restarts
- Check token expiration (default: 7 days)

### "PDF upload fails"
- Check file size (max 10MB)
- Ensure file is a valid PDF
- Verify `uploads/` directory has write permissions

---

## 📚 Next Steps

1. **Connect Frontend**: Update your Next.js frontend to call these endpoints
2. **Implement AI Features**: Follow the guide in [`api/ai/README.md`](./api/ai/README.md)
3. **Add More Features**: User profiles, file management, note editing, etc.
4. **Deploy**: Deploy to Vercel, Railway, or your preferred platform

---

## 📝 License

ISC
