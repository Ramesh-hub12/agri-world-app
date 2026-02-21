from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    phone_number = Column(String, unique=True, index=True)
    role = Column(String)  # "Farmer" or "Buyer"
    is_verified = Column(Boolean, default=False)  # For Buyer GST/ID verification
    location_district = Column(String)  # e.g., "Warangal"
    
    # Relationship: A farmer has many disease posts
    posts = relationship("DiseasePost", back_populates="author")

class DiseasePost(Base):
    __tablename__ = "disease_posts"
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String)
    crop_type = Column(String)  # e.g., "Paddy"
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    author_id = Column(Integer, ForeignKey("users.id"))
    
    author = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    is_expert_verified = Column(Boolean, default=False)  # For "Best Treatment" badge
    post_id = Column(Integer, ForeignKey("disease_posts.id"))
    
    post = relationship("DiseasePost", back_populates="comments")

class MarketplaceListing(Base):
    __tablename__ = "marketplace_listings"
    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String)
    quantity = Column(Float)
    price_per_kg = Column(Float)
    moisture_content = Column(Float, nullable=True) # Global Quality Standard
    is_organic = Column(Boolean, default=False)
    farmer_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class ResourceInventory(Base):
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String) # e.g., "Urea", "Samba Mahsuri Seeds"
    category = Column(String) # "Fertilizer", "Seed", "Pesticide"
    stock_remaining = Column(Float)
    unit = Column(String) # "kg" or "bags"
    farmer_id = Column(Integer, ForeignKey("users.id"))