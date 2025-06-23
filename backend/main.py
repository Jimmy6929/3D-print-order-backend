from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid
import os
from datetime import datetime

from supabase_client import supabase
from utils import calculate_price
from stl_parser import parse_stl_file, calculate_weight_from_volume, estimate_print_time

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # change to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".stl"):
        raise HTTPException(status_code=400, detail="Only STL files allowed")

    contents = await file.read()
    file_id = str(uuid.uuid4())
    file_name = f"{file_id}.stl"

    # Upload to Supabase Storage
    storage_response = supabase.storage.from_("stl-files").upload(file_name, contents)
    if not storage_response:
        raise HTTPException(status_code=500, detail="Upload failed")

    file_url = supabase.storage.from_("stl-files").get_public_url(file_name)

    # Parse STL file to get real volume and triangle count
    volume_mm3, triangle_count = parse_stl_file(contents)
    
    # Calculate real weight and print time
    weight_g = calculate_weight_from_volume(volume_mm3)
    print_time_h = estimate_print_time(volume_mm3, triangle_count)
    price = calculate_price(weight_g, print_time_h)

    # Return quote data without saving to database yet
    return {
        "quote_id": file_id, 
        "price": price, 
        "file_url": file_url,
        "calculation_details": {
            "volume_mm3": volume_mm3,
            "volume_cm3": volume_mm3 / 1000,
            "triangle_count": triangle_count,
            "weight_g": weight_g,
            "print_time_h": print_time_h,
            "material": "PLA",
            "material_density": 1.24  # g/cm³
        }
    }

@app.post("/confirm-order")
async def confirm_order(quote_data: dict):
    # Save confirmed order to Supabase
    order = {
        "id": quote_data["quote_id"],
        "file_url": quote_data["file_url"],
        "weight_g": quote_data["calculation_details"]["weight_g"],
        "print_time_h": quote_data["calculation_details"]["print_time_h"],
        "price_gbp": quote_data["price"],
        "status": "pending",
        "created_at": datetime.now().isoformat(),
    }

    supabase.table("orders").insert(order).execute()

    return {
        "order_id": quote_data["quote_id"],
        "status": "confirmed",
        "message": "Order confirmed successfully"
    }

@app.get("/order/{order_id}")
def get_order(order_id: str):
    response = supabase.table("orders").select("*").eq("id", order_id).single().execute()
    if response.data:
        return response.data
    else:
        raise HTTPException(status_code=404, detail="Order not found")

@app.patch("/order/{order_id}")
def update_order_status(order_id: str, status: str):
    response = supabase.table("orders").update({"status": status}).eq("id", order_id).execute()
    return {"message": "Order status updated", "new_status": status}

@app.get("/orders")
def get_all_orders():
    response = supabase.table("orders").select("*").execute()
    return response.data

@app.get("/debug/files")
def list_storage_files():
    """Debug endpoint to list all files in stl-files storage"""
    try:
        files = supabase.storage.from_("stl-files").list()
        return {
            "bucket": "stl-files", 
            "file_count": len(files) if files else 0,
            "files": files[:10] if files else []  # Show first 10 files
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/debug/orders-with-files")
def list_orders_with_file_info():
    """Debug endpoint to show orders with file URL info"""
    try:
        response = supabase.table("orders").select("id, file_url, created_at").execute()
        return {
            "order_count": len(response.data) if response.data else 0,
            "orders": response.data[:5] if response.data else []  # Show first 5 orders
        }
    except Exception as e:
        return {"error": str(e)}