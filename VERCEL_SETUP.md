# Vercel Environment Variables Setup

## Required Environment Variables for Deployment

Your Vercel deployment needs these environment variables to be set:

### 1. DATABASE_URL
- Go to: https://vercel.com/dashboard
- Select your project (Cognote)
- Go to Settings > Environment Variables
- Add: `DATABASE_URL` with your Neon database connection string
- Example: `postgresql://user:password@hostname/database?sslmode=require`

### 2. DIRECT_URL (if using Neon)
- Add: `DIRECT_URL` with your Neon direct connection string
- This is usually the same as DATABASE_URL but without connection pooling

### 3. JWT_SECRET
- Add: `JWT_SECRET` with a secure random string
- Example: `your-super-secret-jwt-key-change-this-in-production`

## How to Add Environment Variables in Vercel:

1. Visit: https://vercel.com/dashboard
2. Click on your "Cognote" project
3. Go to "Settings" tab
4. Click "Environment Variables" in the sidebar
5. Click "Add New"
6. Add each variable with its value
7. Make sure to select "Production", "Preview", and "Development" environments

## After Adding Variables:
- Redeploy your application
- The build should now succeed

## Local Development:
- Keep your `.env` file for local development
- Vercel environment variables are separate from your local `.env`