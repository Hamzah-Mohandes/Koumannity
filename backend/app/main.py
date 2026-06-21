from fastapi import FastAPI
from app.routers import posts, leaderboard

app = FastAPI(title="Koumannity API")

# متصل کردن روت‌های پست به اپلیکیشن اصلی
app.include_router(posts.router)
app.include_router(leaderboard.router)
@app.get("/")
def home():
    return {"message": "به وب‌سایت ماژولار Koumannity خوش آمدید! 👑"}