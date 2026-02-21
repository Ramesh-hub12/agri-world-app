from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    full_name: str
    phone_number: str
    role: str
    location_district: str
    company_name: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class DiseasePostBase(BaseModel):
    crop_type: str
    description: str

class DiseasePostResponse(DiseasePostBase):
    id: int
    image_url: str
    created_at: datetime
    author_id: int

    class Config:
        from_attributes = True

class MarketplaceListingBase(BaseModel):
    crop_name: str
    quantity: float
    price_per_kg: float
    moisture_content: Optional[float] = None
    is_organic: bool = False

class MarketplaceListingResponse(MarketplaceListingBase):
    id: int
    created_at: datetime
    farmer_id: int

    class Config:
        from_attributes = True

class ResourceInventoryBase(BaseModel):
    item_name: str
    category: str
    stock_remaining: float
    unit: str

class ResourceInventoryResponse(ResourceInventoryBase):
    id: int
    farmer_id: int

    class Config:
        from_attributes = True