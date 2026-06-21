from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

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
    cheap_count: int = 0