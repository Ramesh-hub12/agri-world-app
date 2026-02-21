from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, database, os, shutil
from database import engine, get_db
from typing import Union, List
import datetime

app = FastAPI(title="Agri-World Global App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

CROP_ADVISORY = {
    "paddy": {
        "best_seeds_2026": ["Telangana Sona (RNR 15048)", "KNM 1638", "JGL 24423"],
        "fertilizer_tips": "Apply Zinc Sulphate 25kg/ha to prevent khaira disease.",
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

@app.post("/register", response_model=schemas.UserResponse)
def register_user(
    full_name: str = Form(...),
    phone_number: str = Form(...),
    role: str = Form(...),
    location_district: str = Form(...),
    company_name: str = Form(None),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.phone_number == phone_number).first()
    if db_user:
        return db_user
    
    new_user = models.User(
        full_name=full_name,
        phone_number=phone_number,
        role=role,
        location_district=location_district,
        company_name=company_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/user/profile/{user_id}", response_model=schemas.UserResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/advisory/{crop_name}")
def get_advisory(crop_name: str):
    crop_info = CROP_ADVISORY.get(crop_name.lower())
    if not crop_info:
        return {"error": "Crop data not available yet."}
    
    weather_forecast = "Heavy Rain" 
    warning = "⚠️ WARNING: Heavy rain predicted. Delay fertilizer application." if weather_forecast == "Heavy Rain" else ""

    return {
        "crop": crop_name,
        "weather_alert": warning,
        "data": crop_info
    }

@app.get("/rep/inventory")
async def get_rep_inventory():
    return [
        {"id": 1, "product": "BSH Nitro-Grow", "stock": 450, "price": 1150},
        {"id": 2, "product": "Agri-Tech Potash", "stock": 120, "price": 1400},
        {"id": 3, "product": "Premium Paddy Seed", "stock": 800, "price": 950}
    ]

@app.get("/rep/disease-trends")
async def get_disease_trends():
    return [
        {"id": 1, "district": "Warangal", "crop": "Paddy", "issue": "Blast Disease", "count": 12},
        {"id": 2, "district": "Karimnagar", "crop": "Cotton", "issue": "Pink Bollworm", "count": 8}
    ]

@app.get("/rep/generate-report")
async def generate_report():
    return {
        "report_date": str(datetime.date.today()),
        "total_active_farmers": 145,
        "critical_disease_alert": "Paddy Blast (High)",
        "inventory_status": "Low on Fungicides",
        "market_demand": "High for Organic Cotton"
    }

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
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

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
    return db.query(models.DiseasePost).order_by(models.DiseasePost.created_at.desc()).all()

@app.post("/list-crop")
def list_crop(
    farmer_id: int, 
    crop_name: str, 
    quantity: float, 
    price: float, 
    moisture: Union[float, None] = None, 
    is_organic: bool = False,
    db: Session = Depends(get_db)
):
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
def search_crops(crop: str = None, district: str = None, db: Session = Depends(get_db)):
    query = db.query(models.MarketplaceListing).join(models.User)
    if crop:
        query = query.filter(models.MarketplaceListing.crop_name.ilike(f"%{crop}%"))
    if district:
        query = query.filter(models.User.location_district.ilike(f"%{district}%"))
    return query.all()

@app.get("/market-check/{crop_name}")
def check_market_fairness(crop_name: str, current_price: float):
    standard_prices = {"Paddy": 23.00, "Cotton": 70.00, "Chilli": 150.00}
    market_avg = standard_prices.get(crop_name.capitalize(), 0)
    if current_price > market_avg:
        return {"status": "Premium", "tip": "Price is above average. Ensure quality tags are added."}
    return {"status": "Competitive", "tip": "Price is attractive for quick buyers."}

@app.post("/add-resource")
def add_resource(
    farmer_id: int, 
    item_name: str, 
    category: str, 
    quantity: float, 
    unit: str, 
    db: Session = Depends(get_db)
):
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
    resources = db.query(models.ResourceInventory).filter(models.ResourceInventory.farmer_id == farmer_id).all()
    alerts = [f"Low stock: {r.item_name}" for r in resources if r.stock_remaining < 5]
    return {"inventory": resources, "alerts": alerts}