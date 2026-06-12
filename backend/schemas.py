from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from datetime import datetime


 
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


 
class GenerateRequest(BaseModel):
    goal: str
    focus: Optional[str] = None

class LearningPathResponse(BaseModel):
    id: int
    goal: str
    focus: Optional[str]
    markdown: Optional[str]
    path_json: Optional[Any]
    created_at: datetime

    class Config:
        from_attributes = True