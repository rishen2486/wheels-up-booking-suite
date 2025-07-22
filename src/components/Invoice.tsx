import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Printer } from 'lucide-react';

interface InvoiceProps {
  booking: {
    id: string;
    car_name: string;
    start_date: string;
    end_date: string;
    total_amount: number;
    pickup_location: string;
    customer_name: string;
    customer_email: string;
  };
}

export default function Invoice({ booking }: InvoiceProps) {
  const days = Math.ceil(
    (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  const dailyRate = booking.total_amount / days;
  const tax = booking.total_amount * 0.1; // 10% tax
  const subtotal = booking.total_amount - tax;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF download would be implemented here');
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-primary">INVOICE</CardTitle>
            <p className="text-muted-foreground">#{booking.id.slice(-8).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-lg">CarsRus</h3>
            <p className="text-sm text-muted-foreground">
              Online Car Rental Platform<br/>
              www.carsrus.com<br/>
              support@carsrus.com
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Customer Details */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-2">Bill To:</h4>
            <p className="text-sm">
              {booking.customer_name}<br/>
              {booking.customer_email}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Rental Details:</h4>
            <p className="text-sm">
              <strong>Booking Date:</strong> {new Date().toLocaleDateString()}<br/>
              <strong>Pickup:</strong> {new Date(booking.start_date).toLocaleDateString()}<br/>
              <strong>Return:</strong> {new Date(booking.end_date).toLocaleDateString()}<br/>
              <strong>Location:</strong> {booking.pickup_location}
            </p>
          </div>
        </div>

        <Separator />

        {/* Invoice Items */}
        <div>
          <h4 className="font-semibold mb-4">Service Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{booking.car_name} Rental</span>
              <span>${dailyRate.toFixed(2)}/day</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Duration: {days} day(s)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount:</span>
            <span className="text-primary">${booking.total_amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-6 border-t">
          <p>Thank you for choosing CarsRus online car rental platform!</p>
          <p>For support, visit our website or contact us at support@carsrus.com</p>
        </div>
      </CardContent>
    </Card>
  );
}