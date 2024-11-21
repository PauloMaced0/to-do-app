import os
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware 
from fastapi import FastAPI, Depends, status, Query
from sqlmodel import Session, create_engine, SQLModel
from .models import User, Task
from .crud import *
from typing import Annotated, List
from contextlib import asynccontextmanager
from .schemas import HealthCheck, TaskCreate, UserCreate, TaskUpdate
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient
 
DATABASE_URL = str(os.getenv("DATABASE_URL", "sqlite:///todo.db"))

engine = create_engine(DATABASE_URL)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": True}, lifespan=lifespan)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session middleware
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# AWS Cognito configuration
REGION = 'eu-west-1'
USER_POOL_ID = 'eu-west-1_7GnxkjJTp'
CLIENT_ID = '2rboagge3tq8c6r3igp01ehtgd'
COGNITO_KEYS_URL = f'https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json'

# Dependency to get DB session
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

oauth2_scheme = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    token = credentials.credentials
    
    try:
        # Fetch public keys from AWS Cognito
        jwks_client = PyJWKClient(COGNITO_KEYS_URL)
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        # Decode and validate the token
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWKError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/tasks", response_model=List[Task])
def filter_sort_tasks(
    db: SessionDep,
    user_id: str,
    sort_by: str = Query("Creation Date", enum=["Creation Date", "Deadline", "Completion Status", "Priority"]),
    filter_by: str = Query("All", enum=["All", "Completed", "Incomplete"]),
    _: dict = Depends(verify_token)
):
    """
    Endpoint to filter and sort tasks for a given user.
    """
    # Retrieve user tasks
    tasks = get_user_tasks(db, user_id)
    
    return filter_and_sort_tasks(tasks, filter_by, sort_by)

@app.post("/users", response_model=UserCreate)
def create_user_endpoint(user: UserCreate, db: SessionDep, _: dict = Depends(verify_token)):
    """
    Endpoint to create a new user.
    """
    return create_user(db, user)

@app.post("/tasks", response_model=Task)
def create_task_endpoint(task: TaskCreate, db: SessionDep, _: dict = Depends(verify_token)):
    """
    Endpoint to create a new task given a specific user.
    """
    return create_task(db, task)

@app.put("/tasks/{task_id}", response_model=Task)
def update_task_endpoint(task_id: int, task: TaskUpdate, db: SessionDep, _: dict = Depends(verify_token)):
    """
    Endpoint to change the task specification.
    """
    return update_task(db, task_id, task)

@app.delete("/tasks/{task_id}", response_model=dict)
def delete_task_endpoint(task_id: int, db: SessionDep, _: dict = Depends(verify_token)):
    """
    Endpoint to delete a task from a specific user.
    """
    delete_task(db, task_id)
    return {"message": "Task deleted successfully"}

@app.get("/health", status_code=status.HTTP_200_OK, response_model=HealthCheck)
def health():
    return HealthCheck(status="OK")

