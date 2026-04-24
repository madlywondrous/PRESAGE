from pydantic import BaseModel
from typing import Dict, Any, Optional

class SensorData(BaseModel):
    sensor_1: float
    sensor_2: float
    sensor_3: float
    operational_hours: float
    machine_id: Optional[int] = 1

class AdvancedMachineData(BaseModel):
    air_temperature_k: float
    process_temperature_k: float
    rotational_speed_rpm: float
    torque_nm: float
    tool_wear_min: int
    machine_type: str  # L/M/H

class DateRangeParams(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class MaintenanceSchedule(BaseModel):
    machine_id: int
    date: str
    description: str
    status: str = "Pending"

class MachineDetailUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None

class AlertSettings(BaseModel):
    machine_id: int
    sensor: str
    high_threshold: float
    low_threshold: float

class UserSettings(BaseModel):
    username: str
    email: Optional[str] = None
    notification_preferences: Dict[str, bool]
    dashboard_preferences: Dict[str, Any]
