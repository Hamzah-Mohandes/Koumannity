from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import posts, leaderboard

app = FastAPI(title="Koumannity API")

# حل مشکل CORS برای اتصال بدون خطای فرانت‌آند به بک‌آند
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # باز کردن دسترسی برای تمام پورت‌های فرانت‌آند
    allow_credentials=True,
    allow_methods=["*"],  # مجاز کردن تمام متدها از جمله OPTIONS, GET, POST
    allow_headers=["*"],  # مجاز کردن تمام هدرها
)

# متصل کردن روت‌های پست به اپلیکیشن اصلی
app.include_router(posts.router)
app.include_router(leaderboard.router)

@app.get("/")
def home():
    return {"message": "به وب‌سایت ماژولار Koumannity خوش آمدید! 👑"}