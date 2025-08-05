import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { 
  Package, 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  Eye, 
  RefreshCw, 
  CheckCircle,
  XCircle,
  Plane,
  Battery,
  Navigation,
  Star,
  MessageCircle,
  Download,
  MoreHorizontal,
  ArrowRight,
  Zap,
  Shield,
  Calendar
} from "lucide-react";

export function MyDeliveries() {
  // Mock delivery data
  const activeDeliveries = [
    {
      id: "DRN-2025-001",
      status: "In Transit",
      statusColor: "blue",
      items: "Medical Emergency Kit",
      itemCount: 1,
      weight: "2.5 kg",
      origin: "Central Medical Hub",
      destination: "456 Oak Street, Apt 12B",
      estimatedTime: "8 minutes",
      droneId: "SKY-07",
      batteryLevel: 87,
      distance: "3.2 km",
      orderDate: "Jan 15, 2025",
      orderTime: "2:45 PM",
      priority: "High",
      deliveryFee: 15.99,
      progress: 65
    },
    {
      id: "DRN-2025-002", 
      status: "Preparing",
      statusColor: "yellow",
      items: "Electronics Package",
      itemCount: 3,
      weight: "1.8 kg",
      origin: "TechMart Warehouse",
      destination: "789 Pine Ave, Suite 5A",
      estimatedTime: "25 minutes",
      droneId: "SKY-12",
      batteryLevel: 92,
      distance: "5.7 km",
      orderDate: "Jan 15, 2025",
      orderTime: "3:20 PM",
      priority: "Standard",
      deliveryFee: 12.99,
      progress: 15
    },
    {
      id: "DRN-2025-003",
      status: "Dispatched",
      statusColor: "green", 
      items: "Grocery Essentials",
      itemCount: 8,
      weight: "4.2 kg",
      origin: "FreshMart Store",
      destination: "321 Elm Street, House 7",
      estimatedTime: "12 minutes",
      droneId: "SKY-03",
      batteryLevel: 78,
      distance: "2.1 km",
      orderDate: "Jan 15, 2025",
      orderTime: "4:10 PM",
      priority: "Standard",
      deliveryFee: 18.99,
      progress: 85
    }
  ];

  const completedDeliveries = [
    {
      id: "DRN-2025-004",
      status: "Delivered",
      statusColor: "green",
      items: "Document Package",
      itemCount: 1,
      weight: "0.3 kg",
      origin: "Legal Office Downtown",
      destination: "123 Main Street, Office 3B",
      deliveredTime: "14 minutes",
      droneId: "SKY-09",
      distance: "1.8 km",
      orderDate: "Jan 14, 2025",
      deliveredDate: "Jan 14, 2025",
      deliveredAt: "6:45 PM",
      priority: "Urgent",
      deliveryFee: 9.99,
      rating: 5,
      feedback: "Perfect delivery! Very fast and secure."
    },
    {
      id: "DRN-2025-005",
      status: "Delivered", 
      statusColor: "green",
      items: "Pharmacy Order",
      itemCount: 4,
      weight: "1.1 kg",
      origin: "Health+ Pharmacy",
      destination: "567 Cedar Road, Apt 8C",
      deliveredTime: "18 minutes",
      droneId: "SKY-15",
      distance: "4.3 km",
      orderDate: "Jan 13, 2025",
      deliveredDate: "Jan 13, 2025", 
      deliveredAt: "11:30 AM",
      priority: "High",
      deliveryFee: 14.99,
      rating: 4,
      feedback: "Great service, arrived on time."
    }
  ];

  const cancelledDeliveries = [
    {
      id: "DRN-2025-006",
      status: "Cancelled",
      statusColor: "red",
      items: "Birthday Gift Set",
      itemCount: 2,
      weight: "2.8 kg", 
      origin: "Gift Gallery",
      destination: "890 Birch Lane, House 15",
      cancelReason: "Weather conditions unsafe",
      droneId: "SKY-21",
      distance: "6.1 km",
      orderDate: "Jan 12, 2025",
      cancelledDate: "Jan 12, 2025",
      cancelledAt: "5:20 PM",
      priority: "Standard",
      deliveryFee: 16.99,
      refundAmount: 16.99,
      refundStatus: "Processed"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Transit":
        return <Plane className="w-4 h-4" />;
      case "Preparing":
        return <Package className="w-4 h-4" />;
      case "Dispatched":
        return <Navigation className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "red":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Standard":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <h1 className="text-3xl font-medium">My Deliveries</h1>
                <p className="text-white/80">Track and manage all your drone deliveries</p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-medium">{activeDeliveries.length}</div>
                  <div className="text-white/70">Active</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-medium">{completedDeliveries.length}</div>
                  <div className="text-white/70">Completed</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-medium">18m</div>
                  <div className="text-white/70">Avg. Time</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-medium">98%</div>
                  <div className="text-white/70">Success Rate</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Bar */}
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search deliveries by ID, item, or destination..." 
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Active ({activeDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed ({completedDeliveries.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Cancelled ({cancelledDeliveries.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Deliveries Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeDeliveries.map((delivery) => (
              <Card key={delivery.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          {getStatusIcon(delivery.status)}
                        </div>
                        <div>
                          <h3 className="font-medium">#{delivery.id}</h3>
                          <p className="text-sm text-muted-foreground">{delivery.items}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(delivery.priority)}>
                          {delivery.priority}
                        </Badge>
                        <Badge className={getStatusColor(delivery.statusColor)}>
                          {delivery.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Progress Bar for Active Deliveries */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Delivery Progress</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          ETA: {delivery.estimatedTime}
                        </span>
                      </div>
                      <Progress value={delivery.progress} className="h-2" />
                    </div>

                    {/* Delivery Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">From</p>
                        <p className="font-medium">{delivery.origin}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">To</p>
                        <p className="font-medium">{delivery.destination}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Drone</p>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{delivery.droneId}</span>
                          <div className="flex items-center gap-1">
                            <Battery className="w-3 h-3 text-green-500" />
                            <span className="text-green-600">{delivery.batteryLevel}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Details</p>
                        <p className="font-medium">{delivery.weight} • {delivery.distance}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Track Live
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        Contact Support
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <MoreHorizontal className="w-3 h-3" />
                        More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Completed Deliveries Tab */}
          <TabsContent value="completed" className="space-y-4">
            {completedDeliveries.map((delivery) => (
              <Card key={delivery.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">#{delivery.id}</h3>
                          <p className="text-sm text-muted-foreground">{delivery.items}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          Delivered
                        </Badge>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < delivery.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Summary */}
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Delivered successfully</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {delivery.deliveredAt} • {delivery.deliveredTime}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">From</p>
                        <p className="font-medium">{delivery.origin}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">To</p>
                        <p className="font-medium">{delivery.destination}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Drone</p>
                        <p className="font-medium">{delivery.droneId}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Details</p>
                        <p className="font-medium">{delivery.weight} • {delivery.distance}</p>
                      </div>
                    </div>

                    {/* Customer Feedback */}
                    {delivery.feedback && (
                      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3">
                        <p className="text-sm font-medium mb-1">Your Feedback</p>
                        <p className="text-sm text-muted-foreground">"{delivery.feedback}"</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Reorder
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        Receipt
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Cancelled Deliveries Tab */}
          <TabsContent value="cancelled" className="space-y-4">
            {cancelledDeliveries.map((delivery) => (
              <Card key={delivery.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                          <XCircle className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">#{delivery.id}</h3>
                          <p className="text-sm text-muted-foreground">{delivery.items}</p>
                        </div>
                      </div>
                      
                      <Badge className="bg-red-100 text-red-800">
                        Cancelled
                      </Badge>
                    </div>

                    {/* Cancellation Details */}
                    <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium">Cancelled: {delivery.cancelReason}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {delivery.cancelledAt}
                        </span>
                      </div>
                    </div>

                    {/* Refund Information */}
                    <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium">Refund ${delivery.refundAmount} - {delivery.refundStatus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground">From</p>
                        <p className="font-medium">{delivery.origin}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">To</p>
                        <p className="font-medium">{delivery.destination}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Ordered</p>
                        <p className="font-medium">{delivery.orderDate}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground">Details</p>
                        <p className="font-medium">{delivery.weight} • {delivery.distance}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Retry Order
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        Contact Support
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}