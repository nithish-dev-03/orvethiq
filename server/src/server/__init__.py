from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from fastapi.responses import JSONResponse
from datetime import datetime, timedelta, timezone
from .database import get_db, Base, engine
from server.models.users import User
from typing import Callable
from .schemas import CreateUser
from pwdlib import PasswordHash
from dotenv import load_dotenv
import jwt
import os

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES") or "25")

if (not SECRET_KEY) or (not ALGORITHM):
    raise ValueError("SECRET_KEY or JWT_SECRET is not set in environment")

Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Orvethiq Server",
    description="Orvethiq server is the backend for the Orvethiq application",
    version="1.0.0",
    docs_url="/",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PUBLIC_PATHS = {"/", "/docs", "/redoc", "/openapi.json", "/login", "/register", "/forget", "/logout", "/health"}

@app.middleware("http")
async def check_token(request: Request, call_next: Callable):
    if request.url.path in PUBLIC_PATHS:
        return await call_next(request)

    token = request.cookies.get("orvethiq_token")
    if not token:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"status": False, "message": "Token not found!"},
        )
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        request.state.user = decoded
    except jwt.InvalidTokenError:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"status": False, "message": "Invalid token!"},
        )
    return await call_next(request)




@app.get("/health")
def health(db=Depends(get_db)):
    try:
        if db:
            return {"status": "ok", "DB_URL": DB_URL}
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"status": "error", "DB_URL": DB_URL})
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"status": "error", "DB_URL": DB_URL, "error": str(e)})

@app.post("/register")
def create_user(user: CreateUser,db=Depends(get_db)):
   print(f"USer name {user}")
   db_user = db.query(User).filter(User.user_name == user.user_name).first()
   password_hash = PasswordHash.recommended()
   if db_user:
    return {"status":False, "message":"User already exists!"}
   new_user = User(user_name=user.user_name, password=password_hash.hash(user.password))
   print(f"New user {new_user}")
   db.add(new_user)
   db.commit()
   db.refresh(new_user)

   return {"status":True, "message":"User created successfully!", "data":new_user}
    
@app.post("/login")
def login(response: Response,user:CreateUser, db=Depends(get_db)):
    db_user = db.query(User).filter(User.user_name == user.user_name).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"status":False, "message":"User not found!"})
    password_hash = PasswordHash.recommended()
    if not password_hash.verify(user.password, db_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"status":False, "message":"Incorrect password!"})
    encoded = jwt.encode(
        {
            "id": str(db_user.id),
            "user_name": user.user_name,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    response.set_cookie("orvethiq_token", encoded, secure=True, samesite="strict")
    return {"status":True, "message":"User logged in successfully!", "token": encoded}

@app.post("/forget")
def reset_pass(user:CreateUser,db=Depends(get_db)):
    db_user = db.query(User).filter(User.user_name == user.user_name).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"status":False, "message":"User not found!"})
    password_hash = PasswordHash.recommended()
    db_user.password = password_hash.hash(user.password)
    db.commit()
    db.refresh(db_user)
    return {"status":True, "message":"Password reset successfully!"}
    
@app.post("/logout")
def logout():
    return {"status": True, "message": "User logged out successfully!"}
    