import logging
import os
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware 
from fastapi import FastAPI, Depends, status, Query
from sqlmodel import Session, create_engine, SQLModel
from .models import User, Task
from .crud import *
from typing import Annotated, Dict, List
from contextlib import asynccontextmanager
from .schemas import HealthCheck, TaskCreate, UserCreate, TaskUpdate, TaskStats, UserProfile, UserUpdateRequest
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = str(os.getenv("DATABASE_URL", "sqlite:///todo.db"))
SECRET_KEY = str(os.getenv('SECRET_KEY', 'K%!MaoL26XQe8iGAAyDrmbkw&bqE$hCPw4hSk!Hf'))
REGION = str(os.getenv('REGION'))
USER_POOL_ID = str(os.getenv('USER_POOL_ID'))
CLIENT_ID = str(os.getenv('CLIENT_ID'))
FRONTEND_URL = str(os.getenv('FRONTEND_URL'))

engine = create_engine(DATABASE_URL)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(swagger_ui_parameters={"syntaxHighlight": True}, lifespan=lifespan)

origins = [
    # FRONTEND_URL,
    "*",
]

logger.info(f"Allowed CORS origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=
    [
        # "POST", 
        # "GET", 
        # "OPTIONS", 
        # "PUT", 
        # "DELETE"
        "*",
    ],
    allow_headers=
    [
        # "Content-Type",
        # "Authorization",
        # "Accept",
        # "X-Requested-With",
        # "Origin",
        # "Cache-Control"
        "*",
    ],
    expose_headers=
    [
        "*",
    ],
)

app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# AWS Cognito configuration
COGNITO_KEYS_URL = f'https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json'

# Dependency to get DB session
def get_session():
    with Session(engine) as session:
        yield session

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


SessionDep = Annotated[Session, Depends(get_session)]
TokenDep = Annotated[Dict, Depends(verify_token)]

@app.get("/tasks", response_model=List[Task])
def filter_sort_tasks(
    db: SessionDep,
    token: TokenDep,
    user_id: str,
    sort_by: str = Query("Creation Date", enum=["Creation Date", "Deadline", "Completion Status", "Priority"]),
    filter_by: str = Query("All", enum=["All", "Completed", "Incomplete"]),
):
    """
    Endpoint to filter and sort tasks for a given user.
    """
    # Retrieve user tasks
    token_user_id = token.get("sub")
    if not token_user_id:
        raise HTTPException(status_code=401, detail="Invalid token: 'sub' claim is missing or invalid")

    if token_user_id != user_id:
        raise HTTPException(status_code=401, detail="User ID mismatch")
    
    tasks = get_user_tasks(db, token_user_id)
    
    return filter_and_sort_tasks(tasks, filter_by, sort_by)

@app.post("/users", response_model=UserCreate)
def create_user_endpoint(user: UserCreate, db: SessionDep, _: TokenDep):
    """
    Endpoint to create a new user.
    """
    return create_user(db, user)

@app.post("/tasks", response_model=Task)
def create_task_endpoint(task: TaskCreate, db: SessionDep, token: TokenDep):
    """
    Endpoint to create a new task given a specific user.
    """
    token_user_id = token.get("sub")
    if not token_user_id:
        raise HTTPException(status_code=401, detail="Invalid token: 'sub' claim is missing or invalid")

    if token_user_id != task.owner_id:
        raise HTTPException(status_code=401, detail="User ID mismatch")

    return create_task(db, task)

@app.put("/tasks/{task_id}", response_model=Task)
def update_task_endpoint(task_id: int, task: TaskUpdate, db: SessionDep, token: TokenDep):
    """
    Endpoint to change the task specification.
    """
    existing_task = get_task_by_id(db, task_id)

    if existing_task.owner_id != token.get("sub"):
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    return update_task(db, task_id, task)

@app.delete("/tasks/{task_id}", response_model=dict)
def delete_task_endpoint(task_id: int, db: SessionDep, token: TokenDep):
    """
    Endpoint to delete a task from a specific user.
    """
    existing_task = get_task_by_id(db, task_id)

    if existing_task.owner_id != token.get("sub"):
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    delete_task(db, task_id)
    return {"message": "Task deleted successfully"}

@app.get("/tasks/stats/{user_id}", response_model=TaskStats)
def get_task_statistics_endpoint(user_id: str, db: SessionDep, token: TokenDep):
    """
    Endpoint to get task stats.
    """
    token_user_id = token.get("sub")
    if not token_user_id:
        raise HTTPException(status_code=401, detail="Invalid token: 'sub' claim is missing or invalid")

    if token_user_id != user_id:
        raise HTTPException(status_code=401, detail="User ID mismatch")

    return get_task_statistics(user_id, db) 

@app.get("/users/{user_id}", response_model=UserProfile)
def get_user_endpoint(user_id: str, db: SessionDep, token: TokenDep):
    if user_id != token.get("sub"):
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    user = get_user(db, user_id) 

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user 

@app.put("/users/{user_id}", response_model=UserProfile)
def update_user_profile_endpoint(user_id: str, update_request: UserUpdateRequest, db: SessionDep, token: TokenDep):
    if user_id != token.get("sub"):
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    return update_user_profile(user_id, update_request, db) 

@app.get("/health", status_code=status.HTTP_200_OK, response_model=HealthCheck)
def health():
    return HealthCheck(status="OK")

