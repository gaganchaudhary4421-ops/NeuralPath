from dotenv import load_dotenv
from pathlib import Path
import os
import secrets
import smtplib
from datetime import datetime, timedelta
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import Session

from database import get_db, Base
from models import User


load_dotenv(dotenv_path=r"D:\neuralpath\neuralpath\backend\.env")
print("ENV TEST:", os.getenv("GMAIL_USER"), os.getenv("GMAIL_APP_PASSWORD"))

GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
router = APIRouter(prefix="/auth", tags=["Password Reset"])

GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
TOKEN_EXPIRE_MINUTES = 15


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    token = Column(String(128), primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


def send_reset_email(to_email: str, reset_link: str):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset your NeuralPath password"
    msg["From"] = GMAIL_USER
    msg["To"] = to_email

    html = f"""
    <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #ffffff;">
      <div style="margin-bottom: 28px;">
        <span style="font-size: 22px; font-weight: 800; color: #0b3d1f; letter-spacing: -0.03em;">
          Neural<span style="color: #4ade80;">Path</span>
        </span>
      </div>
      <h2 style="font-size: 20px; font-weight: 700; color: #0b3d1f; margin-bottom: 8px;">
        Reset your password
      </h2>
      <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
        We received a request to reset your password. Click the button below to choose a new one.
        This link expires in <strong>15 minutes</strong>.
      </p>
      <a href="{reset_link}"
         style="display: inline-block; padding: 12px 28px; background: #0b3d1f; color: #ffffff;
                text-decoration: none; border-radius: 100px; font-weight: 700; font-size: 14px;">
        Reset Password →
      </a>
      <p style="font-size: 12px; color: #9ca3af; margin-top: 28px; line-height: 1.6;">
        If you didn't request this, you can safely ignore this email.<br/>
        Your password won't change until you click the link above.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="font-size: 11px; color: #d1d5db;">
        NeuralPath · AI-powered learning paths
      </p>
    </div>
    """

    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
        server.sendmail(GMAIL_USER, to_email, msg.as_string())


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()

    if not user:
        return {"message": "If that email exists, a reset link has been sent."}

    db.query(PasswordResetToken).filter(
        PasswordResetToken.email == body.email
    ).delete()

    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)

    reset_token = PasswordResetToken(
        token=token,
        email=body.email,
        expires_at=expires_at,
    )
    db.add(reset_token)
    db.commit()

    reset_link = f"{https://neural-path-gamma.vercel.app/}/reset-password?token={token}"  
    try:
        send_reset_email(body.email, reset_link)
    except Exception as e:
        print(f"[Email error] {e}")

    return {"message": "If that email exists, a reset link has been sent."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    if len(body.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters."
        )

    record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == body.token
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link."
        )

    if datetime.utcnow() > record.expires_at:
        db.delete(record)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset link has expired. Please request a new one."
        )

    user = db.query(User).filter(User.email == record.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    from auth.utils import hash_password
    user.hashed_password = hash_password(body.new_password)

    db.delete(record)
    db.commit()

    return {"message": "Password reset successfully."}


@router.get("/verify-reset-token/{token}", status_code=status.HTTP_200_OK)
def verify_reset_token(token: str, db: Session = Depends(get_db)):
    record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == token
    ).first()

    if not record or datetime.utcnow() > record.expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link."
        )

    return {"valid": True}