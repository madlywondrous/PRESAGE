# Mock maintenance schedules
maintenance_schedules = [
    {"machine_id": 1, "date": "2025-04-05", "description": "Regular maintenance", "status": "Pending"},
    {"machine_id": 2, "date": "2025-04-10", "description": "Parts replacement", "status": "Scheduled"},
    {"machine_id": 3, "date": "2025-04-03", "description": "Emergency repair", "status": "Completed"},
]

# Mock machine details
machine_details = {
    1: {"name": "Machine 1", "location": "Factory Floor A", "type": "Drill Press", "notes": "Installed 2023", "manufacturer": "Industrial Corp"},
    2: {"name": "Machine 2", "location": "Assembly Line B", "type": "Conveyor", "notes": "Upgraded 2024", "manufacturer": "Automation Systems"},
    3: {"name": "Machine 3", "location": "Packaging Area", "type": "Robotic Arm", "notes": "New installation", "manufacturer": "RoboCorp"},
    4: {"name": "Machine 4", "location": "Warehouse", "type": "Forklift", "notes": "Battery issues", "manufacturer": "Heavy Lifters"},
    5: {"name": "Machine 5", "location": "Quality Control", "type": "Scanner", "notes": "Calibration needed", "manufacturer": "Precision Tools"}
}

# Mock alert settings
alert_settings = [
    {"machine_id": 1, "sensor": "sensor_1", "high_threshold": 0.8, "low_threshold": -0.8},
    {"machine_id": 1, "sensor": "sensor_2", "high_threshold": 0.9, "low_threshold": -0.9},
    {"machine_id": 2, "sensor": "sensor_1", "high_threshold": 0.85, "low_threshold": -0.85}
]

# Mock maintenance history
maintenance_history = [
    {"machine_id": 1, "date": "2025-01-15", "technician": "John Smith", "description": "Regular maintenance", "parts_replaced": ["Filter", "Gasket"], "cost": 250.00},
    {"machine_id": 1, "date": "2024-10-23", "technician": "Sarah Jones", "description": "Emergency repair", "parts_replaced": ["Motor", "Belt"], "cost": 1200.00},
    {"machine_id": 2, "date": "2025-02-10", "technician": "John Smith", "description": "Routine inspection", "parts_replaced": [], "cost": 150.00},
    {"machine_id": 3, "date": "2025-01-05", "technician": "Mike Wilson", "description": "Software update", "parts_replaced": [], "cost": 0.00}
]
