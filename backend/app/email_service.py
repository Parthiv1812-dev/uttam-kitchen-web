import logging
import smtplib
import asyncio
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from functools import partial

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def _send_sync_email_smtp(message: MIMEMultipart, settings) -> None:
    """
    Synchronous function to send email via SMTP.
    Must be run in a separate thread to avoid blocking the event loop.
    """
    try:
        # Debugging: Log the host we are trying to reach
        logger.info(f"Connecting to SMTP: {settings.smtp_host}:{settings.smtp_port} User: {settings.smtp_username}")

        if settings.smtp_port == 465:
            # Implicit TLS (Port 465)
            with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=30) as server:
                server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(message)
        else:
            # STARTTLS (Port 587 or others)
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=30) as server:
                # server.set_debuglevel(1) # Uncomment to see full SMTP conversation in logs
                server.starttls()
                server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(message)
        
        logger.info("SMTP send successful.")
        
    except Exception as e:
        logger.error(f"SMTP connection error: {e}")
        raise e


async def _send_email_async(message: MIMEMultipart) -> bool:
    """
    Helper to run the sync SMTP call in a thread pool.
    """
    if not (settings.smtp_username and settings.smtp_password):
        logger.warning("SMTP not configured. Skipping email send.")
        return True

    loop = asyncio.get_running_loop()
    try:
        # Run synchronous SMTP call in a thread to avoid blocking asyncio loop
        await loop.run_in_executor(
            None, 
            partial(_send_sync_email_smtp, message, settings)
        )
        return True
    except Exception as exc:
        logger.error(f"Failed to send email execution: {exc}")
        return False


async def send_inquiry_email(inquiry: dict) -> bool:
    """
    Send inquiry details to the sales team.
    """
    try:
        message = MIMEMultipart("alternative")
        product_name = inquiry.get("product_name") or "General Inquiry"
        message["Subject"] = f"B2B inquiry for {product_name}"
        message["From"] = settings.smtp_username or "noreply@precisiontools.com"
        message["To"] = settings.sales_email
        if inquiry.get("email"):
            message["Cc"] = inquiry.get("email")

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
        message.attach(MIMEText(html_body, "html"))

        if not (settings.smtp_username and settings.smtp_password):
            logger.warning("SMTP not configured. Logging inquiry instead.")
            logger.info("Inquiry details: %s", inquiry)
            return True

        result = await _send_email_async(message)
        if result:
            logger.info("Inquiry email sent to %s", settings.sales_email)
        return result

    except Exception as exc:
        logger.error("Failed to compose/send inquiry email: %s", exc)
        return False


async def send_visit_request_email(visit_request: dict) -> bool:
    """
    Send visit request details to the sales team.
    """
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = "VISIT REQUEST"
        message["From"] = settings.smtp_username or "noreply@precisiontools.com"
        message["To"] = settings.sales_email
        if visit_request.get("email"):
            message["Cc"] = visit_request.get("email")

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
        message.attach(MIMEText(html_body, "html"))

        if not (settings.smtp_username and settings.smtp_password):
            logger.warning("SMTP not configured. Logging visit request instead.")
            logger.info("Visit request details: %s", visit_request)
            return True

        result = await _send_email_async(message)
        if result:
            logger.info("Visit request email sent to %s", settings.sales_email)
        return result

    except Exception as exc:
        logger.error("Failed to compose/send visit request email: %s", exc)
        return False
