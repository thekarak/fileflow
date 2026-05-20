from sqlalchemy import Column, String, BigInteger, Boolean, DateTime, ForeignKey, Integer, DECIMAL, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    google_id = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    display_name = Column(String(255))
    role = Column(String(50), default='user')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FileItem(Base):
    __tablename__ = "files"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'))
    original_name = Column(String(1024), nullable=False)
    current_name = Column(String(1024), nullable=False)
    relative_path = Column(Text, nullable=False)
    mime_type = Column(String(255))
    size_bytes = Column(BigInteger)
    category = Column(String(255))
    status = Column(String(50), default='pending')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
