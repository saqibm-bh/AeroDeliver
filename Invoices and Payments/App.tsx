import { useState } from 'react';
import { InvoiceList } from './components/InvoiceList';
import { PaymentMethods } from './components/PaymentMethods';
import { BillingSummary } from './components/BillingSummary';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { 
  FileText, 
  CreditCard, 
  Search, 
  Filter,
  Download,
  Calendar,
  Plane,
  TrendingUp
} from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for invoices
  const [invoices] = useState([
    {
      id: 'INV-001',
      orderId: 'DR-2024-08051',
      date: 'Aug 5, 2024',
      amount: 24.99,
      status: 'paid' as const,
      deliveryAddress: '123 Main Street, Downtown District',
      droneId: 'DRN-001',
      items: ['Electronics Package', 'Documents'],
      dueDate: 'Aug 10, 2024'
    },
    {
      id: 'INV-002',
      orderId: 'DR-2024-08052',
      date: 'Aug 4, 2024',
      amount: 18.50,
      status: 'pending' as const,
      deliveryAddress: '456 Oak Avenue, Suburbs',
      droneId: 'DRN-002',
      items: ['Medical Supplies'],
      dueDate: 'Aug 9, 2024'
    },
    {
      id: 'INV-003',
      orderId: 'DR-2024-08040',
      date: 'Aug 1, 2024',
      amount: 35.75,
      status: 'overdue' as const,
      deliveryAddress: '789 Pine Street, City Center',
      droneId: 'DRN-003',
      items: ['Food Package', 'Beverages'],
      dueDate: 'Aug 3, 2024'
    }
  ]);

  // Mock data for payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'card' as const,
      last4: '4242',
      brand: 'visa',
      expiryMonth: 12,
      expiryYear: 25,
      isDefault: true
    },
    {
      id: '2',
      type: 'paypal' as const,
      email: 'user@example.com',
      isDefault: false
    }
  ]);

  // Mock billing summary data
  const billingSummary = {
    totalSpent: 1247.89,
    monthlySpent: 156.24,
    pendingAmount: 18.50,
    totalDeliveries: 47,
    averageDeliveryTime: '22 min',
    onTimeDeliveryRate: 94,
    recentTransactions: [
      {
        id: '1',
        date: 'Aug 5, 2024',
        amount: 24.99,
        description: 'Drone Delivery - Electronics',
        status: 'completed' as const
      },
      {
        id: '2',
        date: 'Aug 4, 2024',
        amount: 18.50,
        description: 'Drone Delivery - Medical',
        status: 'pending' as const
      },
      {
        id: '3',
        date: 'Aug 3, 2024',
        amount: 12.75,
        description: 'Drone Delivery - Documents',
        status: 'completed' as const
      }
    ]
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewInvoice = (id: string) => {
    console.log('Viewing invoice:', id);
    // In a real app, this would open invoice details
  };

  const handleDownloadInvoice = (id: string) => {
    console.log('Downloading invoice:', id);
    // In a real app, this would trigger PDF download
  };

  const handleAddPaymentMethod = (method: any) => {
    const newMethod = {
      ...method,
      id: (paymentMethods.length + 1).toString()
    };
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Plane className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">Billing & Payments</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your drone delivery invoices and payment methods
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export All
            </Button>
            <Button className="gap-2">
              <Calendar className="w-4 h-4" />
              Billing History
            </Button>
          </div>
        </div>

        {/* Billing Summary */}
        <BillingSummary data={billingSummary} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="payment-methods" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Methods
            </TabsTrigger>
          </TabsList>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Invoice Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices or orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Invoice Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {invoices.filter(i => i.status === 'paid').length}
                    </p>
                    <p className="text-sm text-green-600">Paid Invoices</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">
                      {invoices.filter(i => i.status === 'pending').length}
                    </p>
                    <p className="text-sm text-yellow-600">Pending Payment</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {invoices.filter(i => i.status === 'overdue').length}
                    </p>
                    <p className="text-sm text-red-600">Overdue</p>
                  </div>
                </div>

                {/* Invoice List */}
                <InvoiceList
                  invoices={filteredInvoices}
                  onViewInvoice={handleViewInvoice}
                  onDownloadInvoice={handleDownloadInvoice}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Methods Tab */}
          <TabsContent value="payment-methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethods
                  paymentMethods={paymentMethods}
                  onAddPaymentMethod={handleAddPaymentMethod}
                  onSetDefault={handleSetDefault}
                  onDeletePaymentMethod={handleDeletePaymentMethod}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}