from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from src.models import PriorityEnum

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: Optional[bool] = False
    deadline: Optional[datetime] = None
    priority: Optional[str] = PriorityEnum.none

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    deadline: Optional[datetime] = None
    priority: Optional[str] = PriorityEnum.none 

class Task(TaskBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True
