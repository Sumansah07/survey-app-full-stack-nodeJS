# Fix Vercel 404 Error

## The Problem
Your app is deployed but showing 404 because Vercel needs proper configuration.

## Quick Fix - Follow These Steps:

### Step 1: Update Vercel Project Settings

Go to your Vercel project dashboard: https://vercel.com/dashboard

1. Click on your project: `survey-app-full-stack-node-js`
2. Go to **Settings** → **General**
3. Update these settings:

**Build & Development Settings:**
- **Framework Preset**: Other
- **Root Directory**: `./` (leave as is)
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm install`

4. Click **Save**

### Step 2: Verify Environment Variables

Go to **Settings** → **Environment Variables**

Make sure you have:
- `MONGODB_URI` = your MongoDB connection string
- `JWT_SECRET` = your secret key
- `NODE_ENV` = production

### Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** = NO
5. Click **Redeploy**

## Alternative: Deploy Fresh

If the above doesn't work, delete and redeploy:

1. Delete the current Vercel project
2. Go to Vercel Dashboard → **Add New** → **Project**
3. Import your GitHub repo again
4. Configure as follows:

```
Framework Preset: Other
Root Directory: ./
Build Command: npm run vercel-build
Output Directory: client/dist
Install Command: npm install
```

5. Add environment variables:
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV = production

6. Click **Deploy**

## What Changed in Your Code

I've updated:

1. **vercel.json** - Simplified configuration
2. **api/index.js** - Created API entry point for Vercel
3. **server/index.js** - Made it export the app for serverless
4. **package.json** - Added `vercel-build` script
5. **client/package.json** - Added `vercel-build` script

## Test After Deployment

Once deployed, test these URLs:

1. **Frontend**: https://your-app.vercel.app/
2. **API Health**: https://your-app.vercel.app/api/surveys

## Still Getting 404?

Check Vercel build logs:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Check **Build Logs**
4. Look for errors

Common issues:
- MongoDB connection string not set
- Build command failed
- Output directory wrong

## Need Help?

Share the build logs and I'll help debug!
