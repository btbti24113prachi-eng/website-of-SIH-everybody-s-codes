from datetime import datetime
from typing import Tuple, List, Dict

SENSOR_LOCATIONS = {
    "sensor_A": (28.7041, 77.1025),
    "sensor_B": (28.7050, 77.1050),
    "sensor_C": (28.7060, 77.1000)
}

PAIRS = [
    ("sensor_A", "sensor_B"),
    ("sensor_B", "sensor_C"),
    ("sensor_C", "sensor_A")
]

SIGNALS = [
    {"id": "signal_1", "location": (28.7045, 77.1030), "name": "MG Road Junction"},
    {"id": "signal_2", "location": (28.7055, 77.1060), "name": "NH-48 Crossing"},
    {"id": "signal_3", "location": (28.7065, 77.1010), "name": "Market Square"},
]

def fetch_time_distance(origin: Tuple[float,float], destination: Tuple[float,float]) -> Tuple[float, float]:
    import random
    duration = random.randint(120, 600)
    distance = random.randint(800, 3000)
    return duration, distance

def compute_avg_speed_kmh(distance_m: float, duration_s: float) -> float:
    if duration_s == 0:
        return 0.0
    return (distance_m / duration_s) * 3.6

def simulate_vehicle_count() -> int:
    import random
    return random.randint(10, 50)

def generate_traffic_data():
    data = []
    for (sf, st) in PAIRS:
        o = SENSOR_LOCATIONS[sf]
        d = SENSOR_LOCATIONS[st]
        try:
            duration, distance = fetch_time_distance(o, d)
            avg_speed = compute_avg_speed_kmh(distance, duration)
        except Exception as e:
            duration, distance, avg_speed = 0, 0, 0
        vehicle_count = simulate_vehicle_count()
        record = {
            "from": sf,
            "to": st,
            "distance_m": distance,
            "duration_s": duration,
            "avg_speed_kmh": round(avg_speed, 2),
            "vehicle_count": vehicle_count,
            "timestamp": datetime.utcnow().isoformat()
        }
        data.append(record)
    return data

def simulate_signal_status() -> List[Dict]:
    import random
    statuses = []
    for signal in SIGNALS:
        state = random.choice(["green", "red", "yellow"])
        base_duration = {"green": 45, "red": 60, "yellow": 5}
        adaptive_duration = base_duration[state] + random.randint(-10, 20)
        statuses.append({
            "id": signal["id"],
            "name": signal["name"],
            "state": state,
            "duration_s": max(5, adaptive_duration),
            "last_updated": datetime.utcnow().isoformat()
        })
    return statuses