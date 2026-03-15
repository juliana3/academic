from fastapi import APIRouter, HTTPException
from sqlmodel import SQLModel
from datetime import datetime, timedelta
import jwt
import os

router = APIRouter(tags=["auth"])

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
PASSWORD = os.getenv("APP_PASSWORD", "correlax2024")

class LoginData(SQLModel):
    password: str

@router.post("/login")
def login(datos: LoginData):
    if datos.password != PASSWORD:
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    
    token = jwt.encode(
        {"exp": datetime.utcnow() + timedelta(days=30)},
        SECRET_KEY,
        algorithm="HS256"
    )
    return {"token": token}