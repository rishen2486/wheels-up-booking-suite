import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AttractionDetailsModal({ attraction, isOpen, onClose }: { attraction: any, isOpen: boolean, onClose: () => void }) {
  if (!attraction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{attraction.name}</DialogTitle>
        </DialogHeader>

        {/* Photos */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {attraction.photos?.map((url: string, idx: number) => (
            <img key={idx} src={url} alt={`${attraction.name}-${idx}`} className="w-full h-40 object-cover rounded" />
          ))}
        </div>

        {/* Attraction details */}
        <div className="space-y-2 text-sm">
          <p><strong>Description:</strong> {attraction.description}</p>
          <p><strong>Location:</strong> {attraction.location}</p>
          <p><strong>Category:</strong> {attraction.category}</p>
          <p><strong>Opening Hours:</strong> {attraction.openingHours}</p>
          <p><strong>Price:</strong> ${attraction.price}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}