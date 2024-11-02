import os
from fastapi import FastAPI, Depends
from sqlmodel import Session, create_engine
from src.models import *
from src.crud import *

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": False})

DATABASE_URL = str(os.getenv("DATABASE_URL"))

engine = create_engine(DATABASE_URL)

# Dependency to get the database session
def get_db():
    with Session(engine) as session:
        yield session

@app.post("/users/", response_model=models.User)
def create_user_endpoint(user: models.User, db: Session = Depends(get_db)):
    return create_user(db, user)

@app.post("/tasks/", response_model=models.Task)
def create_task_endpoint(task: models.Task, db: Session = Depends(get_db)):
    return create_task(db, task)

@app.get("/tasks/", response_model=List[models.Task])
def read_tasks(user_id: int, db: Session = Depends(get_db)):
    return get_user_tasks(db, user_id)

@app.put("/tasks/{task_id}", response_model=models.Task)
def update_task_endpoint(task_id: int, task: models.Task, db: Session = Depends(get_db)):
    return update_task(db, task_id, task)

@app.delete("/tasks/{task_id}", response_model=dict)
def delete_task_endpoint(task_id: int, db: Session = Depends(get_db)):
    delete_task(db, task_id)
    return {"message": "Task deleted successfully"}
