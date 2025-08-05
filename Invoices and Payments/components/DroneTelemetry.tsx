import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Battery, Gauge, Navigation, MapPin, Clock, Package } from 'lucide-react';

interface TelemetryData {
  battery: number;
  altitude: string;
  speed: string;
  distance: string;
  status: string;
}

interface DroneTelemetryProps {
  data: TelemetryData;
}

export function DroneTelemetry({ data }: DroneTelemetryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT': return 'bg-green-500';
      case 'LOADING': return 'bg-yellow-500';
      case 'DELIVERED': return 'bg-blue-500';
      case 'RETURNING': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_TRANSIT': return 'In Transit';
      case 'LOADING': return 'Loading';
      case 'DELIVERED': return 'Delivered';
      case 'RETURNING': return 'Returning';
      default: return 'Unknown';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return 'bg-green-500';
    if (battery > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(data.status)} animate-pulse`}></div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{getStatusText(data.status)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Battery */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Battery</p>
              <div className="flex items-center gap-2">
                <Progress value={data.battery} className="flex-1" />
                <span className="text-sm font-medium">{data.battery}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Altitude */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Altitude</p>
              <p className="font-medium">{data.altitude}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Speed */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Speed</p>
              <p className="font-medium">{data.speed}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}