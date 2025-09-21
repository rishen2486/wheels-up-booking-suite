import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function CarDetailsModal({ car, isOpen, onClose }: { car: any, isOpen: boolean, onClose: () => void }) {
  if (!car) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{car.name}</DialogTitle>
        </DialogHeader>

        {/* Photos */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {car.photos?.map((url: string, idx: number) => (
            <img key={idx} src={url} alt={`${car.name}-${idx}`} className="w-full h-40 object-cover rounded" />
          ))}
        </div>

        {/* Car details */}
        <div className="space-y-2 text-sm">
          <p><strong>Seats:</strong> {car.seats}</p>
          <p><strong>Gear:</strong> {car.gear}</p>
          <p><strong>Large Bags:</strong> {car.largeBags}</p>
          <p><strong>Small Bags:</strong> {car.smallBags}</p>
          <p><strong>Mileage:</strong> {car.mileage}</p>
          <p><strong>Pickup:</strong> {car.pickupLocation}</p>
          <p><strong>Drop-off:</strong> {car.dropoffLocation}</p>
          <p><strong>Price:</strong> ${car.price}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}