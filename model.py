import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor

data = {
    'vehicle_count': [10, 25, 40, 60, 80, 100],
    'avg_speed_kmh': [60, 45, 30, 25, 15, 10],
    'congestion_risk': [0, 0, 1, 1, 2, 2]
}
df = pd.DataFrame(data)

model = RandomForestRegressor(random_state=42)

def train_model(df):
    features = df[['vehicle_count', 'avg_speed_kmh']]
    labels = df['congestion_risk']
    model.fit(features, labels)
    return model

def predict_congestion_risk(trained_model, traffic_data):
    input_df = pd.DataFrame(traffic_data)
    predictions = trained_model.predict(input_df[['vehicle_count', 'avg_speed_kmh']])
    return [int(round(risk)) for risk in predictions]