from sqlmodel import Session, select
from .models import Task, User
from .schemas import UserCreate, TaskCreate, TaskUpdate
from fastapi import HTTPException

def create_user(db: Session, user: UserCreate):
    hashed_password = user.password  # Implement password hashing here
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    statement = select(User).where(User.id == user_id)
    result = db.exec(statement)
    return result.first()

def create_task(db: Session, task: TaskCreate):
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_user_tasks(db: Session, user_id: int):
    statement = select(Task).where(Task.owner_id == user_id)
    result = db.exec(statement)
    return result.all()

def update_task(db: Session, task_id: int, task: TaskUpdate):
    statement = select(Task).where(Task.id == task_id)
    result = db.exec(statement)
    db_task = result.first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    statement = select(Task).where(Task.id == task_id)
    result = db.exec(statement)
    db_task = result.first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
