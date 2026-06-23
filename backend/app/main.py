import os
import base64
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from datetime import datetime

from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship

# 1. DATABASE CONFIGURATION
DATABASE_URL = "postgresql://postgres:Koumannity2026!@db.mcyrddwxjlmzkucsezfo.supabase.co:5432/postgres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. SQLALCHEMY MODELS (Database Tables with Cascade Delete)
class DBPost(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    avatar = Column(String)
    team = Column(String)
    text_content = Column(String, nullable=True)
    image_url = Column(String, nullable=True)  # Hält den Base64-String des Bildes
    created_at = Column(DateTime, default=datetime.utcnow)
    toxic_count = Column(Integer, default=0)
    cool_count = Column(Integer, default=0)
    is_destruction_active = Column(Boolean, default=False)
    
    # Kaskadierendes Löschen auf Python-Ebene aktivieren
    reactions = relationship("DBReaction", back_populates="post", cascade="all, delete-orphan", passive_deletes=True)

class DBReaction(Base):
    __tablename__ = "reactions"
    
    id = Column(Integer, primary_key=True, index=True)
    # ondelete="CASCADE" sorgt für das Löschen auf Datenbank-Ebene (Supabase)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"))
    username = Column(String, index=True)
    reaction_type = Column(String)  # "toxic" oder "cool"
    
    post = relationship("DBPost", back_populates="reactions")

class DBLeaderboard(Base):
    __tablename__ = "leaderboard"
    
    team = Column(String, primary_key=True)
    score = Column(Integer, default=1000)

# Tabellen in Supabase erstellen
Base.metadata.create_all(bind=engine)

# Initialisiere das Leaderboard, falls es leer ist
db = SessionLocal()
if db.query(DBLeaderboard).count() == 0:
    db.add_all([
        DBLeaderboard(team="kourosh", score=1000),
        DBLeaderboard(team="iman", score=1000),
        DBLeaderboard(team="mialand", score=1000)
    ])
    db.commit()
db.close()

# 3. FASTAPI SETUP
app = FastAPI(title="Koumannity Faction Matrix API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Abhängigkeit für die DB-Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Enums & Pydantic Schemas
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
    toxic_count: int
    cool_count: int
    is_destruction_active: bool
    
    class Config:
        from_attributes = True

class LeaderboardRow(BaseModel):
    team: TeamEnum
    score: int
    
    class Config:
        from_attributes = True

# 4. API ENDPOINTS
@app.post("/posts", response_model=PostResponse)
async def create_post(
    username: str = Form(...),
    avatar: AvatarEnum = Form(...),
    team: TeamEnum = Form(...),
    text_content: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    saved_image_url = None
    
    if file:
        try:
            file_content = await file.read()
            # Konvertiert das Bild in einen Base64-String für die dauerhafte Speicherung in Supabase
            encoded = base64.b64encode(file_content).decode("utf-8")
            saved_image_url = f"data:{file.content_type};base64,{encoded}"
        except Exception as e:
            print(f"Base64 encoding failed: {e}")
            saved_image_url = None

    db_post = DBPost(
        username=username,
        avatar=avatar.value,
        team=team.value,
        text_content=text_content if text_content else None,
        image_url=saved_image_url
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.get("/posts", response_model=List[PostResponse])
def get_posts(db: Session = Depends(get_db)):
    return db.query(DBPost).order_by(DBPost.id.asc()).all()

@app.post("/posts/{post_id}/react", response_model=PostResponse)
async def react_to_post(post_id: int, username: str, type: str, db: Session = Depends(get_db)):
    post = db.query(DBPost).filter(DBPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_reaction = db.query(DBReaction).filter(
        DBReaction.post_id == post_id, 
        DBReaction.username == username
    ).first()

    if existing_reaction:
        if existing_reaction.reaction_type == type:
            if type == "toxic" and post.toxic_count > 0: post.toxic_count -= 1
            elif type == "cool" and post.cool_count > 0: post.cool_count -= 1
            db.delete(existing_reaction)
        else:
            if type == "toxic":
                post.toxic_count += 1
                if post.cool_count > 0: post.cool_count -= 1
            elif type == "cool":
                post.cool_count += 1
                if post.toxic_count > 0: post.toxic_count -= 1
            existing_reaction.reaction_type = type
    else:
        if type == "toxic": post.toxic_count += 1
        elif type == "cool": post.cool_count += 1
        
        new_reaction = DBReaction(post_id=post_id, username=username, reaction_type=type)
        db.add(new_reaction)

    db.commit()
    db.refresh(post)
    return post

@app.get("/leaderboard", response_model=List[LeaderboardRow])
def get_leaderboard(db: Session = Depends(get_db)):
    return db.query(DBLeaderboard).all()

@app.delete("/admin/posts/{post_id}")
def admin_hard_delete_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(DBPost).filter(DBPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    # Durch 'cascade="all, delete-orphan"' werden die Reaktionen jetzt automatisch mitgelöscht!
    db.delete(post)
    db.commit()
    return {"status": "hard_deleted_by_admin_with_cascade"}