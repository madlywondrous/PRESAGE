# PRESAGE
**Predictive Maintenance System for Industrial Equipment**
*An AI-driven predictive system that models machine behavior, uncovers hidden anomalies, and anticipates failures before they occur.*

## Research & Publication                                                   
This repository contains the implementation of the predictive maintenance models and architecture detailed in our peer-reviewed IEEE publication.

> **Machine Learning for Predictive Maintenance of Industrial Machines using IoT Sensor Data: A Case Study on Slitting Machines**<br>
> *Authors:* Ayush Mishra, Akshat Tewari, Aman Anand, Akash Garg, Nansi Jain<br>
> *Published in:* 2025 4th International Conference on Sensors and Related Networks (SENNET)

[![Read on IEEE Xplore](https://img.shields.io/badge/IEEE_Xplore-Read_Publication-00629B?style=for-the-badge&logo=ieee&logoColor=white)](https://ieeexplore.ieee.org/document/11135975)

## Getting Started
Follow these instructions to get a local copy of PRESAGE up and running.
### 1. Backend API (FastAPI)
Navigate to the backend directory, install the Python dependencies, and start the API server.
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
### 2. Frontend Dashboard (Next.js)
In a new terminal window, navigate to the frontend directory, install the Node dependencies via `pnpm`, and start the development server.
```bash
cd frontend
pnpm install
pnpm dev
```
Finally, visit [http://localhost:3000](http://localhost:3000) in your browser to view the PRESAGE dashboard.
