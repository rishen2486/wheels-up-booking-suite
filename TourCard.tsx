import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TourDetailsModal } from "./TourDetailsModal";

export default function TourCard({ tour }: { tour: any }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>{tour.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tour.photos?.[0] && (
            <img
              src={tour.photos[0]}
              alt={tour.name}
              className="w-full h-40 object-cover rounded"
            />
          )}
          <div className="flex justify-between text-sm">
            <span>{tour.duration} hrs</span>
            <span>{tour.location}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setDetailsOpen(true)} variant="outline" className="flex-1">
              Details
            </Button>
            <Button className="flex-1">Book</Button>
          </div>
        </CardContent>
      </Card>

      <TourDetailsModal tour={tour} isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </>
  );
}