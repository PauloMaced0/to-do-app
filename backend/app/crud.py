from datetime import date
from typing import Sequence
from sqlmodel import Session, select, func
from .models import Task, User
from .schemas import UserCreate, TaskCreate, TaskUpdate, TaskStats, UserUpdateRequest
from fastapi import HTTPException

priority_order = {
    "none": 0,
    "low": 1,
    "medium": 2,
    "high": 3,
}

def filter_and_sort_tasks(tasks, filter_by, sort_by) -> Sequence[Task]:
    # Filter tasks
    if filter_by == "Completed":
        tasks = [task for task in tasks if task.completed]
    elif filter_by == "Incomplete":
        tasks = [task for task in tasks if not task.completed]
    
    # Sort tasks
    if sort_by == "Creation Date":
        tasks.sort(key=lambda x: x.created_at)
    elif sort_by == "Deadline":
        tasks.sort(key=lambda x: x.deadline or date.max)
    elif sort_by == "Completion Status":
        tasks.sort(key=lambda x: x.completed)
    elif sort_by == "Priority":
        tasks.sort(key=lambda x: priority_order.get(x.priority, 0), reverse=True)  # Assuming higher priority is indicated by a larger number

    return tasks

def create_user(db: Session, user: UserCreate) -> User:
    # Query to check if a user already exists by username or sub
    existing_user = get_user(db, user.sub)

    if existing_user:
        return existing_user

    # Create and save the new user
    db_user = User(username=user.username, sub=user.sub)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

def get_user(db: Session, user_id: str) -> User | None:
    statement = select(User).where(User.sub == user_id)
    result = db.exec(statement)
    user = result.first()

    return user 

def create_task(db: Session, task: TaskCreate) -> Task:
    db_task = Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_user_tasks(db: Session, user_id: str) -> Sequence[Task]:
    statement = select(Task).where(Task.owner_id == user_id)
    result = db.exec(statement)
    return result.all()

def update_task(db: Session, task_id: int, task: TaskUpdate) -> Task:
    statement = select(Task).where(Task.id == task_id)
    result = db.exec(statement)
    db_task = result.first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.model_dump(exclude_unset=True, exclude_none=True).items():
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

def get_task_by_id(db: Session, task_id: int) -> Task:
    statement = select(Task).where(Task.id == task_id)
    result = db.exec(statement)
    db_task = result.first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

def get_task_statistics(user_id: str, db: Session) -> TaskStats:
    # Fetch the user
    user = db.exec(select(User).where(User.sub == user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Count total tasks created by the user
    total_tasks = db.exec(select(func.count(Task.id)).where(Task.owner_id == user_id)).one()
    
    # Completed tasks
    completed_tasks = db.exec(select(func.count(Task.id)).where(Task.owner_id == user_id, Task.completed == True)).one()

    # Return the structured response
    return TaskStats(
        total_tasks_created=total_tasks or 0,
        total_tasks_completed=completed_tasks or 0,
    )

def update_user_profile(user_id: str, update_request: UserUpdateRequest, db):
    # Update the fields if provided
    user = get_user(db, user_id) 

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if update_request.full_name is not None:
        user.full_name = update_request.full_name
    if update_request.phone_number is not None:
        user.phone_number = update_request.phone_number
    
    # Save the changes to the database
    db.add(user)
    db.commit()
    db.refresh(user)

    return user
