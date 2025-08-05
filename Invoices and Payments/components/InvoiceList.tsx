import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Package, 
  MapPin,
  Clock,
  DollarSign,
  Plane
} from 'lucide-react';

interface Invoice {
  id: string;
  orderId: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  deliveryAddress: string;
  droneId: string;
  items: string[];
  dueDate: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
  onViewInvoice: (id: string) => void;
  onDownloadInvoice: (id: string) => void;
}

export function InvoiceList({ invoices, onViewInvoice, onDownloadInvoice }: InvoiceListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'overdue': return 'Overdue';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Invoice Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Invoice #{invoice.id}</h3>
                    <p className="text-sm text-muted-foreground">Order {invoice.orderId}</p>
                  </div>
                  <Badge className={getStatusColor(invoice.status)}>
                    {getStatusText(invoice.status)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                    <span>{invoice.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Drone:</span>
                    <span>{invoice.droneId}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground">Delivered to:</span>
                    <p>{invoice.deliveryAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Items:</span>
                  <span>{invoice.items.join(', ')}</span>
                </div>
                
                {invoice.status !== 'paid' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Due:</span>
                    <span className={invoice.status === 'overdue' ? 'text-red-500 font-medium' : ''}>
                      {invoice.dueDate}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex flex-col gap-2 lg:w-32">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onViewInvoice(invoice.id)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDownloadInvoice(invoice.id)}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}