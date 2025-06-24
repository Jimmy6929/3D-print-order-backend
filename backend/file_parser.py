import struct
import numpy as np
import tempfile
import os
from typing import Tuple, List, Optional
import io

# Import additional libraries for different file formats
try:
    import trimesh
    TRIMESH_AVAILABLE = True
except ImportError:
    TRIMESH_AVAILABLE = False

try:
    import open3d as o3d
    OPEN3D_AVAILABLE = True
except ImportError:
    OPEN3D_AVAILABLE = False

# Fallback to the original STL parser functions
from stl_parser import parse_stl_binary, parse_stl_ascii, is_binary_stl, calculate_mesh_volume


def get_file_extension(filename: str) -> str:
    """Extract file extension from filename."""
    return filename.lower().split('.')[-1]


def is_supported_format(filename: str) -> bool:
    """Check if the file format is supported."""
    ext = get_file_extension(filename)
    return ext in ['stl', 'obj', 'step', 'stp']


def parse_obj_file(file_content: bytes) -> Tuple[List[np.ndarray], int]:
    """
    Parse OBJ file and extract triangles.
    Returns: (triangles, triangle_count)
    """
    try:
        # Convert bytes to string
        content_str = file_content.decode('utf-8')
        lines = content_str.strip().split('\n')
        
        vertices = []
        faces = []
        
        for line in lines:
            line = line.strip()
            if line.startswith('v '):  # Vertex
                parts = line.split()
                if len(parts) >= 4:
                    vertex = np.array([float(parts[1]), float(parts[2]), float(parts[3])])
                    vertices.append(vertex)
            elif line.startswith('f '):  # Face
                parts = line.split()[1:]  # Skip 'f'
                # Handle different face formats (v, v/vt, v/vt/vn)
                face_vertices = []
                for part in parts:
                    vertex_idx = int(part.split('/')[0]) - 1  # OBJ uses 1-based indexing
                    face_vertices.append(vertex_idx)
                faces.append(face_vertices)
        
        # Convert faces to triangles
        triangles = []
        for face in faces:
            if len(face) >= 3:
                # For faces with more than 3 vertices, triangulate
                for i in range(1, len(face) - 1):
                    triangle = np.array([
                        vertices[face[0]],
                        vertices[face[i]],
                        vertices[face[i + 1]]
                    ])
                    triangles.append(triangle)
        
        return triangles, len(triangles)
        
    except Exception as e:
        print(f"OBJ parsing error: {e}")
        return [], 0


def parse_obj_with_trimesh(file_content: bytes) -> Tuple[List[np.ndarray], int]:
    """
    Parse OBJ file using trimesh library.
    Returns: (triangles, triangle_count)
    """
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(suffix='.obj', delete=False) as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name
        
        try:
            # Load mesh using trimesh
            mesh = trimesh.load(temp_file_path)
            
            if hasattr(mesh, 'triangles'):
                triangles = [np.array(triangle) for triangle in mesh.triangles]
                return triangles, len(triangles)
            else:
                return [], 0
                
        finally:
            # Clean up temporary file
            os.unlink(temp_file_path)
            
    except Exception as e:
        print(f"Trimesh OBJ parsing error: {e}")
        return parse_obj_file(file_content)  # Fallback to manual parsing


def parse_step_file(file_content: bytes) -> Tuple[List[np.ndarray], int]:
    """
    Parse STEP file and extract triangles.
    Returns: (triangles, triangle_count)
    
    Note: STEP file parsing is complex and requires specialized libraries.
    This implementation provides a basic framework that can be extended.
    """
    try:
        if TRIMESH_AVAILABLE:
            return parse_step_with_trimesh(file_content)
        else:
            # Fallback: return estimated values based on file size
            file_size_kb = len(file_content) / 1024
            estimated_volume = file_size_kb * 10  # Very rough estimation
            estimated_triangles = int(file_size_kb / 2)
            
            print("STEP parsing: Using estimated values (install trimesh for better parsing)")
            return [], estimated_triangles
            
    except Exception as e:
        print(f"STEP parsing error: {e}")
        return [], 0


def parse_step_with_trimesh(file_content: bytes) -> Tuple[List[np.ndarray], int]:
    """
    Parse STEP file using trimesh library.
    Returns: (triangles, triangle_count)
    """
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(suffix='.step', delete=False) as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name
        
        try:
            # Load mesh using trimesh
            mesh = trimesh.load(temp_file_path)
            
            if hasattr(mesh, 'triangles'):
                triangles = [np.array(triangle) for triangle in mesh.triangles]
                return triangles, len(triangles)
            elif hasattr(mesh, 'vertices') and hasattr(mesh, 'faces'):
                # Convert faces to triangles
                triangles = []
                for face in mesh.faces:
                    if len(face) >= 3:
                        triangle = np.array([
                            mesh.vertices[face[0]],
                            mesh.vertices[face[1]],
                            mesh.vertices[face[2]]
                        ])
                        triangles.append(triangle)
                return triangles, len(triangles)
            else:
                return [], 0
                
        finally:
            # Clean up temporary file
            os.unlink(temp_file_path)
            
    except Exception as e:
        print(f"Trimesh STEP parsing error: {e}")
        return [], 0


def parse_file(file_content: bytes, filename: str) -> Tuple[float, int, str]:
    """
    Parse various 3D file formats and return volume, triangle count, and format.
    
    Args:
        file_content: File content as bytes
        filename: Original filename
    
    Returns:
        Tuple of (volume_mm3, triangle_count, file_format)
    """
    file_ext = get_file_extension(filename)
    
    try:
        if file_ext == 'stl':
            # Use original STL parsing logic
            if is_binary_stl(file_content):
                triangles, triangle_count = parse_stl_binary(file_content)
            else:
                content_str = file_content.decode('utf-8')
                triangles, triangle_count = parse_stl_ascii(content_str)
            
            volume_mm3 = calculate_mesh_volume(triangles)
            return volume_mm3, triangle_count, 'STL'
            
        elif file_ext == 'obj':
            # Parse OBJ file
            try:
                if TRIMESH_AVAILABLE:
                    triangles, triangle_count = parse_obj_with_trimesh(file_content)
                else:
                    triangles, triangle_count = parse_obj_file(file_content)
                
                volume_mm3 = calculate_mesh_volume(triangles) if triangles else 1000.0
                return volume_mm3, triangle_count, 'OBJ'
            except Exception as e:
                print(f"OBJ parsing failed, using estimate: {e}")
                # Fallback: estimate based on file size
                file_size_kb = len(file_content) / 1024
                estimated_volume = max(1000.0, file_size_kb * 20)  # 20 mm³ per KB
                estimated_triangles = max(100, int(file_size_kb * 5))
                return estimated_volume, estimated_triangles, 'OBJ'
            
        elif file_ext in ['step', 'stp']:
            # Parse STEP file
            try:
                triangles, triangle_count = parse_step_file(file_content)
                volume_mm3 = calculate_mesh_volume(triangles) if triangles else 1000.0
                return volume_mm3, triangle_count, 'STEP'
            except Exception as e:
                print(f"STEP parsing failed, using estimate: {e}")
                # Fallback: estimate based on file size
                file_size_kb = len(file_content) / 1024
                estimated_volume = max(1000.0, file_size_kb * 15)  # 15 mm³ per KB
                estimated_triangles = max(50, int(file_size_kb * 3))
                return estimated_volume, estimated_triangles, 'STEP'
            
        else:
            raise ValueError(f"Unsupported file format: {file_ext}")
            
    except Exception as e:
        print(f"File parsing error for {filename}: {e}")
        # Return default values
        return 1000.0, 0, file_ext.upper()


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