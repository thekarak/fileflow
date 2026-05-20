from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.db.models import User, FileItem
import uuid

from src.db.models import User, FileItem
from src.ai.gemini import classify_file
import uuid

router = APIRouter()

def get_or_create_default_user(db: Session):
    user = db.query(User).filter(User.google_id == "dummy_dev_id").first()
    if not user:
        user = User(
            id=uuid.uuid4(),
            google_id="dummy_dev_id",
            email="developer@fileflow.local",
            display_name="Local Developer",
            role="user"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    
    # Classify file using Gemini API
    category = classify_file(file.filename, file.content_type or "")
    
    file_item = FileItem(
        id=uuid.uuid4(),
        user_id=user.id,
        original_name=file.filename,
        current_name=file.filename,
        relative_path=f"/{category}/{file.filename}",
        mime_type=file.content_type,
        size_bytes=0, 
        category=category,
        status="processed"
    )
    db.add(file_item)
    db.commit()
    
    return {"filename": file.filename, "status": "processed", "category": category}

@router.get("/")
async def list_files(db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    files = db.query(FileItem).filter(FileItem.user_id == user.id).all()
    return files

@router.get("/activity")
async def get_activity(db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    files = db.query(FileItem).filter(FileItem.user_id == user.id).order_by(FileItem.created_at.desc()).limit(10).all()
    
    activities = []
    for f in files:
        activities.append({
            "file": f.original_name,
            "action": f"moved to {f.category} / Auto-Organized",
            "time": "Recently"
        })
    return activities
