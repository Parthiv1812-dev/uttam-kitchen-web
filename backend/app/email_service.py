import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import aiosmtplib

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


async def send_inquiry_email(inquiry: dict) -> bool:
    """
    Send inquiry details to the sales team. Falls back to logging when SMTP
    credentials are not configured so the API remains non-blocking in dev.
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

        if settings.smtp_username and settings.smtp_password:
            # Use implicit TLS for port 465, otherwise use STARTTLS
            use_tls = settings.smtp_port == 465
            start_tls = not use_tls

            await aiosmtplib.send(
                message,
                hostname=settings.smtp_host,
                port=settings.smtp_port,
                username=settings.smtp_username,
                password=settings.smtp_password,
                use_tls=use_tls,
                start_tls=start_tls,
                timeout=10,  # 10s timeout
            )
            logger.info("Inquiry email sent to %s", settings.sales_email)
            return True

        logger.warning("SMTP not configured. Logging inquiry instead of sending email.")
        logger.info("Inquiry details: %s", inquiry)
        return True

    except Exception as exc:  # pragma: no cover - best-effort logging
        logger.error("Failed to send inquiry email: %s", exc)
        return False


async def send_visit_request_email(visit_request: dict) -> bool:
    """
    Send visit request details to the sales team. Falls back to logging when SMTP
    credentials are not configured so the API remains non-blocking in dev.
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

        if settings.smtp_username and settings.smtp_password:
            # Use implicit TLS for port 465, otherwise use STARTTLS
            use_tls = settings.smtp_port == 465
            start_tls = not use_tls

            await aiosmtplib.send(
                message,
                hostname=settings.smtp_host,
                port=settings.smtp_port,
                username=settings.smtp_username,
                password=settings.smtp_password,
                use_tls=use_tls,
                start_tls=start_tls,
                timeout=10,  # 10s timeout
            )
            logger.info("Visit request email sent to %s", settings.sales_email)
            return True

        logger.warning("SMTP not configured. Logging visit request instead of sending email.")
        logger.info("Visit request details: %s", visit_request)
        return True

    except Exception as exc:  # pragma: no cover - best-effort logging
        logger.error("Failed to send visit request email: %s", exc)
        return False
