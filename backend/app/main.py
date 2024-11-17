import os
import base64
import requests
import jwt
from jwt import PyJWKClient
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware 
from fastapi import FastAPI, Depends, status, Request
from sqlmodel import Session, create_engine, SQLModel
from .models import User, Task
from .crud import *
from typing import Annotated, List
from contextlib import asynccontextmanager
from .schemas import HealthCheck, TaskCreate, UserCreate, TaskUpdate

DATABASE_URL = str(os.getenv("DATABASE_URL", "sqlite:///todo.db"))

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

# Session middleware
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)

# AWS Cognito configuration
COGNITO_DOMAIN = 'https://todo-auth-domain.auth.eu-west-1.amazoncognito.com'
CLIENT_ID = '460soms42cqcn9lo4bp5mbtl6l'
# CLIENT_SECRET = 'YOUR_APP_CLIENT_SECRET'
# REDIRECT_URI = 'http://localhost:3000/auth/callback'
USER_POOL_ID = 'eu-west-1_xIATMdc2y'
COGNITO_KEYS_URL = f'https://cognito-idp.ew-west-1.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json'

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
    return create_task(db, task)

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

@app.get("/health", status_code=status.HTTP_200_OK, response_model=HealthCheck)
def health():
    return HealthCheck(status="OK")

@app.post("/auth/callback")
async def auth_callback(request: Request):
    data = await request.json()
    code = data.get('code')

    # Exchange authorization code for tokens
    token_url = f'https://{COGNITO_DOMAIN}/oauth2/token'

    payload = {
        'grant_type': 'authorization_code',
        'client_id': CLIENT_ID,
        'code': code,
        # 'redirect_uri': REDIRECT_URI,
    }

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    # if CLIENT_SECRET:
    #     auth_str = f'{CLIENT_ID}:{CLIENT_SECRET}'
    auth_str = f'{CLIENT_ID}'
    b64_auth_str = base64.b64encode(auth_str.encode()).decode()
    headers['Authorization'] = f'Basic {b64_auth_str}'

    response = requests.post(token_url, data=payload, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Failed to get tokens')

    tokens = response.json()
    id_token = tokens.get('id_token')

    # Verify and decode the ID token
    decoded_token = verify_token(id_token)

    # Store user info in session
    request.session['user'] = {
        'username': decoded_token.get('cognito:username'),
        'email': decoded_token.get('email'),
        'sub': decoded_token.get('sub'),
    }

    return {'message': 'Authentication successful'}

def verify_token(token):
    # Fetch Cognito's public keys
    try:
        # Initialize PyJWKClient
        jwk_client = PyJWKClient(COGNITO_KEYS_URL)

        # Fetch the signing key for the token
        signing_key = jwk_client.get_signing_key_from_jwt(token)

        # Decode and verify the token
        decoded = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
            issuer=f"https://cognito-idp.us-east-1.amazonaws.com/{USER_POOL_ID}",
        )
        return decoded
    except Exception as e:
        print(f"Token verification failed: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

@app.get("/auth/status")
async def auth_status(request: Request):
    user = request.session.get('user')
    if user:
        return {'authenticated': True, 'user': user}
    else:
        return {'authenticated': False}

def get_current_user(request: Request):
    user = request.session.get('user')
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user

@app.get("/protected-endpoint")
async def protected_endpoint(user: dict = Depends(get_current_user)):
    return {'message': f'Hello, {user["username"]}'}

@app.get("/logout")
async def logout(request: Request):
    request.session.clear()
    # Optionally redirect to Cognito logout URL
    return {'message': 'Logged out'}
