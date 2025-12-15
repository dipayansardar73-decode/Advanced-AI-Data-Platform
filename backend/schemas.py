from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str
    role: str = "Analyst"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class DocumentBase(BaseModel):
    filename: str
    file_type: str
    is_classified: bool
    classification_level: str

class DocumentResponse(DocumentBase):
    id: int
    upload_date: datetime
    owner_id: int

    class Config:
        from_attributes = True
