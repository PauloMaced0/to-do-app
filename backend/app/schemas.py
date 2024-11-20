from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .models import PriorityEnum

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: Optional[bool] = False
    deadline: Optional[datetime] = None
    priority: Optional[PriorityEnum] = PriorityEnum.none

class TaskCreate(TaskBase):
    owner_id: int  # Include owner_id if needed

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    deadline: Optional[datetime] = None
    priority: Optional[PriorityEnum] = None

class Task(TaskBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    sub: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True

class HealthCheck(BaseModel):
    status: str = "OK"

