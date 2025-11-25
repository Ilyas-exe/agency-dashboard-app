# Agency & Contact Dashboard

A full-stack Next.js application for managing and viewing agencies and their contacts. This project was built as a take-home assignment.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Database:** PostgreSQL (via [Neon](https://neon.tech/))
- **ORM:** [Prisma](https://www.prisma.io/)

## ✨ Features

- **Authentication:** Secure login/signup flow using Clerk.
- **Agencies Table:** View a paginated list of agencies with details like population and website.
- **Contacts Table:** View agency contacts with hidden sensitive information.
- **Usage Limit System:**
  - Users can only reveal 50 contact details (email/phone) per day.
  - "Click to Reveal" pattern tracks usage in real-time.
  - Automatic daily reset of usage counts.
  - UI blocks further actions and prompts for an upgrade when the limit is reached.
- **Responsive Design:** Fully responsive layout with a sidebar for desktop and bottom navigation for mobile.

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd agency-dashboard-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Fill in your keys:

```env
DATABASE_URL="your_postgres_connection_string"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 4. Database Setup

Push the schema to your database:

```bash
npx prisma db push
```

Seed the database with the provided CSV data:

```bash
npm run seed
```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
├── actions/            # Server Actions (Backend Logic)
├── app/                # Next.js App Router Pages
│   ├── agencies/       # Agencies Page
│   ├── contacts/       # Contacts Page
│   └── layout.tsx      # Main Layout (Sidebar/Auth)
├── components/         # Reusable UI Components
├── lib/                # Utilities (Prisma Client)
├── prisma/             # Database Schema & Seed Script
└── public/             # Static Assets
```

## 🔒 Usage Limit Logic

The application tracks user activity using a `UserUsage` table in PostgreSQL.
1. When a user clicks "Reveal", a Server Action (`revealContact`) is called.
2. It checks the user's record for the current day.
3. If `count < 50`, the contact info is returned and `count` is incremented.
4. If `count >= 50`, an error is returned, and the UI shows a "Limit Reached" modal.
