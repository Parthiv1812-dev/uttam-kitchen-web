import logging
import httpx
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send"


async def _send_sendgrid_email(to_email: str, subject: str, html_content: str, cc_email: str = None) -> bool:
    """
    Send email using SendGrid V3 API.
    """
    if not settings.sendgrid_api_key:
        logger.warning("SendGrid API Key not configured. Skipping email send.")
        return True

    headers = {
        "Authorization": f"Bearer {settings.sendgrid_api_key}",
        "Content-Type": "application/json",
    }

    # Construct SendGrid Payload
    personalizations = {
        "to": [{"email": to_email}]
    }
    if cc_email:
        personalizations["cc"] = [{"email": cc_email}]

    payload = {
        "personalizations": [personalizations],
        "from": {"email": settings.sender_email, "name": settings.app_name},
        "subject": subject,
        "content": [{"type": "text/html", "value": html_content}],
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(SENDGRID_API_URL, json=payload, headers=headers, timeout=10.0)
            if response.status_code in (200, 201, 202):
                logger.info("Email sent successfully via SendGrid to %s", to_email)
                return True
            else:
                logger.error(f"SendGrid API Error: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"Failed to connect to SendGrid API: {e}")
            return False


async def send_inquiry_email(inquiry: dict) -> bool:
    """
    Send inquiry details to the sales team via SendGrid.
    """
    try:
        product_name = inquiry.get("product_name") or "General Inquiry"
        subject = f"B2B inquiry for {product_name}"
        
        # Construct HTML body
        html_body = f"""
        <html>
          <body>
            <h2>New B2B Inquiry Received</h2>
            <p><strong>Name:</strong> {inquiry.get('name')}</p>
            <p><strong>Email:</strong> {inquiry.get('email')}</p>
            <p><strong>Phone:</strong> {inquiry.get('phone')}</p>
            <p><strong>Product:</strong> {inquiry.get('product_name')}</p>
            <p><strong>Description:</strong></p>
            <p>{inquiry.get('description')}</p>
          </body>
        </html>
        """

        if not settings.sendgrid_api_key:
            logger.warning("SendGrid API key missing. Logging inquiry instead.")
            logger.info("Inquiry details: %s", inquiry)
            return True

        return await _send_sendgrid_email(
            to_email=settings.sales_email,
            subject=subject,
            html_content=html_body,
            cc_email=inquiry.get("email")
        )

    except Exception as exc:
        logger.error("Failed to process inquiry email: %s", exc)
        return False


async def send_visit_request_email(visit_request: dict) -> bool:
    """
    Send visit request details to the sales team via SendGrid.
    """
    try:
        subject = "VISIT REQUEST"
        
        html_body = f"""
        <html>
          <body>
            <h2>New Facility Visit Request</h2>
            <p><strong>Name:</strong> {visit_request.get('name')}</p>
            <p><strong>Email:</strong> {visit_request.get('email')}</p>
            <p><strong>Phone:</strong> {visit_request.get('phone')}</p>
            <p><strong>Day:</strong> {visit_request.get('day')}</p>
            <p><strong>Time:</strong> {visit_request.get('time')}</p>
            <p><strong>Reason & Details:</strong></p>
            <p>{visit_request.get('details')}</p>
          </body>
        </html>
        """

        if not settings.sendgrid_api_key:
            logger.warning("SendGrid API key missing. Logging visit request instead.")
            logger.info("Visit request details: %s", visit_request)
            return True

        return await _send_sendgrid_email(
            to_email=settings.sales_email,
            subject=subject,
            html_content=html_body,
            cc_email=visit_request.get("email")
        )

    except Exception as exc:
        logger.error("Failed to process visit request email: %s", exc)
        return False
