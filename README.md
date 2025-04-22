# 🗂️ ActTracker - File Activity Tracking Application


**ActTracker** is a modern, fully responsive file activity tracking application that visually maps user uploads over time. Designed with a clean, elegant UI and rich interactions, it brings your file history to life through heatmaps, streak tracking, analytics, and microinteractions—making productivity tracking seamless and beautiful.

---

## ✨ Overview

ActTracker helps users monitor and reflect on their daily upload habits. Whether it's for developers, designers, or creators, it offers an intuitive GitHub-style contribution calendar, insightful analytics, and a smooth upload experience—all backed by a scalable serverless stack.

---

## 🚀 Features

### 🔐 User Authentication
- Clerk-powered secure authentication
- Protected routes with session management
- Seamless login and redirect flow

### 📊 Interactive Dashboard
- GitHub-style heatmap showing upload frequency
- Current and longest streak stats
- Hover tooltips for daily upload insights
- Recent uploads with preview and metadata

### 📈 Advanced Analytics
- File type distribution pie charts
- Daily, monthly, yearly trend graphs
- Most active upload time visualization
- Behavioral insights through data patterns

### 📁 File Management
- Drag & drop file uploads
- Real-time upload progress indicator
- Preview support for images, PDFs, audio & video
- File organization, filtering, and downloads

### 🌙 Delightful UX
- Toggle between light/dark themes
- Smooth animations via Framer Motion
- Intuitive microinteractions
- Fully responsive on mobile, tablet, desktop

---

## 🧱 Tech Stack

### **Frontend**
- **Next.js 14 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/UI** – Reusable accessible components
- **Framer Motion** – Declarative animations
- **Recharts** – Charting and data visualization
- **date-fns** – Date utilities

### **Backend**
- **Convex** – Real-time serverless backend
- **Clerk** – Authentication & user management
- **Cloud Storage** – For file uploads

---

## 🛠 Getting Started

### 📋 Prerequisites
- Node.js 18+
- Git
- Convex account: [https://dashboard.convex.dev](https://dashboard.convex.dev)
- Clerk account: [https://clerk.dev](https://clerk.dev)

---

### 📦 Installation

```bash
git clone https://github.com/yourusername/acttrackermain
cd acttrackermain
npm install
```

---

### 🧪 Environment Setup

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

---

### 🏃‍♂️ Start the App

```bash
npm run dev          # Starts Next.js app
npx convex dev       # Starts Convex dev server
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
app/
 ┣ components/        → Reusable UI
 ┣ lib/               → Utility functions
 ┣ pages/             → Entry points (if using legacy routing)
 ┣ convex/            → Convex backend functions
 ┣ styles/            → Global styles
 ┣ public/            → Static assets
 ┗ env.local          → Environment variables
```

---

## 🔍 Key Features Explained

### 📆 Contribution Heatmap
- Intensity-based coloring
- Hover tooltips for daily uploads
- Activity grid updates in real-time

### 🔥 Streak Tracking
- Current active streak
- Longest historical streak
- Visual motivators for consistency

### 📊 Analytics
- Upload time trends (hour, day, month)
- File type breakdown (pie/donut chart)
- Activity history export (CSV or JSON)

---

## 🚀 Deployment (Vercel + Convex)

1. Push code to GitHub.
2. Deploy backend with:
   ```bash
   npx convex deploy
   ```
3. Copy Convex deployment URL.
4. Deploy frontend via [Vercel](https://vercel.com/).
5. Add environment variables on Vercel dashboard.

---

## 🤝 Contributing

We welcome PRs!  
Fork the repo → create a branch → make changes → push → open a PR.

```bash
git checkout -b feature/cool-feature
git commit -m "✨ Added cool feature"
git push origin feature/cool-feature
```

---

## 📄 License

Licensed under the MIT License. See [LICENSE](./LICENSE) for more.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org)
- [Convex](https://convex.dev)
- [Clerk](https://clerk.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://framer.com/motion)
- [Recharts](https://recharts.org)

---

## 📬 Contact

**Project Link**: [https://github.com/Phani2425/actTracker](https://github.com/Phani2425/actTracker)

---

Let me know if you want to auto-generate badges, add screenshots, or GIFs!
