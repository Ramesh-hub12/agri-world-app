from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    phone_number = Column(String, unique=True, index=True)
    role = Column(String)
    location_district = Column(String)
    company_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    disease_posts = relationship("DiseasePost", back_populates="author")
    listings = relationship("MarketplaceListing", back_populates="farmer")
    resources = relationship("ResourceInventory", back_populates="farmer")

class DiseasePost(Base):
    __tablename__ = "disease_posts"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String)
    crop_type = Column(String)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    author_id = Column(Integer, ForeignKey("users.id"))

    author = relationship("User", back_populates="disease_posts")

class MarketplaceListing(Base):
    __tablename__ = "marketplace_listings"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String)
    quantity = Column(Float)
    price_per_kg = Column(Float)
    moisture_content = Column(Float, nullable=True)
    is_organic = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    farmer_id = Column(Integer, ForeignKey("users.id"))

    farmer = relationship("User", back_populates="listings")

class ResourceInventory(Base):
    __tablename__ = "resource_inventory"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String)
    category = Column(String)
    stock_remaining = Column(Float)
    unit = Column(String)
    farmer_id = Column(Integer, ForeignKey("users.id"))

    farmer = relationship("User", back_populates="resources")