from pydantic import BaseModel
from typing import Optional

class OrderCreate(BaseModel):
    weight_g: float
    print_time_h: float
    printer_type: str = "fdm"  # 'fdm' or 'resin'

class OrderConfirm(BaseModel):
    quote_id: str
    price: float
    file_url: str
    printer_type: str  # 'fdm' or 'resin'
    calculation_details: dict

class OrderResponse(BaseModel):
    id: str
    file_url: str
    weight_g: float
    print_time_h: float
    price_gbp: float
    status: str
    printer_type: str
    material_type: Optional[str] = None
    estimated_print_time_resin: Optional[float] = None
    price_fdm: Optional[float] = None
    price_resin: Optional[float] = None