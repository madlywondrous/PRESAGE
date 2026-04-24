# PRESAGE

**PRESAGE**: An AI-driven predictive system that models machine behavior, uncovers hidden anomalies, and anticipates failures before they occur.

---

## Research & Publication

This project was developed as a final year major project, and the underlying research has been published by IEEE:

> **Machine Learning for Predictive Maintenance of Industrial Machines using IoT Sensor Data: A Case Study on Slitting Machines**
> 
> *Authors: Ayush Mishra, Akshat Tewari, Aman Anand, Akash Garg, Nansi Jain*  
> *Published in: 2025 4th International Conference on Sensors and Related Networks (SENNET)*  
> 
> [**Read the Paper on IEEE Xplore**](https://ieeexplore.ieee.org/document/11135975)

### Key Research Highlights
- **Hybrid Architecture:** Combines ARIMA-based time series forecasting with supervised classification algorithms.
- **High Performance:** Achieved **89% accuracy** in predicting equipment failures up to **45 minutes in advance**.
- **Practical Application:** Specifically implemented and tested on packaging film slitting machines using tension, pressure, width, and diameter IoT sensor data.
- **Business Impact:** Demonstrated a 3.2:1 return on investment with significant reductions in unplanned downtime.

---

## Project Structure

- `/frontend` - Next.js React application (Dashboard UI)
- `/backend` - FastAPI Python application (API & Machine Learning Services)
- `/models` - Pre-trained hybrid models for anomaly detection and prediction

---

## Getting Started

### 1. Backend (FastAPI)
Navigate to the backend directory, install the Python dependencies, and start the API server:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend (Next.js)
Navigate to the frontend directory, install the Node dependencies, and start the development server:
```bash
cd frontend
pnpm install
pnpm dev
```

Visit `http://localhost:3000` to view the PRESAGE dashboard.
