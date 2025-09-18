import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Extend global Window interface for PayPal
declare global {
  interface Window {
    paypal: any;
  }
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    id: string;
    carName: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    pickupLocation: string;
    dropoffLocation: string;
  };
  onPaymentSuccess: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  bookingDetails,
  onPaymentSuccess
}: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const paypalRef = useRef<HTMLDivElement>(null);

  // Load PayPal SDK dynamically when modal opens
  useEffect(() => {
    if (paymentMethod !== 'paypal' || !isOpen) return;

    // Only load script once
    if (document.getElementById('paypal-sdk')) return;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD`;
    script.id = 'paypal-sdk';
    script.async = true;
    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        window.paypal.Buttons({
          createOrder: (_data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: `Car rental booking for ${bookingDetails.carName}`,
                  amount: {
                    value: bookingDetails.totalAmount.toString(),
                    currency_code: 'USD',
                  },
                },
              ],
            });
          },
          onApprove: async (_data: any, actions: any) => {
            const order = await actions.order.capture();
            console.log('PayPal order:', order);

            // Update Supabase booking record
            const { error } = await supabase
              .from('bookings')
              .update({ payment_status: 'paid' })
              .eq('id', bookingDetails.id);

            if (error) {
              console.error('Supabase update failed:', error);
              toast({
                title: "Payment Successful but Update Failed",
                description: "Booking paid, but system didn't update DB. Please contact support.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "PayPal Payment Successful!",
                description: "Your booking has been confirmed via PayPal.",
              });
              onPaymentSuccess();
              onClose();
            }
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            toast({
              title: "Payment Failed",
              description: "PayPal could not process your payment.",
              variant: "destructive",
            });
          }
        }).render(paypalRef.current);
      }
    };

    document.body.appendChild(script);
  }, [paymentMethod, isOpen, bookingDetails, onPaymentSuccess, onClose, toast]);

  const handleCardPayment = async () => {
    setProcessing(true);
    try {
      // Simulate card processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update booking as paid
      await supabase.from('bookings').update({ payment_status: 'paid' }).eq('id', bookingDetails.id);

      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
      });
      onPaymentSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your card.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
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

          {/* Payment Method */}
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

          {/* Card Form */}
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
              <Button
                onClick={handleCardPayment}
                disabled={processing || !cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv}
                className="w-full"
              >
                {processing ? 'Processing...' : `Pay $${bookingDetails.totalAmount}`}
              </Button>
            </div>
          )}

          {/* PayPal Button */}
          {paymentMethod === 'paypal' && (
            <div ref={paypalRef} className="pt-4" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}