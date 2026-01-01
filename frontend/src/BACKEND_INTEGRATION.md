# FastAPI Backend Integration Guide

This document provides guidance on integrating your Python FastAPI backend with the React frontend.

## B2B Inquiry Form Integration

The B2B Inquiry form (`/components/B2BInquiryModal.tsx`) currently makes a POST request to `/api/b2b-inquiry`. You'll need to create this endpoint in your FastAPI backend.

### FastAPI Backend Example

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = FastAPI()

# Configure CORS to allow requests from your React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://yourdomain.com"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class B2BInquiry(BaseModel):
    name: str
    email: EmailStr
    phone: str
    description: str
    productName: str = ""

@app.post("/api/b2b-inquiry")
async def create_b2b_inquiry(inquiry: B2BInquiry):
    try:
        # Send email to sales team
        send_inquiry_email(inquiry)
        
        # Optionally: Save to database
        # db.save_inquiry(inquiry)
        
        return {"message": "Inquiry submitted successfully", "success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def send_inquiry_email(inquiry: B2BInquiry):
    """
    Send inquiry details to sales email
    Configure your SMTP settings here
    """
    sender_email = "noreply@precisiontools.com"
    receiver_email = "sales@precisiontools.com"
    password = "your-email-password"  # Use environment variables for production!
    
    message = MIMEMultipart("alternative")
    message["Subject"] = f"New B2B Inquiry - {inquiry.productName or 'General'}"
    message["From"] = sender_email
    message["To"] = receiver_email
    
    # Create email body
    html = f"""
    <html>
      <body>
        <h2>New B2B Inquiry Received</h2>
        <p><strong>Name:</strong> {inquiry.name}</p>
        <p><strong>Email:</strong> {inquiry.email}</p>
        <p><strong>Phone:</strong> {inquiry.phone}</p>
        <p><strong>Product Interest:</strong> {inquiry.productName or 'N/A'}</p>
        <p><strong>Inquiry Description:</strong></p>
        <p>{inquiry.description}</p>
      </body>
    </html>
    """
    
    part = MIMEText(html, "html")
    message.attach(part)
    
    # Send email
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:  # Update SMTP settings
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Environment Variables

Create a `.env` file for your FastAPI backend:

```env
SALES_EMAIL=sales@precisiontools.com
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

### Running the Backend

```bash
# Install dependencies
pip install fastapi uvicorn python-dotenv python-multipart pydantic[email]

# Run the server
uvicorn main:app --reload --port 8000
```

### Frontend Configuration

Update the API endpoint in `/components/B2BInquiryModal.tsx`:

```typescript
const response = await fetch('http://localhost:8000/api/b2b-inquiry', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
});
```

For production, use environment variables:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const response = await fetch(`${API_URL}/api/b2b-inquiry`, { ... });
```

## Database Storage (Optional)

If you want to store inquiries in a database:

```python
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class Inquiry(Base):
    __tablename__ = "inquiries"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100))
    phone = Column(String(50))
    product_name = Column(String(200))
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create database connection
engine = create_engine("sqlite:///./inquiries.db")
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

## Additional Notes

1. **Security**: Always use environment variables for sensitive data (API keys, passwords)
2. **CORS**: Update CORS settings to match your production domain
3. **Rate Limiting**: Consider implementing rate limiting to prevent spam
4. **Validation**: The Pydantic model provides basic validation; add more as needed
5. **Error Handling**: Implement comprehensive error handling and logging
6. **Testing**: Test the email functionality thoroughly before deploying

## Alternative: Using a Service Like SendGrid

```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_inquiry_email_sendgrid(inquiry: B2BInquiry):
    message = Mail(
        from_email='noreply@precisiontools.com',
        to_emails='sales@precisiontools.com',
        subject=f'New B2B Inquiry - {inquiry.productName or "General"}',
        html_content=f'''
            <h2>New B2B Inquiry</h2>
            <p><strong>Name:</strong> {inquiry.name}</p>
            <p><strong>Email:</strong> {inquiry.email}</p>
            <p><strong>Phone:</strong> {inquiry.phone}</p>
            <p><strong>Description:</strong> {inquiry.description}</p>
        '''
    )
    
    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    response = sg.send(message)
    return response
```

For any questions or issues with the integration, please refer to the FastAPI and your email service provider's documentation.
