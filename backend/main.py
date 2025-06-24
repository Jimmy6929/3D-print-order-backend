from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid
import os
from datetime import datetime

from supabase_client import supabase
from utils import calculate_price
from file_parser import parse_file, calculate_weight_from_volume, estimate_print_time, is_supported_format

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
    # Check if file format is supported
    if not is_supported_format(file.filename):
        raise HTTPException(status_code=400, detail="Only STL, OBJ, and STEP (.stp/.step) files are allowed")

    contents = await file.read()
    file_id = str(uuid.uuid4())
    
    # Get original file extension and determine bucket
    original_ext = file.filename.lower().split('.')[-1]
    file_name = f"{file_id}.{original_ext}"
    
    # Determine bucket based on file type
    # Temporary: Use stl-files for all types until other buckets are created
    if original_ext == 'stl':
        bucket_name = "stl-files"
    elif original_ext == 'obj':
        bucket_name = "stl-files"  # Temporary workaround
    elif original_ext in ['step', 'stp']:
        bucket_name = "stl-files"  # Temporary workaround
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    # Upload to appropriate Supabase Storage bucket
    storage_response = supabase.storage.from_(bucket_name).upload(file_name, contents)
    if not storage_response:
        raise HTTPException(status_code=500, detail="Upload failed")

    file_url = supabase.storage.from_(bucket_name).get_public_url(file_name)

    # Parse 3D file to get real volume and triangle count
    volume_mm3, triangle_count, file_format = parse_file(contents, file.filename)
    
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
            "material_density": 1.24,  # g/cm³
            "file_format": file_format,
            "original_filename": file.filename
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
    """Debug endpoint to list all files across all 3D storage buckets"""
    try:
        buckets = ["stl-files"]  # Temporary: using single bucket
        all_files = {}
        total_count = 0
        
        for bucket in buckets:
            try:
                files = supabase.storage.from_(bucket).list()
                file_count = len(files) if files else 0
                all_files[bucket] = {
                    "file_count": file_count,
                    "files": files[:5] if files else []  # Show first 5 files per bucket
                }
                total_count += file_count
            except Exception as bucket_error:
                all_files[bucket] = {
                    "error": str(bucket_error),
                    "file_count": 0,
                    "files": []
                }
        
        return {
            "total_files": total_count,
            "buckets": all_files
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

@app.get("/debug/buckets")
def check_storage_buckets():
    """Debug endpoint to check which storage buckets exist"""
    required_buckets = ["stl-files", "obj-files", "step-files"]
    bucket_status = {}
    
    for bucket in required_buckets:
        try:
            # Try to list files in the bucket to check if it exists
            files = supabase.storage.from_(bucket).list()
            bucket_status[bucket] = {
                "exists": True,
                "file_count": len(files) if files else 0,
                "status": "Ready"
            }
        except Exception as e:
            bucket_status[bucket] = {
                "exists": False,
                "file_count": 0,
                "status": f"Missing - {str(e)}"
            }
    
    return {
        "required_buckets": required_buckets,
        "bucket_status": bucket_status,
        "setup_complete": all(status["exists"] for status in bucket_status.values())
    }