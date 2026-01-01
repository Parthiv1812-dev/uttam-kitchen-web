import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.email_service import send_inquiry_email, send_visit_request_email
from app.models import InquiryRequest, InquiryResponse, VisitRequest, VisitRequestResponse

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="API for Precision Tools website",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Precision Tools API is running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": settings.app_name}


@app.post("/api/inquiry", response_model=InquiryResponse)
async def submit_inquiry(inquiry: InquiryRequest):
    try:
        email_sent = await send_inquiry_email(inquiry.model_dump())
        if not email_sent:
            raise HTTPException(status_code=500, detail="Unable to send inquiry email")

        logger.info("Inquiry received from %s for %s", inquiry.name, inquiry.product_name)
        return InquiryResponse(
            message="Thank you for your inquiry! Our team will respond shortly.",
            success=True,
        )

    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - best-effort logging
        logger.error("Error processing inquiry: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to process inquiry") from exc


@app.post("/api/visit-request", response_model=VisitRequestResponse)
async def submit_visit_request(visit_request: VisitRequest):
    try:
        email_sent = await send_visit_request_email(visit_request.model_dump())
        if not email_sent:
            raise HTTPException(status_code=500, detail="Unable to send visit request email")

        logger.info("Visit request received from %s", visit_request.name)
        return VisitRequestResponse(
            message="Thank you! We'll confirm your visit shortly.",
            success=True,
        )

    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - best-effort logging
        logger.error("Error processing visit request: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to process visit request") from exc


if __name__ == "__main__":  # pragma: no cover
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
