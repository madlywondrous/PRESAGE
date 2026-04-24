from fastapi import APIRouter, HTTPException
from typing import Optional
from ..schemas import MaintenanceSchedule, AlertSettings
from ..mock_data import maintenance_schedules, alert_settings

router = APIRouter()

@router.get("/maintenance-schedules")
def get_maintenance_schedules(machine_id: Optional[int] = None):
    try:
        if machine_id is not None:
            return [s for s in maintenance_schedules if s['machine_id'] == machine_id]
        return maintenance_schedules
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/maintenance-schedules")
def create_maintenance_schedule(schedule: MaintenanceSchedule):
    try:
        new_schedule = schedule.dict()
        maintenance_schedules.append(new_schedule)
        return new_schedule
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alert-settings")
def get_alert_settings(machine_id: Optional[int] = None):
    try:
        if machine_id is not None:
            return [s for s in alert_settings if s["machine_id"] == machine_id]
        return alert_settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/alert-settings")
def create_alert_setting(setting: AlertSettings):
    try:
        new_setting = setting.dict()
        
        # Remove any existing setting for the same machine and sensor
        alert_settings[:] = [s for s in alert_settings 
                            if not (s["machine_id"] == new_setting["machine_id"] 
                                    and s["sensor"] == new_setting["sensor"])]
        
        alert_settings.append(new_setting)
        return new_setting
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
