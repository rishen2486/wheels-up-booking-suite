import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";

type CarFormData = {
  carName: string;
  brand: string;
  seats: number;
  transmission: "manual" | "automatic";
  large_bags: number;
  small_bags: number;
  mileage: string;
  price_per_day: number;
  description: string;
  photos: FileList;
};

export default function AddCar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch } = useForm<CarFormData>();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const watchTransmission = watch("transmission", "automatic");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const removePreviewImage = (index: number) => {
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newPreviews);
  };

  const onSubmit = async (data: CarFormData) => {
    setLoading(true);

    try {
      // Upload images to Supabase Storage
      let photoUrls: string[] = [];

      if (data.photos && data.photos.length > 0) {
        for (let i = 0; i < data.photos.length; i++) {
          const file = data.photos[i];
          const filePath = `cars/${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("car-photos")
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: publicUrl } = supabase.storage
            .from("car-photos")
            .getPublicUrl(filePath);

          if (publicUrl?.publicUrl) {
            photoUrls.push(publicUrl.publicUrl);
          }
        }
      }

      // Insert car details into DB
      const { error } = await supabase.from("cars").insert([
        {
          name: data.carName,
          brand: data.brand,
          seats: data.seats,
          transmission: data.transmission,
          large_bags: data.large_bags,
          small_bags: data.small_bags,
          mileage: data.mileage,
          price_per_day: data.price_per_day,
          description: data.description,
          photos: photoUrls,
          available: true,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Car Added Successfully",
        description: "The new car has been added to your fleet.",
      });

      reset();
      setPreviewImages([]);
      navigate("/admin/cars");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to add car. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Car</h1>
            <p className="text-muted-foreground">Add a new vehicle to your rental fleet</p>
          </div>
        </div>

        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="text-xl">Car Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Car Name & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carName">Car Name *</Label>
                  <Input
                    id="carName"
                    {...register("carName", { required: true })}
                    placeholder="e.g. Tesla Model 3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    {...register("brand", { required: true })}
                    placeholder="e.g. Tesla"
                  />
                </div>
              </div>

              {/* Seats & Transmission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats">Number of Seats *</Label>
                  <Input
                    id="seats"
                    type="number"
                    {...register("seats", { required: true, valueAsNumber: true })}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-3">
                  <Label>Transmission *</Label>
                  <RadioGroup
                    value={watchTransmission}
                    onValueChange={(value) => setValue("transmission", value as "manual" | "automatic")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="automatic" id="automatic" />
                      <Label htmlFor="automatic">Automatic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual">Manual</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Bags & Mileage */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="large_bags">Large Bags</Label>
                  <Input
                    id="large_bags"
                    type="number"
                    {...register("large_bags", { valueAsNumber: true })}
                    placeholder="2"
                    defaultValue={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="small_bags">Small Bags</Label>
                  <Input
                    id="small_bags"
                    type="number"
                    {...register("small_bags", { valueAsNumber: true })}
                    placeholder="2"
                    defaultValue={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage *</Label>
                  <Input
                    id="mileage"
                    {...register("mileage", { required: true })}
                    placeholder="Unlimited or 200 km/day"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price_per_day">Price Per Day (USD) *</Label>
                <Input
                  id="price_per_day"
                  type="number"
                  step="0.01"
                  {...register("price_per_day", { required: true, valueAsNumber: true })}
                  placeholder="50.00"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter additional details like fuel type, GPS availability, insurance info, etc."
                  rows={4}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <Label>Car Photos</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <Label htmlFor="photos" className="cursor-pointer">
                    <span className="text-sm font-medium">Click to upload photos</span>
                    <Input
                      id="photos"
                      type="file"
                      accept="image/*"
                      multiple
                      {...register("photos")}
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP up to 10MB each
                  </p>
                </div>
                
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewImages.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={src} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePreviewImage(idx)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Adding Car..." : "Add Car"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}