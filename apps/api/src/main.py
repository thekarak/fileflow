from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.files import router as files_router
from src.auth import router as auth_router
from src.db.database import init_db

app = FastAPI(
    title="Fileflow API",
    description="Backend API for Smart File Organizer",
    version="1.0.0"
)

@app.on_event("startup")
def startup_event():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(files_router.router, prefix="/api/v1/files", tags=["files"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Fileflow API"}
