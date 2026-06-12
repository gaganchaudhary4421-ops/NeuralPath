from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    learning_paths = relationship("LearningPath", back_populates="owner", cascade="all, delete")


class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goal = Column(String(500), nullable=False)
    focus = Column(Text, nullable=True)
    markdown = Column(Text, nullable=True)
    path_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    completed_weeks = Column(JSON, nullable=True, default=list)    
    quiz_history = Column(JSON, nullable=True, default=list)       
    last_activity = Column(DateTime(timezone=True), nullable=True)
 
    owner = relationship("User", back_populates="learning_paths")