from fastapi import APIRouter, HTTPException
from typing import Optional, List
from datetime import datetime, timedelta
import pandas as pd
from ..schemas import MachineDetailUpdate
from ..ml_service import ml_service
from ..mock_data import machine_details, maintenance_history, maintenance_schedules

router = APIRouter()

@router.get("/machine-list")
def get_machine_list():
    try:
        machines = []
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
            
            rul_pred = ml_service.reg_model.predict(scaled_features)
            maint_pred = ml_service.clf_model.predict(scaled_features)
            
            status = "Healthy" if maint_pred[0] == 0 else "Requires Maintenance"
            
            machines.append({
                "id": int(machine_id),
                "name": f"Machine {machine_id}",
                "status": status,
                "health": int(100 - (100 * (1 / max(1, rul_pred[0])))),
                "last_maintenance": (datetime.now() - timedelta(days=20)).strftime('%Y-%m-%d'),
                "operational_hours": float(machine_data['operational_hours'])
            })
            
        return machines
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/machine-details/{machine_id}")
def get_machine_details(machine_id: int):
    try:
        if machine_id not in machine_details:
            raise HTTPException(status_code=404, detail="Machine not found")
        
        details = machine_details[machine_id].copy()
        
        machine_data = ml_service.data[ml_service.data['machine_id'] == machine_id].iloc[-1]
        details["sensor_data"] = {
            "sensor_1": float(machine_data['sensor_1']),
            "sensor_2": float(machine_data['sensor_2']),
            "sensor_3": float(machine_data['sensor_3']),
            "operational_hours": float(machine_data['operational_hours'])
        }
        
        features_arr = [
            machine_data['sensor_1'],
            machine_data['sensor_2'],
            machine_data['sensor_3'],
            machine_data['operational_hours']
        ]
        
        input_df = pd.DataFrame([features_arr], columns=['sensor_1', 'sensor_2', 'sensor_3', 'operational_hours'])
        scaled_features = ml_service.scaler.transform(input_df)
        rul_pred = ml_service.reg_model.predict(scaled_features)
        maint_pred = ml_service.clf_model.predict(scaled_features)
        
        details["health_status"] = {
            "status": "Healthy" if maint_pred[0] == 0 else "Requires Maintenance",
            "rul": float(rul_pred[0]),
            "health_percentage": int(100 - (100 * (1 / max(1, rul_pred[0])))),
            "next_maintenance_date": (datetime.now() + timedelta(days=int(rul_pred[0] / 24))).strftime('%Y-%m-%d')
        }
        
        details["maintenance_history"] = [m for m in maintenance_history if m["machine_id"] == machine_id]
        
        upcoming = [s for s in maintenance_schedules if s["machine_id"] == machine_id and s["status"] != "Completed"]
        details["upcoming_maintenance"] = upcoming
        
        return details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/machine-details/{machine_id}")
def update_machine_details(machine_id: int, update_data: MachineDetailUpdate):
    try:
        if machine_id not in machine_details:
            raise HTTPException(status_code=404, detail="Machine not found")
        
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            if value is not None:
                machine_details[machine_id][key] = value
        
        return machine_details[machine_id]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/maintenance-history")
def get_maintenance_history(machine_id: Optional[int] = None):
    try:
        if machine_id is not None:
            return [m for m in maintenance_history if m["machine_id"] == machine_id]
        return maintenance_history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/maintenance-history")
def add_maintenance_record(
    machine_id: int,
    date: str,
    technician: str,
    description: str,
    parts_replaced: List[str] = [],
    cost: float = 0.0
):
    try:
        new_record = {
            "machine_id": machine_id,
            "date": date,
            "technician": technician,
            "description": description,
            "parts_replaced": parts_replaced,
            "cost": cost
        }
        maintenance_history.append(new_record)
        
        for schedule in maintenance_schedules:
            if schedule["machine_id"] == machine_id and schedule["date"] == date:
                schedule["status"] = "Completed"
                
        return new_record
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
