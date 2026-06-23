# 🌐 Koumannity - Faction Matrix Platform

Koumannity is a dynamic, real-time web application where three different factions battle for dominance through content sharing and strategic reactions. Users can share moments, upload images, and react to posts with an atomic toggle mechanism that directly impacts the leaderboard.

پلتفرم «کومانیتی» یک وب‌اپلیکیشن پویا و زنده است که در آن سه گروه مختلف برای برتری در تایم‌لاین با یکدیگر رقابت می‌کنند. کاربران می‌توانند لحظات خود را به همراه عکس به اشتراک بگذارند و با سیستم ری‌آکشن انحصاری، امتیازات لیدربورد را جابه‌جا کنند.

---

## 🚀 Tech Stack | تکنولوژی‌های مورد استفاده

### Backend (بک‌آند)
* **FastAPI (Python 3.14+)** - High-performance asynchronous API framework.
* **Uvicorn** - Lightning-fast ASGI server implementation.
* **Pydantic v2** - Data validation and settings management.
* **Multipart Support** - Efficient file and image handling.

### Frontend (فرانت‌آند)
* **React (TypeScript)** - Component-based UI with strict type safety.
* **Tailwind CSS** - Modern utility-first styling for dark-mode matrix design.
* **Axios** - Promised-based HTTP client for seamless API communication.

---

## ⚡ Features | ویژگی‌های کلیدی

* **Faction Selection:** Join *King's Court (Kourosh)*, *Judgment Call (Iman)*, or *Fantasy Realm (Mia)*.
* **Real-time Timeline:** Feed filters to isolate faction activities or view the global matrix.
* **Exclusive Reactions:** Atomic `Toxic` ☣️ and `Cool` 🔥 toggles (One reaction per user; clicking again removes it).
* **Image Uploads:** Direct local storage processing from user devices via multipart forms.
* **Balanced Starting Point:** All factions start with an equal baseline of `1,000 PTS`.
* **Termination Protocol:** "Request Destruction" feature for intense tactical post removal.

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
    │   ├── api.ts           # Axios central API config
    │   └── types.ts         # TypeScript definitions




-----------------------------
cd backend
# Activate your virtual environment (.venv)
source ../.venv/bin/activate  # On macOS/Linux
# ..\.venv\Scripts\activate  # On Windows

# Install required packages
pip install fastapi uvicorn pydantic python-multipart

# Run the live server
uvicorn app.main:app --reload
The API will be live at: http://localhost:8000
-------------------------------
Frontend Setup
cd frontend
npm install
npm run dev
http://localhost:5173)
