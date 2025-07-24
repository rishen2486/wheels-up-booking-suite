import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    carName: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    pickupLocation: string;
    dropoffLocation: string;
  };
  onPaymentSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, bookingDetails, onPaymentSuccess }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      if (paymentMethod === 'card') {
        // Simulate credit card processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed.",
        });
      } else if (paymentMethod === 'paypal') {
        // PayPal integration would go here
        await handlePayPalPayment();
      }
      
      onPaymentSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    // PayPal SDK integration template
    // This is a template that would need PayPal SDK implementation
    
    const paypalConfig = {
      env: 'sandbox', // 'sandbox' or 'production'
      client: {
        sandbox: 'YOUR_PAYPAL_CLIENT_ID_SANDBOX',
        production: 'YOUR_PAYPAL_CLIENT_ID_PRODUCTION'
      },
      style: {
        size: 'responsive',
        color: 'gold',
        shape: 'rect',
      }
    };

    // PayPal payment object
    const payment = {
      transactions: [{
        amount: {
          total: bookingDetails.totalAmount.toString(),
          currency: 'USD'
        },
        description: `Car rental booking for ${bookingDetails.carName}`,
        item_list: {
          items: [{
            name: bookingDetails.carName,
            description: `Car rental from ${bookingDetails.startDate} to ${bookingDetails.endDate}`,
            quantity: '1',
            price: bookingDetails.totalAmount.toString(),
            currency: 'USD'
          }]
        }
      }]
    };

    // Simulate PayPal payment for now
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "PayPal Payment Successful!",
      description: "Your booking has been confirmed via PayPal.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Booking Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Car:</span>
                <span className="font-medium">{bookingDetails.carName}</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup:</span>
                <span>{bookingDetails.pickupLocation}</span>
              </div>
              <div className="flex justify-between">
                <span>Drop-off:</span>
                <span>{bookingDetails.dropoffLocation}</span>
              </div>
              <div className="flex justify-between">
                <span>Dates:</span>
                <span>{bookingDetails.startDate} - {bookingDetails.endDate}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>${bookingDetails.totalAmount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                  <DollarSign className="w-4 h-4 mr-2" />
                  PayPal
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Credit Card Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PayPal Integration Note */}
          {paymentMethod === 'paypal' && (
            <Card>
              <CardContent className="pt-4">
                <CardDescription>
                  You will be redirected to PayPal to complete your payment securely.
                </CardDescription>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={processing || (paymentMethod === 'card' && (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv))}
              className="flex-1"
            >
              {processing ? 'Processing...' : `Pay $${bookingDetails.totalAmount}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}