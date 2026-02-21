from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    full_name: str
    phone_number: str
    role: str # "Farmer" or "Buyer"
    location_district: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    is_verified: bool

    class Config:
        from_attributes = True