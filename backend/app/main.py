import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlmodel import Session, create_engine, SQLModel
from .models import User, Task
from .crud import *
from typing import Annotated, List
from contextlib import asynccontextmanager
from .schemas import TaskCreate, UserCreate, TaskUpdate

DATABASE_URL = str(os.getenv("DATABASE_URL"))

engine = create_engine(DATABASE_URL)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": True}, lifespan=lifespan)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

@app.post("/users/dummy", response_model=User)
def create_dummy_user_endpoint(db: SessionDep):
    dummy_user_data = UserCreate(
        username="dummy_user",
        password="dummy_password"
    )
    user = create_user(db, dummy_user_data)
    return user

@app.post("/users/", response_model=UserCreate)
def create_user_endpoint(user: UserCreate, db: SessionDep):
    return create_user(db, user)

@app.post("/tasks/", response_model=Task)
def create_task_endpoint(task: TaskCreate, db: SessionDep):
    return create_task(db, task, 1)

@app.get("/tasks/", response_model=List[Task])
def read_tasks(user_id: int, db: SessionDep):
    return get_user_tasks(db, user_id)

@app.put("/tasks/{task_id}", response_model=Task)
def update_task_endpoint(task_id: int, task: TaskUpdate, db: SessionDep):
    return update_task(db, task_id, task)

@app.delete("/tasks/{task_id}", response_model=dict)
def delete_task_endpoint(task_id: int, db: SessionDep):
    delete_task(db, task_id)
    return {"message": "Task deleted successfully"}
