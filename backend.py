from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import train_model, df, predict_congestion_risk
from traffic_data_generator import generate_traffic_data, simulate_signal_status

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

trained_model = train_model(df)

@app.get("/api/traffic")
def get_traffic():
    data = generate_traffic_data()
    risks = predict_congestion_risk(trained_model, data)
    for i, v in enumerate(data):
        v['congestion_risk'] = risks[i]
    return data

@app.get("/api/signals")
def get_signals():
    return simulate_signal_status()