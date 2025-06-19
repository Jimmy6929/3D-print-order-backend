import struct
import numpy as np
from typing import Tuple, List


def parse_stl_binary(file_content: bytes) -> Tuple[List[np.ndarray], int]:
    """
    Parse binary STL file and extract triangles.
    Returns: (triangles, triangle_count)
    """
    # Skip 80-byte header
    header = file_content[:80]
    
    # Read number of triangles (4 bytes, little endian)
    triangle_count = struct.unpack('<I', file_content[80:84])[0]
    
    triangles = []
    offset = 84
    
    for i in range(triangle_count):
        # Each triangle: 12 floats (normal + 3 vertices) + 2 bytes (attribute)
        # Normal vector (3 floats, 12 bytes) - we'll recalculate this
        normal = struct.unpack('<fff', file_content[offset:offset+12])
        offset += 12
        
        # Three vertices (9 floats, 36 bytes)
        vertex1 = np.array(struct.unpack('<fff', file_content[offset:offset+12]))
        offset += 12
        vertex2 = np.array(struct.unpack('<fff', file_content[offset:offset+12]))
        offset += 12
        vertex3 = np.array(struct.unpack('<fff', file_content[offset:offset+12]))
        offset += 12
        
        # Skip attribute byte count (2 bytes)
        offset += 2
        
        triangles.append(np.array([vertex1, vertex2, vertex3]))
    
    return triangles, triangle_count


def parse_stl_ascii(file_content: str) -> Tuple[List[np.ndarray], int]:
    """
    Parse ASCII STL file and extract triangles.
    Returns: (triangles, triangle_count)
    """
    lines = file_content.strip().split('\n')
    triangles = []
    current_triangle = []
    
    for line in lines:
        line = line.strip().lower()
        if line.startswith('vertex'):
            # Extract vertex coordinates
            parts = line.split()
            vertex = np.array([float(parts[1]), float(parts[2]), float(parts[3])])
            current_triangle.append(vertex)
            
            # If we have 3 vertices, complete the triangle
            if len(current_triangle) == 3:
                triangles.append(np.array(current_triangle))
                current_triangle = []
    
    return triangles, len(triangles)


def is_binary_stl(file_content: bytes) -> bool:
    """
    Determine if STL file is binary or ASCII format.
    """
    try:
        # Try to decode first 80 bytes as ASCII
        header = file_content[:80].decode('ascii', errors='strict')
        # If it starts with 'solid', it might be ASCII
        if header.strip().lower().startswith('solid'):
            # Check if the rest looks like ASCII
            try:
                file_content[80:].decode('ascii', errors='strict')
                return False  # ASCII
            except UnicodeDecodeError:
                return True   # Binary
        else:
            return True  # Binary
    except UnicodeDecodeError:
        return True  # Binary


def calculate_mesh_volume(triangles: List[np.ndarray]) -> float:
    """
    Calculate volume of a mesh using the divergence theorem.
    Each triangle contributes to the volume based on its position and normal.
    """
    volume = 0.0
    
    for triangle in triangles:
        v1, v2, v3 = triangle
        
        # Calculate triangle normal using cross product
        edge1 = v2 - v1
        edge2 = v3 - v1
        normal = np.cross(edge1, edge2)
        
        # Calculate triangle area
        area = 0.5 * np.linalg.norm(normal)
        
        # Calculate contribution to volume (dot product with centroid)
        centroid = (v1 + v2 + v3) / 3.0
        volume += np.dot(normal, centroid) / 6.0
    
    return abs(volume)


def parse_stl_file(file_content: bytes) -> Tuple[float, int]:
    """
    Parse STL file and return volume in cubic mm and triangle count.
    """
    try:
        if is_binary_stl(file_content):
            triangles, triangle_count = parse_stl_binary(file_content)
        else:
            # Convert bytes to string for ASCII parsing
            content_str = file_content.decode('utf-8')
            triangles, triangle_count = parse_stl_ascii(content_str)
        
        # Calculate volume in cubic units (assuming STL units are mm)
        volume_mm3 = calculate_mesh_volume(triangles)
        
        return volume_mm3, triangle_count
        
    except Exception as e:
        # If parsing fails, return default values
        print(f"STL parsing error: {e}")
        return 1000.0, 0  # Default 1000 mm³


def calculate_weight_from_volume(volume_mm3: float, material_density: float = 1.24) -> float:
    """
    Calculate weight from volume and material density.
    
    Args:
        volume_mm3: Volume in cubic millimeters
        material_density: Density in g/cm³ (default: PLA plastic ~1.24 g/cm³)
    
    Returns:
        Weight in grams
    """
    # Convert mm³ to cm³ (divide by 1000)
    volume_cm3 = volume_mm3 / 1000.0
    
    # Calculate weight: volume * density
    weight_grams = volume_cm3 * material_density
    
    return weight_grams


def estimate_print_time(volume_mm3: float, triangle_count: int) -> float:
    """
    Estimate print time based on volume and complexity.
    This is a rough estimation - real print time depends on many factors.
    
    Args:
        volume_mm3: Volume in cubic millimeters
        triangle_count: Number of triangles (complexity indicator)
    
    Returns:
        Estimated print time in hours
    """
    # Base time: ~0.1 hours per 1000 mm³
    volume_time = volume_mm3 / 10000.0
    
    # Complexity time: ~0.001 hours per 1000 triangles
    complexity_time = triangle_count / 1000000.0
    
    # Minimum 0.5 hours, maximum 50 hours
    total_time = max(0.5, min(50.0, volume_time + complexity_time))
    
    return total_time 