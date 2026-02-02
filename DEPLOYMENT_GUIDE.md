# BuildHive Deployment Guide

This guide will help you deploy your application to production while keeping your development environment (with dummy accounts) separate.

## 1. Overview
- **Development (Local)**: Uses your current `.env` file with dummy accounts.
- **Production (Live)**: Uses environment variables set on the hosting platform with your *real* work accounts.

## 2. Prerequisites
- Accounts on:
  - **GitHub** (for code hosting)
  - **Vercel** (for Frontend)
  - **Render** or **Railway** (for Backend)
  - **Supabase** (for Database)

---

## 3. Database Setup (Production)
Since you want to use "work accounts" for production, you should create a **Separate Database** to avoid mixing test data with real data.

1. Go to [Supabase](https://supabase.com/) and create a **New Project** (e.g., `buildhive-prod`).
2. Get the new `DATABASE_URL` and `DIRECT_URL` from settings.
3. **Run Prisma Migration for Prod**:
   You need to push your schema to this new database. Run this locally **ONCE**, temporarily using the prod URL, OR let the deployment command do it (recommended).

---

## 4. Backend Deployment (Render.com)
We will deploy the `server` folder.

1. **Push your code** to GitHub.
2. Go to **Render Dashboard** -> New -> **Web Service**.
3. Connect your GitHub repo.
4. **Settings**:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Environment Variables**:
   Add all variables from your `server/.env` file here, but **replace the values with your Production/Work credentials**.
   - `DATABASE_URL`: Your NEW Supabase URL.
   - `DIRECT_URL`: Your NEW Supabase Direct URL.
   - `GITHUB_CLIENT_ID`: Your **Production** GitHub OAuth App ID.
   - `GITHUB_CLIENT_SECRET`: Your **Production** GitHub OAuth Secret.
   - `FRONTEND_URL`: The URL Vercel gives you (e.g., `https://buildhive.vercel.app`).
   - `PORT`: `10000` (Render default).
   - And others (`JWT_SECRET`, `CLOUDINARY_...`, etc) with production values.

> **Prisma Note**: You should update the Build Command to: `npm install && npx prisma generate && npm run build` to ensure the client is generated.
> To sync the DB during deploy, you can add `npx prisma db push` to the build command or run it manually.
> Recommended Build Command: `npm install && npx prisma generate && npm run build`

6. Click **Deploy**. Render will give you a backend URL (e.g., `https://buildhive-api.onrender.com`).

---

## 5. Frontend Deployment (Vercel)
We will deploy the `client` folder.

1. Go to **Vercel Dashboard** -> **Add New...** -> **Project**.
2. Import your GitHub repo.
3. **Configure Project**:
   - **Root Directory**: Click "Edit" and select `client`.
   - **Framework Preset**: Next.js (Automatic).
4. **Environment Variables**:
   Add variables from `client/.env.local`.
   - `NEXT_PUBLIC_API_URL`: The **Render Backend URL** (e.g., `https://buildhive-api.onrender.com`).
   - `NEXT_PUBLIC_SOCKET_URL`: The **Render Backend URL**.
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your **Live** Razorpay Key.
5. Click **Deploy**.

---

## 6. Final Wiring
1. Once Vercel deploys, copy the **Deployment URL** (e.g., `https://buildhive-app.vercel.app`).
2. Go back to **Render** Environment Variables.
3. Update `FRONTEND_URL` to this new Vercel URL.
4. Go to your **Production OAuth Providers** (GitHub, Google, Razorpay) and update the "Callback/Redirect URLs":
   - **GitHub/Google**: `https://buildhive-api.onrender.com/api/auth/github/callback`
   - **Razorpay**: Update webhook URL if used.

## 7. FAQ

**Q: Do I have to do Prisma again?**
A: You do **not** need to rewrite code. You just need to apply your schema to the new production database. 
- **Option A (Easy)**: Run `npx prisma db push` locally but with the `DATABASE_URL` env var set to your PROD url.
  ```bash
  DATABASE_URL="postgresql://..." npx prisma db push
  ```
- **Option B (Automated)**: Add `npx prisma db push` to your Render Build Command.

**Q: Can I continue using dummy accounts in dev?**
A: **YES**. Your local `.env` and `.env.local` files are ignored by git (usually) and are NOT used in production. Deployment uses the variables you set in the Vercel/Render dashboards. So you can keep "dummy123" locally and use "RealCorp config" in production simultaneously.
