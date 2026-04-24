from fastapi import APIRouter, HTTPException
import pandas as pd
from datetime import datetime, timedelta
from ..schemas import SensorData, AdvancedMachineData
from ..ml_service import ml_service

router = APIRouter()

@router.post("/predict")
def predict_maintenance(sensor_data: SensorData):
    try:
        features_arr = [
            sensor_data.sensor_1,
            sensor_data.sensor_2,
            sensor_data.sensor_3,
            sensor_data.operational_hours
        ]
        
        input_df = pd.DataFrame([features_arr], columns=['sensor_1', 'sensor_2', 'sensor_3', 'operational_hours'])
        scaled_features = ml_service.scaler.transform(input_df)
        
        rul_pred = ml_service.reg_model.predict(scaled_features)
        maint_pred = ml_service.clf_model.predict(scaled_features)
        cluster_pred = ml_service.kmeans.predict(scaled_features)

        urgency = "Low"
        if rul_pred[0] < 100:
            urgency = "High"
        elif rul_pred[0] < 200:
            urgency = "Medium"
        
        return {
            "machine_id": sensor_data.machine_id,
            "RUL_prediction": float(rul_pred[0]),
            "maintenance_prediction": "Needs Maintenance" if maint_pred[0] == 1 else "Normal",
            "anomaly_detection": "Anomaly" if cluster_pred[0] == 1 else "Normal",
            "urgency": urgency,
            "next_maintenance_date": (datetime.now() + timedelta(days=int(rul_pred[0] / 24))).strftime('%Y-%m-%d')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-advanced")
def predict_advanced(data: AdvancedMachineData):
    if ml_service.advanced_model is None:
        raise HTTPException(status_code=503, detail="Advanced model not loaded or available")
    
    try:
        if isinstance(ml_service.advanced_model, dict) and 'functions' in ml_service.advanced_model:
            predict_fn = ml_service.advanced_model['functions']['predict_maintenance_needs']
            result = predict_fn(
                data.air_temperature_k,
                data.process_temperature_k,
                int(data.rotational_speed_rpm),
                data.torque_nm,
                data.tool_wear_min,
                data.machine_type,
                models=ml_service.advanced_model['models'],
                encoders=ml_service.advanced_model['encoders'],
                mappings=ml_service.advanced_model['mappings']
            )
            return {
                "failure_type": result['prediction']['failure_type'],
                "days_until_maintenance": result['prediction']['days_until_maintenance_needed'],
                "severity": result['severity']['severity_description'],
                "estimated_repair_time": result['maintenance']['estimated_repair_time'],
                "estimated_repair_cost": result['maintenance']['estimated_repair_cost'],
                "parts_needed": result['maintenance']['parts_needed'],
                "maintenance_recommendations": result['recommendation']
            }
        else:
            machine_type_L = 1 if data.machine_type == 'L' else 0
            machine_type_M = 1 if data.machine_type == 'M' else 0
            machine_type_H = 1 if data.machine_type == 'H' else 0
            
            features = [
                data.air_temperature_k,
                data.process_temperature_k, 
                data.rotational_speed_rpm,
                data.torque_nm,
                data.tool_wear_min,
                machine_type_L,
                machine_type_M,
                machine_type_H
            ]
            
            input_df = pd.DataFrame([features], columns=[
                'Air temperature [K]', 
                'Process temperature [K]', 
                'Rotational speed [rpm]', 
                'Torque [Nm]', 
                'Tool wear [min]', 
                'Type_L', 
                'Type_M', 
                'Type_H'
            ])
            
            failure_type_code = ml_service.advanced_model.predict(input_df)[0]
            
            failure_types = {
                0: "No Failure",
                1: "Heat Dissipation Failure",
                2: "Power Failure",
                3: "Overstrain Failure",
                4: "Tool Wear Failure",
                5: "Random Failure"
            }
            
            failure_type = failure_types.get(failure_type_code, "Unknown Failure")
            
            severity_map = {
                0: "None",
                1: "Low",
                2: "Medium", 
                3: "High",
                4: "Critical",
                5: "Severe"
            }
            
            days_until_maintenance = 0 if failure_type_code == 0 else max(30 - int(data.tool_wear_min/3), 1)
            severity = severity_map.get(min(failure_type_code, 5))
            
            repair_time = 0
            repair_cost = 0
            parts_needed = []
            recommendations = "No maintenance needed."
            
            if failure_type_code > 0:
                repair_time = failure_type_code * 2.5
                repair_cost = failure_type_code * 500
                
                if failure_type_code == 1:
                    parts_needed = ["Heat sink", "Cooling fan"]
                    recommendations = "Clean heat sink and replace cooling fan."
                elif failure_type_code == 2:
                    parts_needed = ["Power supply", "Wiring harness"]
                    recommendations = "Replace power supply and check wiring."
                elif failure_type_code == 3:
                    parts_needed = ["Reinforcement bracket", "Support beam"]
                    recommendations = "Install reinforcement and reduce load."
                elif failure_type_code == 4:
                    parts_needed = ["Cutting tool", "Drill bits"]
                    recommendations = "Replace worn tools and calibrate."
                elif failure_type_code == 5:
                    parts_needed = ["Inspection required"]
                    recommendations = "Perform full diagnostic scan."
            
            return {
                "failure_type": failure_type,
                "days_until_maintenance": days_until_maintenance,
                "severity": severity,
                "estimated_repair_time": repair_time,
                "estimated_repair_cost": repair_cost,
                "parts_needed": parts_needed,
                "maintenance_recommendations": recommendations
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
