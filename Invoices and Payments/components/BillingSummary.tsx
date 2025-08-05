import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Package,
  Clock,
  CheckCircle
} from 'lucide-react';

interface BillingSummaryData {
  totalSpent: number;
  monthlySpent: number;
  pendingAmount: number;
  totalDeliveries: number;
  averageDeliveryTime: string;
  onTimeDeliveryRate: number;
  recentTransactions: Array<{
    id: string;
    date: string;
    amount: number;
    description: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
}

interface BillingSummaryProps {
  data: BillingSummaryData;
}

export function BillingSummary({ data }: BillingSummaryProps) {
  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTransactionStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${data.totalSpent.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">${data.monthlySpent.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">${data.pendingAmount.toFixed(2)}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deliveries</p>
                <p className="text-2xl font-bold">{data.totalDeliveries}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Delivery Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">On-time Delivery Rate</span>
                <span className="font-medium">{data.onTimeDeliveryRate}%</span>
              </div>
              <Progress value={data.onTimeDeliveryRate} className="h-2" />
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Delivery Time</span>
              <span className="font-medium">{data.averageDeliveryTime}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${transaction.amount.toFixed(2)}</span>
                    <Badge 
                      className={`text-xs ${getTransactionStatusColor(transaction.status)}`}
                    >
                      {getTransactionStatusText(transaction.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}