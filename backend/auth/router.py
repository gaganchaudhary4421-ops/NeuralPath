from pathlib import Path
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import SignupRequest, LoginRequest, TokenResponse, UserResponse
from auth.utils import hash_password, verify_password, create_access_token
from auth.dependencies import get_current_user
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sendgrid
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail as SGMail
import os

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

router = APIRouter(prefix="/auth", tags=["Auth"])


class ForgotPasswordRequest(BaseModel):
    email: str



@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    user = User(
        name=body.name,
        email=body.email,
        hashed_password=hash_password(body.password[:72]),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token}


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = body.email
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"detail": "ok"}

    token = create_access_token({"sub": str(user.id), "type": "reset"}, expires_minutes=15)
    reset_link = f"https://neural-path-gamma.vercel.app/reset-password?token={token}"#add live url for password reset  

    EMAIL_FROM = os.getenv("GMAIL_USER")        
    EMAIL_PASS = os.getenv("GMAIL_APP_PASSWORD")  

    print(f"DEBUG → Sending reset email to: {email}")
    print(f"DEBUG → From account: {EMAIL_FROM}")
    print(f"DEBUG → App password loaded: {bool(EMAIL_PASS)}")

    if not EMAIL_FROM or not EMAIL_PASS:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Email credentials not configured. Check GMAIL_USER and GMAIL_APP_PASSWORD in .env"
        )

    try:
        msg = MIMEMultipart("alternative")
        msg["From"] =f"NeuralPath <{EMAIL_FROM}>"
        msg["To"] = email
        msg["Subject"] = "Reset your NeuralPath password"

        html = f"""
        <div style="font-family: 'DM Sans', sans-serif; max-width: 480px; margin: auto; padding: 32px;">
          <h2 style="color: #0b3d1f; margin-bottom: 8px;">Reset your password</h2>
          <p style="color: #4a7a5c;">Hi {user.name},</p>
          <p style="color: #4a7a5c; line-height: 1.6;">
            We received a request to reset your NeuralPath password.
            Click the button below — this link expires in <strong>15 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="{reset_link}"
               style="display:inline-block; padding:14px 32px; background:#1a6b3c;
                      color:#ffffff; border-radius:100px; text-decoration:none;
                      font-weight:700; font-size:15px;">
              Reset Password →
            </a>
          </div>
          <p style="color:#9ca3af; font-size:13px; line-height:1.6;">
            If you didn't request a password reset, you can safely ignore this email.
            Your password will not be changed.
          </p>
          <hr style="border:none; border-top:1px solid #e8f5ee; margin: 24px 0;" />
          <p style="color:#9ca3af; font-size:12px;">
            NeuralPath · AI-powered learning paths
          </p>
        </div>
        """

        sg_message =SGMail (
            from_email=EMAIL_FROM,
            to_emails=email,
            subject="Reset your NeuralPath password",
            html_content=html
        )
        sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
        sg.client.mail.send.post(request_body=sg_message.get())
        print("DEBUG → Reset email sent successfully")

    except smtplib.SMTPAuthenticationError:
        print("DEBUG → SMTP Auth failed — wrong email or app password")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Email authentication failed. Make sure you're using a Gmail App Password, not your regular password."
        )
    except Exception as e:
        print(f"DEBUG → Email error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Email failed: {str(e)}"
        )

    return {"detail": "ok"}