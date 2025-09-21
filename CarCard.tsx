import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarDetailsModal } from "./CarDetailsModal";

export default function CarCard({ car }: { car: any }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>  
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{car.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {car.photos?.[0] && (
            <img
              src={car.photos[0]}
              alt={car.name}
              className="w-full h-40 object-cover rounded"
            />
          )}
          <div className="flex justify-between text-sm">
            <span>{car.seats} Seats</span>
            <span>{car.gear}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setDetailsOpen(true)} variant="outline" className="flex-1">
              Details
            </Button>
            <Button className="flex-1">Book</Button>
          </div>
        </CardContent>
      </Card>

      <CarDetailsModal car={car} isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </>
  );
}