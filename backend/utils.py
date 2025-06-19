def calculate_price(weight_g: float, print_time_h: float) -> float:
    material_cost = weight_g * 0.02  # £0.02 per gram
    labor_cost = print_time_h * 2.5  # £2.5 per hour
    base_fee = 2.0  # £2 base fee
    total_price = material_cost + labor_cost + base_fee
    return round(total_price, 2)