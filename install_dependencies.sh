#!/bin/bash

echo "Installing additional dependencies for 3D file format support..."

# Navigate to backend directory
cd backend

# Install the new requirements
pip install trimesh==4.0.5

echo "Dependencies installed successfully!"
echo "The backend now supports STL, OBJ, and STEP file formats."

# Optional: install additional dependencies for better STEP support (might require system dependencies)
echo ""
echo "For advanced STEP file support, you can optionally install:"
echo "pip install python-opencascade"
echo "Note: This might require additional system dependencies" 