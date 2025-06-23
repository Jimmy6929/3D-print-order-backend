# 3D Print Order System

A full-stack web application for managing 3D printing orders. Users can upload STL files, receive instant price estimates, and track their order status. Admins can manage orders through a dashboard.

## 🛠 Tech Stack

- **Backend**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL + Storage)
- **Frontend**: Next.js (React, TypeScript)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** (check with `python3 --version`)
- **Node.js 18+** (check with `node --version`)
- **npm or yarn** (check with `npm --version`)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd 3D-print-order-backend
```

### 2. Environment Setup

Create a `.env` file in the `backend/` directory with your Supabase credentials:

```bash
# backend/.env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🐍 Backend Setup (FastAPI)

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
# venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Backend Server

```bash
# Development server with auto-reload
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or simply:
uvicorn main:app --reload
```

The backend API will be available at:
- **API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Alternative Docs**: http://localhost:8000/redoc

## ⚛️ Frontend Setup (Next.js)

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the Frontend Server

```bash
# Development server
npm run dev
# or
yarn dev
```

The frontend will be available at:
- **Frontend**: http://localhost:3000

## 📁 Project Structure

```
3D-print-order-backend/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main FastAPI application
│   ├── supabase_client.py  # Supabase configuration
│   ├── stl_parser.py       # STL file parsing logic
│   ├── utils.py            # Utility functions
│   ├── schemas.py          # Pydantic schemas
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables (create this)
├── frontend/               # Next.js frontend
│   ├── pages/             # Next.js pages
│   │   ├── index.tsx      # Home page (file upload)
│   │   ├── dashboard.tsx  # Admin dashboard
│   │   └── order/[id].tsx # Order tracking page
│   ├── components/        # React components
│   ├── styles/           # CSS styles
│   ├── utils/            # Frontend utilities
│   └── package.json      # Node.js dependencies
└── README.md             # This file
```

## 🔧 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/upload` | Upload STL file and get price quote |
| POST | `/confirm-order` | Confirm and save order |
| GET | `/order/{id}` | Get order details by ID |
| PATCH | `/order/{id}` | Update order status |
| GET | `/orders` | Get all orders (admin) |
| GET | `/debug/files` | List storage files (debug) |

## 🌐 Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | File upload and price calculator |
| `/order/[id]` | Order status tracking |
| `/dashboard` | Admin dashboard for managing orders |

## 🧮 Quote Calculation

The system calculates prices using the formula:
```
total_price = (weight_g * £0.15) + (print_time_hr * £1.50) + £3.00 setup_fee
```

## 🔧 Development Commands

### Backend Commands

```bash
# Activate virtual environment
source backend/venv/bin/activate

# Install new dependencies
pip install package_name
pip freeze > requirements.txt

# Run with specific host/port
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests (if available)
pytest
```

### Frontend Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Install new dependencies
npm install package_name
```

## 🛠 Troubleshooting

### Common Issues

1. **"python: command not found"**
   - Use `python3` instead of `python`
   - Ensure Python 3.8+ is installed

2. **"Module not found" errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt`

3. **CORS errors**
   - Ensure backend is running on port 8000
   - Check CORS settings in `main.py`

4. **Database connection errors**
   - Verify Supabase credentials in `.env`
   - Check Supabase project status

### Port Configuration

- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000

Make sure these ports are not in use by other applications.

## 🎯 Features

### ✅ User Features
- Upload STL files
- Get instant price quotes
- Create and track orders
- View order status

### ✅ Admin Features
- View all orders
- Update order status
- Manage 3D printing queue

## 🚀 Future Enhancements

- User authentication with Supabase Auth
- Email notifications for order updates
- Enhanced STL parsing for accurate calculations
- Payment integration with Stripe
- Real-time order status updates

## 📝 Notes

- The application uses Supabase for both database and file storage
- STL files are uploaded to Supabase Storage bucket "stl-files"
- Default CORS allows requests from `http://localhost:3000`
- The system currently uses estimated values for weight and print time calculations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

For support or questions, please create an issue in the repository. 