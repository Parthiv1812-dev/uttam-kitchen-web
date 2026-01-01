import logging
import httpx
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


async def _send_brevo_email(to_email: str, subject: str, html_content: str, cc_email: str = None) -> bool:
    """
    Send email using Brevo (Sendinblue) Transactional API.
    """
    if not settings.brevo_api_key:
        logger.warning("Brevo API Key not configured. Skipping email send.")
        return True

    headers = {
        "accept": "application/json",
        "api-key": settings.brevo_api_key,
        "content-type": "application/json",
    }

    payload = {
        "sender": {"name": settings.app_name, "email": settings.sender_email},
        "to": [{"email": to_email}],
        "subject": subject,
        "htmlContent": html_content,
    }

    if cc_email:
        payload["cc"] = [{"email": cc_email}]

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(BREVO_API_URL, json=payload, headers=headers, timeout=10.0)
            if response.status_code in (200, 201, 202):
                logger.info("Email sent successfully via Brevo to %s", to_email)
                return True
            else:
                logger.error(f"Brevo API Error: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"Failed to connect to Brevo API: {e}")
            return False


async def send_inquiry_email(inquiry: dict) -> bool:
    """
    Send inquiry details to the sales team via Brevo.
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

        if not settings.brevo_api_key:
            logger.warning("Brevo API key missing. Logging inquiry instead.")
            logger.info("Inquiry details: %s", inquiry)
            return True

        return await _send_brevo_email(
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
    Send visit request details to the sales team via Brevo.
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

        if not settings.brevo_api_key:
            logger.warning("Brevo API key missing. Logging visit request instead.")
            logger.info("Visit request details: %s", visit_request)
            return True

        return await _send_brevo_email(
            to_email=settings.sales_email,
            subject=subject,
            html_content=html_body,
            cc_email=visit_request.get("email")
        )

    except Exception as exc:
        logger.error("Failed to process visit request email: %s", exc)
        return False
