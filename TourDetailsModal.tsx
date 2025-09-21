import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function TourDetailsModal({ tour, isOpen, onClose }: { tour: any, isOpen: boolean, onClose: () => void }) {
  if (!tour) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{tour.name}</DialogTitle>
        </DialogHeader>

        {/* Photos */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {tour.photos?.map((url: string, idx: number) => (
            <img key={idx} src={url} alt={`${tour.name}-${idx}`} className="w-full h-40 object-cover rounded" />
          ))}
        </div>

        {/* Tour details */}
        <div className="space-y-2 text-sm">
          <p><strong>Description:</strong> {tour.description}</p>
          <p><strong>Duration:</strong> {tour.duration} hrs</p>
          <p><strong>Location:</strong> {tour.location}</p>
          <p><strong>Price:</strong> ${tour.price}</p>
          <p><strong>Includes:</strong> {tour.includes}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}