import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Navigation, Battery, Gauge, Clock, Zap } from 'lucide-react';

export function DroneTrackingMap() {
  const [dronePosition, setDronePosition] = useState({ x: 45, y: 60 });

  // Mock data for demonstration
  const deliveryData = {
    orderId: 'DR-2024-08051',
    status: 'IN_TRANSIT',
    estimatedArrival: '12:45 PM',
    timeRemaining: '8 minutes',
    customerAddress: '123 Main Street, Downtown',
    droneId: 'DRN-001',
    battery: 78,
    altitude: '150ft',
    speed: '25 mph',
    distance: '2.3 miles',
    packageWeight: '2.1 lbs'
  };

  const routePoints = [
    { x: 10, y: 20, label: 'Warehouse' },
    { x: 25, y: 35, label: '' },
    { x: 45, y: 60, label: 'Current' },
    { x: 65, y: 75, label: '' },
    { x: 85, y: 85, label: 'Destination' }
  ];

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border overflow-hidden">
      {/* Map Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="w-full h-full">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Route Path */}
      <svg className="absolute inset-0 w-full h-full">
        <path
          d={`M ${routePoints[0].x}% ${routePoints[0].y}% Q ${routePoints[1].x}% ${routePoints[1].y}% ${routePoints[2].x}% ${routePoints[2].y}% Q ${routePoints[3].x}% ${routePoints[3].y}% ${routePoints[4].x}% ${routePoints[4].y}%`}
          stroke="#3b82f6"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
          className="animate-pulse"
        />
      </svg>

      {/* Warehouse */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${routePoints[0].x}%`, top: `${routePoints[0].y}%` }}
      >
        <div className="bg-blue-500 p-2 rounded-lg shadow-lg">
          <div className="w-4 h-4 bg-white rounded"></div>
        </div>
        <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <Badge variant="secondary" className="text-xs">Warehouse</Badge>
        </div>
      </div>

      {/* Drone */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ left: `${dronePosition.x}%`, top: `${dronePosition.y}%` }}
      >
        <div className="relative">
          <div className="bg-green-500 p-3 rounded-full shadow-lg animate-pulse">
            <Navigation className="w-6 h-6 text-white rotate-45" />
          </div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <Badge className="text-xs bg-green-500">Live</Badge>
        </div>
      </div>

      {/* Destination */}
      <div 
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${routePoints[4].x}%`, top: `${routePoints[4].y}%` }}
      >
        <div className="bg-red-500 p-2 rounded-lg shadow-lg">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <Badge variant="destructive" className="text-xs">Destination</Badge>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button size="sm" variant="outline" className="bg-white/80 backdrop-blur">
          <MapPin className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" className="bg-white/80 backdrop-blur">
          <Zap className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}