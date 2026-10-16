from fastapi import FastAPI, Depends, HTTPException
from dotenv import load_dotenv
from .schemas import CreateUser
from .models import User
from .database import get_db, Base, engine
from pwdlib import PasswordHash

import os

load_dotenv()

DB_URL = os.getenv("DATABASE_URL")

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Orvethiq Server",
    description="Orvethiq server is the backend for the Orvethiq application",
    version="1.0.0",
    docs_url="/",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


@app.get("/health")
def health(db=Depends(get_db)):
    try:
        if db:
            return {"status": "ok", "DB_URL": DB_URL}
        else:
            raise HTTPException(status_code=500, detail={"status": "error", "DB_URL": DB_URL})
    except Exception as e:
        raise HTTPException(status_code=500, detail={"status": "error", "DB_URL": DB_URL, "error": str(e)})

@app.post("/register")
def create_user(user: CreateUser,db=Depends(get_db)):
   db_user = db.query(User).filter(User.user_name == user.user_name).first()
   password_hash = PasswordHash.recommended()
   if db_user:
    return {"status":True, "message":"User already exists!"}
   new_user = User(user_name=user.user_name, password=password_hash.hash(user.password))
   db.add(new_user)
   db.commit()
   db.refresh(new_user)

   return {"status":True, "message":"User created successfully!", "data":new_user}
    
@app.post("/login")
def login(user:CreateUser, db=Depends(get_db)):
    db_user = db.query(User).filter(User.user_name == user.user_name).first()
    password_hash = PasswordHash.recommended()
    if not db_user:
        return {"status":False, "message":"User not found!"}
    if not password_hash.verify(user.password, db_user.password):
        return {"status":False, "message":"Incorrect password!"}
    return {"status":True, "message":"User logged in successfully!"}
    