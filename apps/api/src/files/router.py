from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.db.models import User, FileItem
import uuid
from datetime import datetime, timezone

from src.ai.gemini import classify_file

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

    # Read content to get real size
    content = await file.read()
    size_bytes = len(content)

    # Classify file using Gemini AI
    category = classify_file(file.filename, file.content_type or "")

    file_item = FileItem(
        id=uuid.uuid4(),
        user_id=user.id,
        original_name=file.filename,
        current_name=file.filename,
        relative_path=f"/{category}/{file.filename}",
        mime_type=file.content_type,
        size_bytes=size_bytes,
        category=category,
        status="processed"
    )
    db.add(file_item)
    db.commit()

    return {
        "filename": file.filename,
        "status": "processed",
        "category": category,
        "size_bytes": size_bytes,
        "proposed_path": f"/{category}/{file.filename}"
    }

@router.post("/process")
async def process_inbox(db: Session = Depends(get_db)):
    """Re-classify all pending files."""
    user = get_or_create_default_user(db)
    pending = db.query(FileItem).filter(
        FileItem.user_id == user.id,
        FileItem.status == "pending"
    ).all()

    processed = 0
    for item in pending:
        item.category = classify_file(item.original_name, item.mime_type or "")
        item.status = "processed"
        item.relative_path = f"/{item.category}/{item.original_name}"
        processed += 1

    db.commit()
    return {"processed": processed, "message": f"Processed {processed} files from inbox"}

@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    """Dashboard analytics stats."""
    user = get_or_create_default_user(db)
    files = db.query(FileItem).filter(FileItem.user_id == user.id).all()

    total = len(files)
    processed = len([f for f in files if f.status == "processed"])
    total_bytes = sum(f.size_bytes or 0 for f in files)
    categories = {}
    for f in files:
        categories[f.category] = categories.get(f.category, 0) + 1

    org_score = round((processed / total * 100) if total > 0 else 100)

    return {
        "total_files": total,
        "files_organized": processed,
        "total_bytes": total_bytes,
        "org_score": org_score,
        "categories": categories
    }

@router.get("/")
async def list_files(db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    files = db.query(FileItem).filter(FileItem.user_id == user.id).all()
    return files

@router.get("/activity")
async def get_activity(db: Session = Depends(get_db)):
    user = get_or_create_default_user(db)
    files = db.query(FileItem).filter(
        FileItem.user_id == user.id
    ).order_by(FileItem.created_at.desc()).limit(20).all()

    activities = []
    for f in files:
        if f.created_at:
            now = datetime.now(timezone.utc)
            created = f.created_at.replace(tzinfo=timezone.utc) if f.created_at.tzinfo is None else f.created_at
            diff = now - created
            if diff.seconds < 60:
                time_str = "Just now"
            elif diff.seconds < 3600:
                time_str = f"{diff.seconds // 60}m ago"
            elif diff.days == 0:
                time_str = f"{diff.seconds // 3600}h ago"
            else:
                time_str = f"{diff.days}d ago"
        else:
            time_str = "Recently"

        activities.append({
            "file": f.original_name,
            "action": f"Classified as {f.category} · moved to {f.relative_path}",
            "time": time_str,
            "category": f.category,
            "size": f.size_bytes
        })
    return activities

@router.delete("/clear")
async def clear_files(db: Session = Depends(get_db)):
    """Clear all files for current user."""
    user = get_or_create_default_user(db)
    db.query(FileItem).filter(FileItem.user_id == user.id).delete()
    db.commit()
    return {"message": "All files cleared"}
