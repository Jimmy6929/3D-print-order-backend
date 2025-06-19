from pydantic import BaseModel

class OrderCreate(BaseModel):
    weight_g: float
    print_time_h: float

class OrderResponse(BaseModel):
    id: str
    file_url: str
    weight_g: float
    print_time_h: float
    price_gbp: float
    status: str