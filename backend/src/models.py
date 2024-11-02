from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from enum import Enum

class PriorityEnum(str, Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    username: str = Field(index=True, unique=True, nullable=False)
    hashed_password: str = Field(nullable=False)

    tasks: List["Task"] = Relationship(back_populates="owner")

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    title: str = Field(index=True)
    description: Optional[str] = None
    completed: bool = Field(default=False)
    deadline: Optional[datetime] = None
    priority: str = Field(default=PriorityEnum.none)
    created_at: datetime = Field(default_factory=datetime.now)
    owner_id: int = Field(foreign_key="users.id")

    owner: Optional[User] = Relationship(back_populates="tasks")
