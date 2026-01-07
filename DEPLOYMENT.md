# Deployment Guide - Vercel

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- MongoDB Atlas account (for cloud database)

## Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/surveyapp`)
5. Replace `<password>` with your actual password

## Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/survey-app.git
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install`
   - **Output Directory**: client/dist
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add these variables:
     - `MONGODB_URI` = your MongoDB connection string
     - `JWT_SECRET` = any random secure string (e.g., `mySecretKey123!@#`)
     - `PORT` = 5000

6. Click "Deploy"

### Option B: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **survey-app** (or your choice)
   - Directory? **./`**
   - Override settings? **N**

5. Add environment variables:
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
```

6. Deploy to production:
```bash
vercel --prod
```

## Step 4: Verify Deployment

1. Visit your deployed URL (e.g., `https://survey-app.vercel.app`)
2. Test registration and login
3. Create a survey
4. Take a survey
5. View analytics

## Troubleshooting

### Build Fails
- Check that all dependencies are in package.json
- Ensure MongoDB connection string is correct
- Check Vercel build logs for specific errors

### API Routes Not Working
- Verify environment variables are set
- Check that MongoDB URI is accessible from Vercel
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Frontend Not Loading
- Check build output directory is correct
- Verify client/dist folder is generated
- Check browser console for errors

## MongoDB Atlas Network Access

1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" in left sidebar
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

## Update Deployment

To update your deployed app:

```bash
git add .
git commit -m "Update message"
git push
```

Vercel will automatically redeploy on push to main branch.

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/surveyapp |
| JWT_SECRET | Secret key for JWT tokens | mySecretKey123!@# |
| PORT | Server port (optional) | 5000 |

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas connection
3. Verify all environment variables are set
4. Check browser console for frontend errors
