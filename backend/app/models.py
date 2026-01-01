from pydantic import BaseModel, EmailStr, field_validator
import re


class InquiryRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    description: str
    product_name: str = "General Inquiry"

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise ValueError("Name must be at least 2 characters long")
        return cleaned

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        cleaned = re.sub(r"[^\d+]", "", value)
        if len(cleaned) < 10:
            raise ValueError("Invalid phone number")
        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 10:
            raise ValueError("Description must be at least 10 characters long")
        return cleaned


class InquiryResponse(BaseModel):
    message: str
    success: bool = True


class VisitRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    day: str
    time: str
    details: str

    @field_validator("name")
    @classmethod
    def validate_visit_name(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise ValueError("Name must be at least 2 characters long")
        return cleaned

    @field_validator("phone")
    @classmethod
    def validate_visit_phone(cls, value: str) -> str:
        cleaned = re.sub(r"[^\d+]", "", value)
        if len(cleaned) < 10:
            raise ValueError("Invalid phone number")
        return value

    @field_validator("day")
    @classmethod
    def validate_day(cls, value: str) -> str:
        allowed = {"Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday"}
        if value not in allowed:
            raise ValueError("Invalid visit day")
        return value

    @field_validator("time")
    @classmethod
    def validate_time(cls, value: str) -> str:
        allowed = {
            "10:00 AM",
            "11:00 AM",
            "12:00 PM",
            "1:00 PM",
            "2:00 PM",
            "3:00 PM",
            "4:00 PM",
        }
        if value not in allowed:
            raise ValueError("Invalid visit time")
        return value

    @field_validator("details")
    @classmethod
    def validate_details(cls, value: str) -> str:
        cleaned = value.strip()
        if len(cleaned) < 10:
            raise ValueError("Details must be at least 10 characters long")
        return cleaned


class VisitRequestResponse(BaseModel):
    message: str
    success: bool = True
