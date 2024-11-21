from pydantic import BaseModel
from typing import Optional
from datetime import date
from .models import PriorityEnum

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: Optional[bool] = False
    deadline: Optional[date] = None
    priority: Optional[PriorityEnum] = PriorityEnum.none

class TaskCreate(TaskBase):
    owner_id: str

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    deadline: Optional[date] = None
    priority: Optional[PriorityEnum] = None

class Task(TaskBase):
    id: int
    owner_id: int
    created_at: date

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    sub: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class HealthCheck(BaseModel):
    status: str = "OK"

