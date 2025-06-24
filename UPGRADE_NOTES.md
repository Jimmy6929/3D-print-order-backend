# 3D File Format Support Upgrade

This upgrade expands the webapp to support multiple 3D file formats beyond just STL files.

## Supported Formats

The webapp now supports:
- **STL** files (.stl) - Original format, fully supported
- **OBJ** files (.obj) - 3D object format, commonly used for 3D models
- **STEP** files (.step, .stp) - CAD format, widely used in engineering

## Changes Made

### Backend Changes
1. **New File Parser** (`backend/file_parser.py`)
   - Universal parser that handles STL, OBJ, and STEP files
   - Uses trimesh library for robust file parsing
   - Fallback parsing for when libraries aren't available
   - Maintains volume and triangle count calculations

2. **Updated Main API** (`backend/main.py`)
   - Modified upload endpoint to accept multiple file formats
   - Updated file validation logic
   - Changed storage bucket name from "stl-files" to "3d-files"
   - Added file format information to quote response

3. **Updated Requirements** (`backend/requirements.txt`)
   - Added trimesh library for 3D file processing

### Frontend Changes
1. **File Uploader** (`frontend/components/FileUploader.tsx`)
   - Updated file input to accept .stl, .obj, .step, .stp files
   - Modified validation messages and UI text
   - Changed visual elements from "STL" to "3D FILES"

2. **Quote Display** (`frontend/components/QuoteDisplay.tsx`)
   - Added file format display in calculation details
   - Updated file download link to show original filename
   - Generic "Download File" instead of "Download STL"

## Installation

1. Install the new dependencies:
   ```bash
   ./install_dependencies.sh
   ```
   
   Or manually:
   ```bash
   cd backend
   pip install trimesh==4.0.5
   ```

2. **Important**: Create Supabase storage buckets
   - Create three separate buckets:
     - `stl-files` (for .stl files)
     - `obj-files` (for .obj files)  
     - `step-files` (for .step/.stp files)
   - Set appropriate bucket permissions for each
   - Use the debug endpoint `/debug/buckets` to verify setup

## File Processing Details

### STL Files
- Uses original parsing logic
- Full volume and triangle count calculation
- Binary and ASCII STL support

### OBJ Files
- Parses vertices and faces from OBJ format
- Triangulates polygons automatically
- Supports basic OBJ file structure

### STEP Files
- Basic parsing using trimesh library
- May require additional system dependencies for complex STEP files
- Falls back to size-based estimation if parsing fails

## Testing

You can test the new formats by:
1. Starting the backend: `cd backend && python main.py`
2. Starting the frontend: `cd frontend && npm run dev`
3. Upload different file formats through the web interface

## Notes

- The volume calculation method remains the same for all formats
- STEP file parsing may be limited depending on file complexity
- Files are now stored in separate buckets based on type: "stl-files", "obj-files", "step-files"
- File format information is included in the quote response
- Original filename is preserved and displayed to users

## Backward Compatibility

- Existing STL file uploads will continue to work
- Existing database records remain unchanged
- API response format is extended (not breaking changes) 