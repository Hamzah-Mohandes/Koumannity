from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from datetime import datetime, timedelta

app = FastAPI(title="Koumanto Matrix API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TeamEnum(str, Enum):
    KOUROSH = "kourosh"
    IMAN = "iman"
    MIALAND = "mialand"

class AvatarEnum(str, Enum):
    KOUROSH_MATRIX = "kourosh_matrix"
    IMAN_SERIOUS = "iman_serious"
    MIA_GAMER = "mia_gamer"

class PostCreate(BaseModel):
    username: str
    avatar: AvatarEnum
    team: TeamEnum
    text_content: Optional[str] = None
    image_url: Optional[str] = None

class PostResponse(PostCreate):
    id: int
    created_at: datetime
    toxic_count: int = 0
    cool_count: int = 0
    is_destruction_active: bool = False
    destruction_started_at: Optional[datetime] = None

# دیتابیس موقت در حافظه
posts_db: List[PostResponse] = []
leaderboard_db = [
    {"team": "kourosh", "score": 1250},
    {"team": "iman", "score": 1100},
    {"team": "mialand", "score": 950}
]

def get_active_posts():
    """فیلتر کردن پست‌هایی که منقضی شده‌اند یا در جنگ فکشن‌ها نابود شده‌اند"""
    now = datetime.utcnow()
    active = []
    for post in posts_db:
        # ۱. بررسی انقضای کلان ۱۰ ساعته
        if now - post.created_at > timedelta(hours=10):
            continue
        
        # ۲. بررسی پروتکل تخریب ۲ ساعته (اگر دکمه ادمین/حذف زده شده و مجموع کلیک‌ها >= ۱۰۰۰ باشد)
        if post.is_destruction_active and post.destruction_started_at:
            total_clicks = post.toxic_count + post.cool_count
            if total_clicks >= 1000 and (now - post.destruction_started_at > timedelta(hours=2)):
                continue # پست نابود شده است
                
        active.append(post)
    return active

@app.get("/posts", response_model=List[PostResponse])
def get_posts():
    return get_active_posts()

@app.post("/posts", response_model=PostResponse)
def create_post(post_in: PostCreate):
    new_id = len(posts_db) + 1
    new_post = PostResponse(
        id=new_id,
        created_at=datetime.utcnow(),
        **post_in.dict()
    )
    posts_db.append(new_post)
    return new_post

@app.post("/posts/{post_id}/react")
def react_to_post(post_id: int, type: str):
    for post in posts_db:
        if post.id == post_id:
            if type == "toxic":
                post.toxic_count += 1
            elif type == "cool":
                post.cool_count += 1
            return {"status": "success", "post": post}
    raise HTTPException(status_code=404, detail="Post not found")

@app.post("/posts/{post_id}/trigger-destruction")
def trigger_destruction(post_id: int):
    """فعال‌سازی پروتکل تخریب در جنگ بین ۳ گروه"""
    for post in posts_db:
        if post.id == post_id:
            post.is_destruction_active = True
            post.destruction_started_at = datetime.utcnow()
            return {"status": "destruction_protocol_activated", "post": post}
    raise HTTPException(status_code=404, detail="Post not found")

@app.delete("/admin/posts/{post_id}")
def admin_hard_delete_post(post_id: int):
    """حذف آنی و سخت توسط ادمین"""
    global posts_db
    initial_len = len(posts_db)
    posts_db = [p for p in posts_db if p.id != post_id]
    if len(posts_db) == initial_len:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"status": "hard_deleted_by_admin"}

@app.get("/leaderboard")
def get_leaderboard():
    return leaderboard_db