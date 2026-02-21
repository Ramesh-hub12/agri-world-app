from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
import models, schemas, database,os,shutil
from database import engine, get_db
from typing import Union, List

app = FastAPI(title="Agri-World Global App")
models.Base.metadata.create_all(bind=database.engine)

# Dependency to get database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()
models.Base.metadata.create_all(bind=engine)

@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.phone_number == user.phone_number).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    new_user = models.User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

    # Temporary 'Brain' for 2026 Recommendations
CROP_ADVISORY = {
    "paddy": {
        "best_seeds_2026": ["Telangana Sona (RNR 15048)", "KNM 1638", "JGL 24423"],
        "fertilizer_tips": "Apply Zinc Sulphate 25kg/ha to prevent khaira disease common in Telangana soils.",
        "schedule": [
            {"period": "Basal", "task": "DAP 50kg + MOP 15kg"},
            {"period": "Tillering", "task": "Urea 25kg"},
            {"period": "Panicle Initiation", "task": "Urea 25kg + MOP 15kg"}
        ]
    },
    "cotton": {
        "best_seeds_2026": ["Kaveri 555", "Rasi 651", "US 7067"],
        "fertilizer_tips": "Focus on Boron sprays at flowering to prevent boll dropping.",
        "schedule": [
            {"period": "Basal", "task": "20:20:0:13 Complex 50kg"},
            {"period": "30 Days", "task": "Urea 25kg"},
            {"period": "60 Days", "task": "Urea 25kg + MOP 20kg"}
        ]
    }
}

@app.get("/advisory/{crop_name}")
def get_advisory(crop_name: str):
    crop_info = CROP_ADVISORY.get(crop_name.lower())
    if not crop_info:
        return {"error": "Crop data not available yet."}
    
    # World-Class Feature: Real-time Weather Warning (Simulated for now)
    # In a real app, we would call a Weather API here
    weather_forecast = "Heavy Rain" 
    
    warning = ""
    if weather_forecast == "Heavy Rain":
        warning = "⚠️ WARNING: Heavy rain predicted. Delay fertilizer application to avoid wastage."

    return {
        "crop": crop_name,
        "weather_alert": warning,
        "data": crop_info
    }

@app.get("/marketplace/search/{district}")
def search_farmers_by_zone(district: str, db: Session = Depends(get_db)):
    # This helps buyers find farmers in specific zones
    farmers = db.query(models.User).filter(
        models.User.location_district.ilike(district),
        models.User.role == "Farmer"
    ).all()
    
    return farmers

# Create a folder to save farmer photos
UPLOAD_DIR = "disease_images"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.post("/post-disease")
def post_disease(
    farmer_id: int = Form(...),
    crop_type: str = Form(...),
    description: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Save the image to your computer
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Save the details to the database
    new_post = models.DiseasePost(
        image_url=file_path,
        crop_type=crop_type,
        description=description,
        author_id=farmer_id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    return {"message": "Posted successfully!", "post_id": new_post.id}

@app.get("/community-feed")
def get_community_feed(db: Session = Depends(get_db)):
    # Returns all disease posts so other farmers can help
    posts = db.query(models.DiseasePost).order_by(models.DiseasePost.created_at.desc()).all()
    return posts


@app.post("/list-crop")
def list_crop(
    farmer_id: int, 
    crop_name: str, 
    quantity: float, 
    price: float, 
    moisture: Union[float, None] = None, # Use Union instead of Optional for Python 3.14 stability
    is_organic: bool = False,
    db: Session = Depends(get_db)
):
    # 1. Create the listing
    new_listing = models.MarketplaceListing(
        crop_name=crop_name,
        quantity=quantity,
        price_per_kg=price,
        moisture_content=moisture,
        is_organic=is_organic,
        farmer_id=farmer_id
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    
    return {"message": "Crop listed successfully!", "listing_id": new_listing.id}

@app.get("/marketplace/search")
def search_crops(crop: str = None, district: str = None, db: Session = Depends(database.get_db)):
    # 2. Advanced search for Buyers
    query = db.query(models.MarketplaceListing).join(models.User)
    
    if crop:
        query = query.filter(models.MarketplaceListing.crop_name.ilike(f"%{crop}%"))
    if district:
        query = query.filter(models.User.location_district.ilike(f"%{district}%"))
    
    return query.all()

@app.get("/market-check/{crop_name}")
def check_market_fairness(crop_name: str, current_price: float):
    # Data from 2026 Telangana Market Trends
    standard_prices = {
        "Paddy": 23.00, # per kg (₹2300/quintal)
        "Cotton": 70.00, # per kg (₹7000/quintal)
        "Chilli": 150.00  # per kg (₹15000/quintal)
    }
    
    market_avg = standard_prices.get(crop_name.capitalize(), 0)
    if current_price > market_avg:
        return {"status": "Premium", "tip": "Your price is above average. Ensure quality tags are added."}
    return {"status": "Competitive", "tip": "Your price is attractive for quick buyers."}

# Use 'get_db' directly in your routes now
@app.post("/add-resource")
def add_resource(
    farmer_id: int, 
    item_name: str, 
    category: str, 
    quantity: float, 
    unit: str, 
    db: Session = Depends(get_db)
):
    # This logic saves the fertilizer/seeds to your database
    new_resource = models.ResourceInventory(
        item_name=item_name,
        category=category,
        stock_remaining=quantity,
        unit=unit,
        farmer_id=farmer_id
    )
    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)
    return {"message": "Resource added successfully", "id": new_resource.id}

@app.get("/inventory/{farmer_id}")
def get_inventory(farmer_id: int, db: Session = Depends(get_db)):
    # This lets the farmer see their current stocks and get alerts
    resources = db.query(models.ResourceInventory).filter(models.ResourceInventory.farmer_id == farmer_id).all()
    
    # World-class logic: Alert if stock is less than 5 units
    alerts = [f"Low stock alert: {r.item_name}" for r in resources if r.stock_remaining < 5]
    
    return {
        "inventory": resources,
        "alerts": alerts
    }

