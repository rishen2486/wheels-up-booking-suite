import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import { CheckCircle } from 'lucide-react';

const BookingConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Thank you for your booking! Your reservation <strong>#{id}</strong> has been successfully confirmed.
              </p>
              <p className="text-sm text-muted-foreground">
                You will receive a confirmation email with all the details shortly. 
                Your car will be blocked in our system and ready for pickup on your selected date.
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <Button asChild className="w-full">
                  <Link to="/">Return to Home</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/cars">Browse More Cars</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;