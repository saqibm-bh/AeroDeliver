import { useState, useEffect } from 'react';
import { DroneTrackingMap } from './components/DroneTrackingMap';
import { DroneTelemetry } from './components/DroneTelemetry';
import { DeliveryInfo } from './components/DeliveryInfo';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Alert, AlertDescription } from './components/ui/alert';
import { Separator } from './components/ui/separator';
import { 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  MapPin, 
  Clock,
  Plane,
  Activity
} from 'lucide-react';

export default function App() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  // Mock real-time data - in a real app this would come from WebSocket or API
  const [deliveryData] = useState({
    orderId: 'DR-2024-08051',
    status: 'IN_TRANSIT',
    estimatedArrival: '12:45 PM',
    timeRemaining: '8 minutes',
    customerAddress: '123 Main Street, Downtown District, City Center',
    droneId: 'DRN-001',
    packageWeight: '2.1 lbs',
    distance: '2.3 miles'
  });

  const [telemetryData] = useState({
    battery: 78,
    altitude: '150ft',
    speed: '25 mph',
    distance: '2.3 miles',
    status: 'IN_TRANSIT'
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    // In a real app, this would trigger a data refresh
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Plane className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Live Drone Tracking</h1>
            </div>
            <p className="text-muted-foreground">
              Real-time monitoring of delivery drone {deliveryData.droneId}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span>Last updated: {formatTime(lastUpdate)}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Live Status Alert */}
        {isLive && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Live tracking active</strong> - Drone location updates every 3 seconds
            </AlertDescription>
          </Alert>
        )}

        {/* Telemetry Cards */}
        <DroneTelemetry data={telemetryData} />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Live Map Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DroneTrackingMap />
                
                {/* Map Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Warehouse</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Drone (Live)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Destination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-blue-500 border-dashed"></div>
                    <span>Flight Path</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Timeline */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Delivery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Order Confirmed</p>
                      <p className="text-sm text-muted-foreground">11:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Package Loaded</p>
                      <p className="text-sm text-muted-foreground">11:45 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-medium">In Transit</p>
                      <p className="text-sm text-muted-foreground">12:00 PM - Now</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="font-medium text-muted-foreground">Delivery</p>
                      <p className="text-sm text-muted-foreground">Est. 12:45 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="font-medium text-muted-foreground">Return to Base</p>
                      <p className="text-sm text-muted-foreground">Est. 1:15 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Delivery Information */}
        <DeliveryInfo data={deliveryData} />
      </div>
    </div>
  );
}