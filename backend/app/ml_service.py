import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime, timedelta
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
DATA_PATH = os.path.join(BASE_DIR, 'data', 'machinery_data.csv')

class MLService:
    def __init__(self):
        self.data = pd.read_csv(DATA_PATH)
        self.data.ffill(inplace=True)
        
        # Add timestamp column if not exists
        if 'timestamp' not in self.data.columns:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=30)
            timestamps = pd.date_range(start=start_date, end=end_date, periods=len(self.data))
            self.data['timestamp'] = timestamps.strftime('%Y-%m-%d %H:%M:%S')

        # Add machine_id if not exists
        if 'machine_id' not in self.data.columns:
            self.data['machine_id'] = np.random.randint(1, 6, size=len(self.data))

        self.features = ['sensor_1', 'sensor_2', 'sensor_3', 'operational_hours']
        self.target_rul = 'RUL'
        self.target_maintenance = 'maintenance'
        self.scaler = StandardScaler()
        self.data[self.features] = self.scaler.fit_transform(self.data[self.features])
        
        self.load_or_train_models()
        self.load_advanced_model()

    def train_and_save_models(self):
        X_train_reg, X_test_reg, y_train_reg, y_test_reg = train_test_split(
            self.data[self.features], self.data[self.target_rul], test_size=0.2, random_state=42)
        X_train_clf, X_test_clf, y_train_clf, y_test_clf = train_test_split(
            self.data[self.features], self.data[self.target_maintenance], test_size=0.2, random_state=42)
        
        self.reg_model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.reg_model.fit(X_train_reg, y_train_reg)
        
        self.clf_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.clf_model.fit(X_train_clf, y_train_clf)
        
        self.kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
        self.kmeans.fit(self.data[self.features])
        
        os.makedirs(MODELS_DIR, exist_ok=True)
        joblib.dump(self.reg_model, os.path.join(MODELS_DIR, 'rul_model.pkl'))
        joblib.dump(self.clf_model, os.path.join(MODELS_DIR, 'maintenance_model.pkl'))
        joblib.dump(self.kmeans, os.path.join(MODELS_DIR, 'anomaly_model.pkl'))
        joblib.dump(self.scaler, os.path.join(MODELS_DIR, 'scaler.pkl'))

    def load_or_train_models(self):
        try:
            self.reg_model = joblib.load(os.path.join(MODELS_DIR, 'rul_model.pkl'))
            self.clf_model = joblib.load(os.path.join(MODELS_DIR, 'maintenance_model.pkl'))
            self.kmeans = joblib.load(os.path.join(MODELS_DIR, 'anomaly_model.pkl'))
            self.scaler = joblib.load(os.path.join(MODELS_DIR, 'scaler.pkl'))
        except Exception:
            self.train_and_save_models()

    def load_advanced_model(self):
        advanced_model_path = os.path.join(MODELS_DIR, 'predictive_maintenance_system.joblib')
        try:
            self.advanced_model = joblib.load(advanced_model_path)
            print("Advanced model loaded successfully")
        except Exception as e:
            print(f"Error loading advanced model: {e}")
            self.advanced_model = None

ml_service = MLService()
