def calculate_price_fdm(weight_g: float, print_time_h: float) -> float:
    """Calculate price for FDM printing (current logic)"""
    material_cost = weight_g * 0.02  # £0.02 per gram (PLA/PETG)
    labor_cost = print_time_h * 2.5  # £2.5 per hour
    setup_fee = 2.0  # £2 setup fee
    total_price = material_cost + labor_cost + setup_fee
    return round(total_price, 2)

def calculate_price_resin(weight_g: float, print_time_h: float) -> float:
    """Calculate price for Resin printing"""
    # Resin is more expensive per gram but faster printing
    material_cost = weight_g * 0.08  # £0.08 per gram (resin is ~4x more expensive)
    labor_cost = print_time_h * 2.5  # £2.5 per hour (same labor rate as FDM)
    setup_fee = 10.0  # £10 setup fee (higher setup cost for resin)
    post_processing = 1.5  # £1.5 for washing and curing
    total_price = material_cost + labor_cost + setup_fee + post_processing
    return round(total_price, 2)

def calculate_dual_pricing(weight_g: float, print_time_h: float) -> dict:
    """Calculate pricing for both printer types"""
    # For resin, print time is typically faster (especially for small/detailed parts)
    resin_print_time = max(0.3, print_time_h * 0.6)  # Resin is ~40% faster
    
    return {
        "fdm": {
            "price": calculate_price_fdm(weight_g, print_time_h),
            "print_time_h": print_time_h,
            "material_type": "PLA/PETG",
            "technology": "FDM",
            "details": {
                "material_cost": weight_g * 0.02,
                "labor_cost": print_time_h * 2.5,
                "setup_fee": 2.0,
                "post_processing": 0.0
            }
        },
        "resin": {
            "price": calculate_price_resin(weight_g, resin_print_time),
            "print_time_h": resin_print_time,
            "material_type": "Photopolymer Resin",
            "technology": "SLA/DLP",
            "details": {
                "material_cost": weight_g * 0.08,
                "labor_cost": resin_print_time * 2.5,
                "setup_fee": 10.0,
                "post_processing": 1.5
            }
        }
    }

# Keep backward compatibility
def calculate_price(weight_g: float, print_time_h: float) -> float:
    """Legacy function - defaults to FDM pricing"""
    return calculate_price_fdm(weight_g, print_time_h)