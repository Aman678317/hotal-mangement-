# Hostel Management System (GenZ Hostel)

A modern full-stack Hostel Management System built with Node.js, Express, Prisma, and PostgreSQL. Features room allocations, complaint management, attendance logs, student/warden/admin role dashboards, and a rule-based AI chatbot.

---

## 🌐 Live Deployments

- **Vercel Frontend & Serverless API:** [https://hostel-management-system-ashy-one.vercel.app](https://hostel-management-system-ashy-one.vercel.app)
- **Alternative Vercel URL:** [https://hotal-mangement.vercel.app](https://hotal-mangement.vercel.app)
- **GitHub Repository:** [https://github.com/Aman678317/hotal-mangement-](https://github.com/Aman678317/hotal-mangement-)

---

## 🗄️ Supabase Database Setup (Free PostgreSQL)

To make the database live and remove the *"backend database is currently unreachable"* notice:

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **"New Project"**.
3. Choose a name (e.g. `hostel-db`), set a database password (remember this password!), and pick the closest region.
4. Click **"Create new project"**.

### Step 2: Copy your Connection String
1. In your Supabase project dashboard, click **Project Settings** (gear icon at bottom left).
2. Go to **Database**.
3. Scroll down to **Connection parameters** or **Connection string**.
4. Select **URI** and choose **Session** (or **Transaction** mode on port `6543`).
5. Copy the connection string, which looks like:
   ```text
   postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
   *(Be sure to replace `[YOUR-PASSWORD]` with your actual database password).*

### Step 3: Run 1-Click Database Setup & Seed
Open your terminal in this repository and run:
```bash
npm run db:setup "YOUR_SUPABASE_CONNECTION_STRING"
```
This single command automatically:
- Tests the connection to your Supabase PostgreSQL database
- Runs Prisma migrations to create all required tables (`User`, `Room`, `Allocation`, `Complaint`, etc.)
- Populates initial demo users, hostel blocks, rooms, and test data

---

## 🚀 Connecting to Vercel

To connect your live Vercel app to your Supabase database:
1. Open your project on [vercel.com](https://vercel.com).
2. Go to **Settings** → **Environment Variables**.
3. Add a new variable:
   - **Key:** `DATABASE_URL`
   - **Value:** *Your Supabase connection string* (port 6543 with `?pgbouncer=true` or port 5432)
4. Add another variable:
   - **Key:** `SESSION_SECRET`
   - **Value:** `hostel-super-secret-production-key-2026`
5. Go to **Deployments** and click **Redeploy** on the latest deployment.
6. The green health status will appear and the banner will vanish!

---

## ☁️ Deploying Backend on Render

This project includes a ready-to-use [`render.yaml`](./render.yaml) blueprint:

1. Sign in to [https://render.com](https://render.com).
2. Click **New +** → **Blueprint** (or **Web Service**).
3. Connect your GitHub repository: `Aman678317/hotal-mangement-`.
4. Render will auto-detect the configuration from `render.yaml`.
5. When prompted for `DATABASE_URL`, paste your Supabase connection string.
6. Click **Apply** / **Deploy**.

Render will automatically run migrations and start your Node.js backend.

---

## 🔑 Demo Credentials

Once the database is connected, you can sign in using either the 1-click demo buttons on `/login` or these credentials:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@hostel.local` | `Demo@1234` |
| **Warden** | `warden@hostel.local` | `Demo@1234` |
| **Student** | `student@hostel.local` | `Demo@1234` |

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure .env
cp .env.example .env

# 3. Apply migrations & seed demo data
npm run db:deploy
npm run db:seed

# 4. Start development server
npm run dev
```
Visit `http://localhost:3000` in your browser.
