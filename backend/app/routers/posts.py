from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timedelta
from app.models import PostCreate, PostResponse, TeamEnum
from app.database import posts_db

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.get("", response_model=List[PostResponse])
def get_posts(team: Optional[TeamEnum] = None):
    now = datetime.now()
    twenty_four_hours_ago = now - timedelta(hours=24)
    
    # فیلتر کردن پست‌ها برای نمایش دادن فقط پست‌های ۲۴ ساعت گذشته
    active_posts = [p for p in posts_db if p.created_at >= twenty_four_hours_ago]
    
    if team:
        return [p for p in active_posts if p.team == team]
    return active_posts

@router.post("", response_model=PostResponse)
def create_post(post: PostCreate):
    from app import database
    
    if not post.text_content and not post.image_url:
        raise HTTPException(status_code=400, detail="You must provide either text or an image!")
        
    new_post = PostResponse(
        id=database.post_id_counter,
        username=post.username,
        avatar=post.avatar,
        team=post.team,
        text_content=post.text_content,
        image_url=post.image_url,
        created_at=datetime.now()
    )
    posts_db.insert(0, new_post)
    database.post_id_counter += 1
    return new_post

@router.post("/{post_id}/react/{reaction_type}")
def react_to_post(post_id: int, reaction_type: str):
    post = next((p for p in posts_db if p.id == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found!")
        
    if reaction_type == "toxic":
        post.toxic_count += 1
    elif reaction_type == "cool":
        post.cool_count += 1
    elif reaction_type == "cheap":
        post.cheap_count += 1
    else:
        raise HTTPException(status_code=400, detail="Invalid reaction type!")
        
    return {
        "post_id": post_id, 
        "toxic_count": post.toxic_count, 
        "cool_count": post.cool_count, 
        "cheap_count": post.cheap_count
    }