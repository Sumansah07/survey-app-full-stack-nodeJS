# Project Architecture

## Deployment Structure

```
Single Vercel Project
│
├── Frontend (React + Vite)
│   └── Deployed as static files
│   └── Accessible at: https://your-app.vercel.app/
│
└── Backend (Node.js + Express)
    └── Deployed as serverless functions
    └── Accessible at: https://your-app.vercel.app/api/*
```

## How It Works

### Local Development
- Frontend runs on: `http://localhost:5173` (Vite dev server)
- Backend runs on: `http://localhost:5000` (Express server)
- Vite proxy forwards `/api/*` requests to backend

### Production (Vercel)
- Frontend: Static files served from `client/dist/`
- Backend: Serverless functions at `/api/*` routes
- Everything runs on the same domain (no CORS issues!)

## File Structure

```
survey-app/
├── client/                 # Frontend (React)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend (Express)
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── index.js
│   └── package.json
│
├── vercel.json            # Vercel configuration
├── package.json           # Root package.json
└── README.md

```

## Vercel Configuration Explained

The `vercel.json` file tells Vercel:

1. **Build the frontend:**
   - Use `@vercel/static-build` for client
   - Run `npm run build` in client folder
   - Output goes to `client/dist/`

2. **Setup the backend:**
   - Use `@vercel/node` for server
   - Convert Express app to serverless functions

3. **Route requests:**
   - `/api/*` → Backend (server/index.js)
   - `/*` → Frontend (client/dist/)

## Benefits of This Setup

✅ **Single deployment** - One command deploys everything
✅ **No CORS issues** - Same domain for frontend and backend
✅ **Easy to manage** - One project, one URL
✅ **Cost effective** - Vercel free tier covers both
✅ **Auto SSL** - HTTPS enabled automatically

## API Endpoints

All backend routes are prefixed with `/api`:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/surveys` - Get all surveys
- `POST /api/surveys` - Create survey
- `GET /api/surveys/:id` - Get survey by ID
- `POST /api/responses` - Submit survey response
- `GET /api/responses/analytics/:id` - Get analytics

## Environment Variables

Set these in Vercel Dashboard:

| Variable | Purpose | Example |
|----------|---------|---------|
| MONGODB_URI | Database connection | mongodb+srv://... |
| JWT_SECRET | Token encryption | mySecret123! |

## Deployment Flow

```
1. Push code to GitHub
   ↓
2. Vercel detects changes
   ↓
3. Vercel reads vercel.json
   ↓
4. Builds frontend (client)
   ↓
5. Prepares backend (server)
   ↓
6. Deploys both together
   ↓
7. App is live! 🚀
```

## Common Questions

**Q: Do I need two Vercel projects?**
A: No! One project handles both frontend and backend.

**Q: How does the backend run without a server?**
A: Vercel converts your Express app to serverless functions automatically.

**Q: Can I use a custom domain?**
A: Yes! Add it in Vercel Dashboard → Settings → Domains.

**Q: What about the database?**
A: Use MongoDB Atlas (cloud database). Connection string goes in environment variables.

**Q: Is this production-ready?**
A: Yes! This is a standard modern deployment pattern.
