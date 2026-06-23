# 🌐 Koumannity - Faction Matrix Platform

Koumannity is a dynamic, real-time web application where three different factions battle for dominance through content sharing and strategic reactions. Users can share moments, upload images, and react to posts with an atomic toggle mechanism that directly impacts the leaderboard.

پلتفرم «کومانیتی» یک وب‌اپلیکیشن پویا و زنده است که در آن سه گروه مختلف برای برتری در تایم‌لاین با یکدیگر رقابت می‌کنند. کاربران می‌توانند لحظات خود را به همراه عکس به اشتراک بگذارند و با سیستم ری‌آکشن انحصاری، امتیازات لیدربورد را جابه‌جا کنند.

---

## 🚀 Tech Stack | تکنولوژی‌های مورد استفاده

### Backend

- **FastAPI (Python)** - High-performance asynchronous API framework.
- **Uvicorn** - Lightning-fast ASGI server implementation.
- **Pydantic v2** - Data validation and settings management.
- **Multipart Support** - Efficient file and image handling.

### Frontend

- **React (TypeScript)** - Component-based UI with strict type safety.
- **Tailwind CSS** - Modern utility-first styling for dark-mode matrix design.

---

## ⚡ Features | ویژگی‌های کلیدی

- **Faction Selection:** Join _King's Court (Kourosh)_, _Judgment Call (Iman)_, or _Fantasy Realm (Mia)_.
- **Real-time Timeline:** Feed filters to isolate faction activities or view the global matrix.
- **Exclusive Reactions:** Atomic `Toxic` ☣️ and `Cool` 🔥 toggles (One reaction per user; clicking again removes it).
- **Image Uploads:** Direct local storage processing from user devices via multipart forms.
- **Balanced Starting Point:** All factions start with an equal baseline of `1,000 PTS`.

---

## 📦 Project Structure | ساختار پوشه‌ها

```text
Koumannity/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI Core logic & endpoints
│   ├── uploads/             # Dynamically stored user images
│   └── requirements.txt     # Python dependencies
└── frontend/
    ├── src/
    │   ├── views/
    │   │   └── Timeline.tsx # Core UI view for Koumannity Timeline
    │   ├── api.ts           # Central API configuration
    │   └── types.ts         # TypeScript definitions
```

1. Backend Setup
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
2. Frontend Setup
   cd frontend
   npm install
   npm run dev

🌐 Deployment | دپلوی
Backend: Hosted on Render

Frontend: Hosted on Vercel
