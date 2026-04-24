from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from ..ml_service import ml_service

router = APIRouter()

@router.get("/historical-data")
def get_historical_data(
    machine_id: Optional[int] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 100
):
    try:
        filtered_data = ml_service.data.copy()
        
        if machine_id is not None:
            filtered_data = filtered_data[filtered_data['machine_id'] == machine_id]
        
        if start_date and 'timestamp' in filtered_data.columns:
            filtered_data = filtered_data[filtered_data['timestamp'] >= start_date]
        if end_date and 'timestamp' in filtered_data.columns:
            filtered_data = filtered_data[filtered_data['timestamp'] <= end_date]
            
        return filtered_data.head(limit).to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feature-importance")
def get_feature_importance():
    try:
        importance = ml_service.reg_model.feature_importances_
        return {
            "features": ml_service.features,
            "importance": importance.tolist(),
            "chart_data": [{"feature": feature, "importance": float(imp)} for feature, imp in zip(ml_service.features, importance)]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/generate-random-values")
def generate_random_values(machine_id: Optional[int] = None):
    try:
        machine_id = machine_id or np.random.randint(1, 6)
        random_values = {
            "machine_id": machine_id,
            "sensor_1": float(np.random.uniform(ml_service.data['sensor_1'].min(), ml_service.data['sensor_1'].max())),
            "sensor_2": float(np.random.uniform(ml_service.data['sensor_2'].min(), ml_service.data['sensor_2'].max())),
            "sensor_3": float(np.random.uniform(ml_service.data['sensor_3'].min(), ml_service.data['sensor_3'].max())),
            "operational_hours": float(np.random.uniform(ml_service.data['operational_hours'].min(), ml_service.data['operational_hours'].max()))
        }
        return random_values
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/time-series-data")
def get_time_series_data(
    feature: str = "sensor_1",
    machine_id: Optional[int] = None,
    days: int = 30
):
    try:
        filtered_data = ml_service.data.copy()
        
        if machine_id is not None:
            filtered_data = filtered_data[filtered_data['machine_id'] == machine_id]
        
        if 'timestamp' in filtered_data.columns:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            filtered_data = filtered_data[filtered_data['timestamp'] >= start_date.strftime('%Y-%m-%d')]
        
        if len(filtered_data) > 100:
            filtered_data = filtered_data.sample(100)
            filtered_data = filtered_data.sort_values('timestamp')
        
        time_series = []
        for _, row in filtered_data.iterrows():
            if feature in row:
                time_series.append({
                    "timestamp": row.get('timestamp', ''),
                    "value": float(row[feature]),
                    "machine_id": int(row['machine_id'])
                })
        
        return time_series
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/anomaly-detection")
def get_anomaly_detection():
    try:
        sample_data = ml_service.data.sample(min(100, len(ml_service.data)))
        sample_features = sample_data[ml_service.features].values
        clusters = ml_service.kmeans.predict(sample_features)
        
        cluster_counts = np.bincount(clusters)
        anomaly_cluster = 0 if cluster_counts[0] < cluster_counts[1] else 1
        
        result = []
        for i, row in enumerate(sample_features):
            result.append({
                "x": float(row[0]),
                "y": float(row[1]),
                "is_anomaly": bool(clusters[i] == anomaly_cluster),
                "machine_id": int(sample_data.iloc[i]['machine_id'])
            })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard-summary")
def get_dashboard_summary():
    try:
        total_machines = len(ml_service.data['machine_id'].unique())
        machines_data = []
        machines_needing_maintenance = 0
        
        for machine_id in ml_service.data['machine_id'].unique():
            machine_data = ml_service.data[ml_service.data['machine_id'] == machine_id].iloc[-1]
            
            features_arr = [
                machine_data['sensor_1'],
                machine_data['sensor_2'],
                machine_data['sensor_3'],
                machine_data['operational_hours']
            ]
            
            input_df = pd.DataFrame([features_arr], columns=['sensor_1', 'sensor_2', 'sensor_3', 'operational_hours'])
            scaled_features = ml_service.scaler.transform(input_df)
            maint_pred = ml_service.clf_model.predict(scaled_features)
            
            if maint_pred[0] == 1:
                machines_needing_maintenance += 1
                
            machines_data.append({
                "machine_id": int(machine_id),
                "needs_maintenance": bool(maint_pred[0] == 1)
            })
        
        avg_rul = 0
        for machine in machines_data:
            machine_id = machine["machine_id"]
            machine_data = ml_service.data[ml_service.data['machine_id'] == machine_id].iloc[-1]
            
            features_arr = [
                machine_data['sensor_1'],
                machine_data['sensor_2'],
                machine_data['sensor_3'],
                machine_data['operational_hours']
            ]
            
            input_df = pd.DataFrame([features_arr], columns=['sensor_1', 'sensor_2', 'sensor_3', 'operational_hours'])
            scaled_features = ml_service.scaler.transform(input_df)
            rul_pred = ml_service.reg_model.predict(scaled_features)
            avg_rul += rul_pred[0]
        
        if machines_data:
            avg_rul /= len(machines_data)
        
        return {
            "total_machines": total_machines,
            "machines_needing_maintenance": machines_needing_maintenance,
            "machines_healthy": total_machines - machines_needing_maintenance,
            "average_rul": float(avg_rul),
            "maintenance_prediction_summary": {
                "healthy": total_machines - machines_needing_maintenance,
                "maintenance_needed": machines_needing_maintenance
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/threshold-alerts")
def get_threshold_alerts():
    try:
        thresholds = {
            "sensor_1": {"high": 0.8, "low": -0.8},
            "sensor_2": {"high": 0.9, "low": -0.9},
            "sensor_3": {"high": 0.7, "low": -0.7}
        }
        
        alerts = []
        
        for machine_id in ml_service.data['machine_id'].unique():
            machine_data = ml_service.data[ml_service.data['machine_id'] == machine_id].iloc[-1]
            
            for sensor in ['sensor_1', 'sensor_2', 'sensor_3']:
                value = machine_data[sensor]
                if value > thresholds[sensor]["high"]:
                    alerts.append({
                        "machine_id": int(machine_id),
                        "sensor": sensor,
                        "value": float(value),
                        "type": "high",
                        "threshold": thresholds[sensor]["high"],
                        "timestamp": machine_data.get('timestamp', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
                    })
                elif value < thresholds[sensor]["low"]:
                    alerts.append({
                        "machine_id": int(machine_id),
                        "sensor": sensor,
                        "value": float(value),
                        "type": "low",
                        "threshold": thresholds[sensor]["low"],
                        "timestamp": machine_data.get('timestamp', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
                    })
        
        return alerts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
