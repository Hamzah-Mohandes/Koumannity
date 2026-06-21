from fastapi import APIRouter
from app.database import posts_db

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("")
def get_leaderboard():
    # ساخت یک دیکشنری پایه برای ذخیره امتیازها
    scores = {
        "kourosh": 0,
        "iman": 0,
        "mialand": 0
    }
    
    # جمع زدن لایک‌های خفن (cool_count) برای هر تیم
    for post in posts_db:
        if post.team in scores:
            scores[post.team] += post.cool_count
            
    # مرتب کردن تیم‌ها بر اساس بالاترین امتیاز
    sorted_scores = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    
    # خروجی نهایی به صورت آرایه‌ای مرتب شده
    return [
        {"rank": index + 1, "team": team, "score": score}
        for index, (team, score) in enumerate(sorted_scores)
    ]