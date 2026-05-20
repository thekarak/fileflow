from fastapi import APIRouter
from pydantic import BaseModel
import uuid

router = APIRouter()

class DummyUserResponse(BaseModel):
    status: str
    user_id: str
    token: str

@router.get("/login", response_model=DummyUserResponse)
async def login():
    # Bypass OAuth for now - return a dummy user and token
    return {
        "status": "authenticated", 
        "user_id": str(uuid.uuid4()), 
        "token": "dummy_jwt_token_for_local_dev"
    }

@router.get("/callback")
async def callback():
    # Stub for Google OAuth callback - unused in dev mode
    return {"status": "authenticated", "token": "dummy_jwt_token"}

