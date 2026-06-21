from typing import List
from app.models import PostResponse

# دیتابیس موقت در حافظه سرور
posts_db: List[PostResponse] = []
post_id_counter = 1