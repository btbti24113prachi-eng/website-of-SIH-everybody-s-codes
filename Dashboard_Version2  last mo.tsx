import { useState, useEffect } from 'react';
import { MobileNavigation } from './components/MobileNavigation';
import { TrafficMap } from './components/TrafficMap';
import { QuickAccessCards } from './components/QuickAccessCards';
import { RouteOptimization } from './components/RouteOptimization';
import { TrafficSignals } from './components/TrafficSignals';
import { ParkingManagement } from './components/ParkingManagement';
import { AccidentDetection } from './components/AccidentDetection';
import { Analytics } from './components/Analytics';
import { Toaster } from './components/ui/sonner';

type TrafficStats = {
  from: string;
  to: string;
  distance_m: number;
  duration_s: number;
  avg_speed_kmh: number;
  vehicle_count: number;
  congestion_risk: number;
  timestamp: string;
};

export default function Dashboard() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [trafficData, setTrafficData] = useState<TrafficStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTraffic = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/traffic');
        if (!res.ok) throw new Error('Failed to fetch traffic data');
        const json = await res.json();
        if (isMounted) {
          setTrafficData(json);
          setLoading(false);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e.message);
          setLoading(false);
        }
      }
    };
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getOverallCongestion = () => {
    if (trafficData.length === 0) return 'N/A';
    const avgRisk = trafficData.reduce((sum, d) => sum + d.congestion_risk, 0) / trafficData.length;
    if (avgRisk < 0.5) return 'Low';
    if (avgRisk < 1.5) return 'Medium';
    return 'High';
  };

  const getTotalIncidents = () => {
    return trafficData.filter((d) => d.congestion_risk === 2).length;
  };

  const getAvgSpeed = () => {
    if (trafficData.length === 0) return 'N/A';
    const avg = trafficData.reduce((sum, d) => sum + d.avg_speed_kmh, 0) / trafficData.length;
    return avg.toFixed(1) + ' kmph';
  };

  const getSignalsStat = () => {
    return '156/158';
  };

  const recentAlerts = [
    { color: 'bg-red-400', text: 'Multi-vehicle accident on MG Road' },
    { color: 'bg-amber-400', text: 'Construction delays on NH-48' },
    { color: 'bg-blue-400', text: 'Weather advisory: Light rain' },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-4">
            <div className="h-64 sm:h-80">
              <TrafficMap trafficData={trafficData} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-400">Congestion</div>
                <div className="text-amber-400 font-medium">{loading ? '...' : getOverallCongestion()}</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-400">Incidents</div>
                <div className="text-red-400 font-medium">{loading ? '...' : getTotalIncidents() + ' Active'}</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-400">Avg Speed</div>
                <div className="text-green-400 font-medium">{loading ? '...' : getAvgSpeed()}</div>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-400">Signals</div>
                <div className="text-green-400 font-medium">{getSignalsStat()}</div>
              </div>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-sm text-gray-300 mb-3">Recent Alerts</h3>
              <div className="space-y-2">
                {recentAlerts.map((alert, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 ${alert.color} rounded-full`}></div>
                    <span className="text-gray-300">{alert.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <QuickAccessCards onViewChange={setCurrentView} />
            {error && (
              <div className="text-red-400 mt-2">Error fetching traffic data: {error}</div>
            )}
          </div>
        );
      case 'routes':
        return <RouteOptimization />;
      case 'signals':
        return <TrafficSignals />;
      case 'parking':
        return <ParkingManagement />;
      case 'incidents':
        return <AccidentDetection />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">View not implemented yet</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="sticky top-0 z-40 bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg text-white font-medium">
              {currentView === 'dashboard' && 'Traffic Dashboard'}
              {currentView === 'routes' && 'Routes'}
              {currentView === 'signals' && 'Signals'}
              {currentView === 'parking' && 'Parking'}
              {currentView === 'incidents' && 'Incidents'}
              {currentView === 'analytics' && 'Analytics'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>
      </header>
      <main className="px-4 py-4 pb-20 overflow-auto">
        {renderContent()}
      </main>
      <MobileNavigation currentView={currentView} onViewChange={setCurrentView} />
      <Toaster />
    </div>
  );
}