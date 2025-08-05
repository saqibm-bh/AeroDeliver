import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Smartphone,
  Wallet,
  Shield
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  email?: string;
}

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  onSetDefault: (id: string) => void;
  onDeletePaymentMethod: (id: string) => void;
}

export function PaymentMethods({ 
  paymentMethods, 
  onAddPaymentMethod, 
  onSetDefault, 
  onDeletePaymentMethod 
}: PaymentMethodsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    name: ''
  });

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="w-5 h-5" />;
      case 'paypal': return <Wallet className="w-5 h-5" />;
      case 'apple_pay': return <Smartphone className="w-5 h-5" />;
      case 'google_pay': return <Smartphone className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentLabel = (method: PaymentMethod) => {
    switch (method.type) {
      case 'card': 
        return `${method.brand?.toUpperCase()} •••• ${method.last4}`;
      case 'paypal': 
        return `PayPal ${method.email}`;
      case 'apple_pay': 
        return 'Apple Pay';
      case 'google_pay': 
        return 'Google Pay';
      default: 
        return 'Unknown payment method';
    }
  };

  const handleAddCard = () => {
    if (newCard.cardNumber && newCard.expiryMonth && newCard.expiryYear && newCard.cvv) {
      const last4 = newCard.cardNumber.slice(-4);
      const brand = newCard.cardNumber.startsWith('4') ? 'visa' : 'mastercard'; // Simplified detection
      
      onAddPaymentMethod({
        type: 'card',
        last4,
        brand,
        expiryMonth: parseInt(newCard.expiryMonth),
        expiryYear: parseInt(newCard.expiryYear),
        isDefault: paymentMethods.length === 0
      });
      
      setNewCard({ cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', name: '' });
      setIsAddDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Payment Method Button */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Add New Card
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                maxLength={19}
              />
            </div>
            
            <div>
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="expiryMonth">Month</Label>
                <Input
                  id="expiryMonth"
                  placeholder="MM"
                  value={newCard.expiryMonth}
                  onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value })}
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="expiryYear">Year</Label>
                <Input
                  id="expiryYear"
                  placeholder="YY"
                  value={newCard.expiryYear}
                  onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value })}
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={newCard.cvv}
                  onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                  maxLength={4}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddCard} className="flex-1">
                Add Card
              </Button>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Methods List */}
      {paymentMethods.map((method) => (
        <Card key={method.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  {getPaymentIcon(method.type)}
                </div>
                <div>
                  <p className="font-medium">{getPaymentLabel(method)}</p>
                  {method.type === 'card' && (
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                    </p>
                  )}
                </div>
                {method.isDefault && (
                  <Badge className="bg-blue-500">
                    <Star className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSetDefault(method.id)}
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeletePaymentMethod(method.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {paymentMethods.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No payment methods</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a payment method to get started with drone deliveries.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}