import os
import shutil
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional, List, Dict
from enum import Enum
from datetime import datetime

app = FastAPI(title="Koumannity Faction Matrix API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

class TeamEnum(str, Enum):
    KOUROSH = "kourosh"
    IMAN = "iman"
    MIALAND = "mialand"

class AvatarEnum(str, Enum):
    KOUROSH_MATRIX = "kourosh_matrix"
    IMAN_SERIOUS = "iman_serious"
    MIA_GAMER = "mia_gamer"

class PostResponse(BaseModel):
    id: int
    username: str
    avatar: AvatarEnum
    team: TeamEnum
    text_content: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime
    toxic_count: int = 0
    cool_count: int = 0
    is_destruction_active: bool = False

class LeaderboardRow(BaseModel):
    team: TeamEnum
    score: int

posts_db: List[PostResponse] = []

# Alle Teams starten exakt mit 1000 Punkten
leaderboard_db: List[LeaderboardRow] = [
    LeaderboardRow(team=TeamEnum.KOUROSH, score=1000),
    LeaderboardRow(team=TeamEnum.IMAN, score=1000),
    LeaderboardRow(team=TeamEnum.MIALAND, score=1000)
]

user_reactions_db: Dict[int, Dict[str, str]] = {}

@app.post("/posts", response_model=PostResponse)
async def create_post(
    username: str = Form(...),
    avatar: AvatarEnum = Form(...),
    team: TeamEnum = Form(...),
    text_content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    saved_image_url = None
    if file:
        file_location = f"{UPLOAD_DIR}/{datetime.utcnow().timestamp()}_{file.filename}"
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        saved_image_url = f"http://localhost:8000/{file_location}"

    new_id = len(posts_db) + 1
    new_post = PostResponse(
        id=new_id,
        username=username,
        avatar=avatar,
        team=team,
        text_content=text_content if text_content else None,
        image_url=saved_image_url,
        created_at=datetime.utcnow()
    )
    posts_db.append(new_post)
    return new_post

@app.get("/posts", response_model=List[PostResponse])
def get_posts():
    return posts_db

@app.post("/posts/{post_id}/react", response_model=PostResponse)
async def react_to_post(post_id: int, username: str, type: str):
    post = next((p for p in posts_db if p.id == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if post_id not in user_reactions_db:
        user_reactions_db[post_id] = {}

    current_post_reactions = user_reactions_db[post_id]
    previous_reaction = current_post_reactions.get(username)

    if previous_reaction == type:
        if type == "toxic" and post.toxic_count > 0:
            post.toxic_count -= 1
        elif type == "cool" and post.cool_count > 0:
            post.cool_count -= 1
        current_post_reactions[username] = None

    elif previous_reaction and previous_reaction != type:
        if type == "toxic":
            post.toxic_count += 1
            if post.cool_count > 0: post.cool_count -= 1
        elif type == "cool":
            post.cool_count += 1
            if post.toxic_count > 0: post.toxic_count -= 1
        current_post_reactions[username] = type

    else:
        if type == "toxic":
            post.toxic_count += 1
        elif type == "cool":
            post.cool_count += 1
        current_post_reactions[username] = type

    return post

@app.get("/leaderboard", response_model=List[LeaderboardRow])
def get_leaderboard():
    return leaderboard_db

@app.delete("/admin/posts/{post_id}")
def admin_hard_delete_post(post_id: int):
    global posts_db
    posts_db = [p for p in posts_db if p.id != post_id]
    return {"status": "hard_deleted_by_admin"}