import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, MapPin, Package, User, Phone, MessageCircle, Navigation } from 'lucide-react';

interface DeliveryData {
  orderId: string;
  estimatedArrival: string;
  timeRemaining: string;
  customerAddress: string;
  packageWeight: string;
  droneId: string;
  distance: string;
}

interface DeliveryInfoProps {
  data: DeliveryData;
}

export function DeliveryInfo({ data }: DeliveryInfoProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Delivery Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Delivery Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Order ID</span>
            <Badge variant="outline">{data.orderId}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Drone ID</span>
            <span className="font-medium">{data.droneId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Package Weight</span>
            <span className="font-medium">{data.packageWeight}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Distance Remaining</span>
            <span className="font-medium">{data.distance}</span>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">Estimated Arrival</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-500">{data.estimatedArrival}</span>
              <Badge className="bg-green-500">{data.timeRemaining} remaining</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer & Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Delivery Address</span>
            </div>
            <p className="font-medium">{data.customerAddress}</p>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-muted-foreground mb-3">Customer Actions</p>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Navigation className="w-4 h-4 mr-2" />
                Share Live Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}