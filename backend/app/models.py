from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import date
from enum import Enum

class PriorityEnum(str, Enum):
    none = "none"
    low = "low"
    medium = "medium"
    high = "high"

class User(SQLModel, table=True):
    sub: str = Field(default=None, primary_key=True, index=True)
    username: str = Field(index=True, unique=True, nullable=False)

    tasks: List["Task"] = Relationship(back_populates="owner")

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    title: str = Field(index=True)
    description: Optional[str] = None
    completed: bool = Field(default=False)
    deadline: Optional[date] = None
    priority: str = Field(default=PriorityEnum.none)
    created_at: date = Field(default_factory=date.today)
    completed_at: date = Field(default_factory=date.today)
    owner_id: str = Field(foreign_key="user.sub")

    owner: User = Relationship(back_populates="tasks")

