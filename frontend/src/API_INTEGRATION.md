# FastAPI Backend Integration Guide

This document provides guidance for integrating the PrecisionTools frontend with a FastAPI backend.

## Required Backend Endpoints

### 1. B2B Inquiry Submission

**Endpoint:** `POST /api/inquiries`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "description": "string",
  "product": "string (optional)",
  "timestamp": "string (ISO 8601 format)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inquiry received successfully",
  "inquiry_id": "string"
}
```

**FastAPI Implementation Example:**
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = FastAPI()

class InquiryRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    description: str
    product: str | None = None
    timestamp: str

@app.post("/api/inquiries")
async def create_inquiry(inquiry: InquiryRequest):
    try:
        # Save to database (example using your preferred ORM)
        # inquiry_id = save_to_database(inquiry)
        
        # Send email to sales team
        send_inquiry_email(inquiry)
        
        return {
            "success": True,
            "message": "Inquiry received successfully",
            "inquiry_id": "generated_id_here"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def send_inquiry_email(inquiry: InquiryRequest):
    """Send inquiry details to sales team"""
    sender_email = "noreply@precisiontools.com"
    receiver_email = "sales@precisiontools.com"
    password = "YOUR_EMAIL_PASSWORD"  # Use environment variables
    
    message = MIMEMultipart("alternative")
    message["Subject"] = f"New B2B Inquiry - {inquiry.product if inquiry.product else 'General'}"
    message["From"] = sender_email
    message["To"] = receiver_email
    
    html = f"""
    <html>
      <body>
        <h2>New B2B Inquiry</h2>
        <p><strong>Name:</strong> {inquiry.name}</p>
        <p><strong>Email:</strong> {inquiry.email}</p>
        <p><strong>Phone:</strong> {inquiry.phone}</p>
        <p><strong>Product:</strong> {inquiry.product if inquiry.product else 'N/A'}</p>
        <p><strong>Description:</strong></p>
        <p>{inquiry.description}</p>
        <p><strong>Timestamp:</strong> {inquiry.timestamp}</p>
      </body>
    </html>
    """
    
    part = MIMEText(html, "html")
    message.attach(part)
    
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, message.as_string())
```

## Frontend Integration

### Update the B2BInquiryModal Component

Replace the mock API call in `/components/B2BInquiryModal.tsx`:

```typescript
// Replace this line:
// await new Promise((resolve) => setTimeout(resolve, 1500));

// With actual API call:
const response = await fetch('https://your-backend-url.com/api/inquiries', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    ...formData,
    product: productName,
    timestamp: new Date().toISOString(),
  }),
});

if (!response.ok) {
  throw new Error('Failed to submit inquiry');
}

const result = await response.json();
```

## CORS Configuration

Add CORS middleware to your FastAPI backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Environment Variables

Create a `.env` file for your backend:

```
DATABASE_URL=postgresql://user:password@localhost/precisiontools
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=465
SMTP_USERNAME=noreply@precisiontools.com
SMTP_PASSWORD=your_password_here
SALES_EMAIL=sales@precisiontools.com
```

## Deployment

### Backend Deployment (Example using Railway/Render)
1. Create a `requirements.txt`:
```
fastapi
uvicorn[standard]
pydantic[email]
sqlalchemy
python-dotenv
```

2. Create a `Procfile` or startup command:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend Configuration
Update the API base URL in your frontend:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

## Additional Features to Consider

1. **Rate Limiting:** Add rate limiting to prevent spam inquiries
2. **Email Validation:** Verify email addresses before sending
3. **Database:** Store inquiries in PostgreSQL/MySQL for tracking
4. **Admin Dashboard:** Create a dashboard to manage inquiries
5. **Automated Responses:** Send confirmation emails to customers
6. **Analytics:** Track inquiry sources and conversion rates

## Testing

Test your API endpoints:
```bash
curl -X POST "http://localhost:8000/api/inquiries" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "description": "Test inquiry",
    "product": "ProMax Drill",
    "timestamp": "2025-12-01T10:00:00Z"
  }'
```
