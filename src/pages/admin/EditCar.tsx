import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Navbar from "@/components/layout/Navbar";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

type CarFormData = {
  name: string;
  brand: string;
  seats: number;
  transmission: "manual" | "automatic";
  large_bags: number;
  small_bags: number;
  mileage: string;
  price_per_day: number;
  description: string;
  available: boolean;
};

export default function EditCar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, reset } = useForm<CarFormData>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<FileList | null>(null);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [removingPhoto, setRemovingPhoto] = useState<string | null>(null);

  const watchTransmission = watch("transmission", "automatic");

  useEffect(() => {
    if (id) fetchCar(id);
  }, [id]);

  const fetchCar = async (carId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .single();

      if (error) throw error;

      if (data) {
        reset({
          name: data.name,
          brand: data.brand || "",
          seats: data.seats || 5,
          transmission: (data.transmission as "manual" | "automatic") || "automatic",
          large_bags: data.large_bags || 0,
          small_bags: data.small_bags || 0,
          mileage: data.mileage || "",
          price_per_day: data.price_per_day,
          description: data.description || "",
          available: data.available ?? true,
        });
        setExistingPhotos(data.photos || []);
      }
    } catch (error: any) {
      console.error("Error loading car:", error.message);
      toast({
        title: "Error",
        description: "Failed to load car details. Please try again.",
        variant: "destructive",
      });
      navigate("/admin/cars");
    } finally {
      setLoading(false);
    }
  };

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(e.target.files);
      const previews = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setNewPreviews(previews);
    }
  };

  const removeNewPreview = (index: number) => {
    const updatedPreviews = newPreviews.filter((_, i) => i !== index);
    setNewPreviews(updatedPreviews);
    // Reset file input
    setNewFiles(null);
  };

  const uploadNewPhotos = async () => {
    if (!newFiles) return [];
    
    const uploadedUrls: string[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const filePath = `cars/${Date.now()}_${file.name}`;

      const { error } = await supabase.storage
        .from("car-photos")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error.message);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from("car-photos")
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    return uploadedUrls;
  };

  const handleRemovePhoto = async (photoUrl: string) => {
    setRemovingPhoto(photoUrl);

    try {
      // Extract file path from public URL
      const url = new URL(photoUrl);
      const pathSegments = url.pathname.split("/");
      const fileName = pathSegments[pathSegments.length - 1];
      const filePath = `cars/${fileName}`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("car-photos")
        .remove([filePath]);

      if (storageError) {
        console.error("Storage delete error:", storageError.message);
        toast({
          title: "Error",
          description: "Failed to delete photo from storage.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      const updatedPhotos = existingPhotos.filter((url) => url !== photoUrl);
      setExistingPhotos(updatedPhotos);

      // Update database
      const { error: dbError } = await supabase
        .from("cars")
        .update({ photos: updatedPhotos })
        .eq("id", id);

      if (dbError) {
        console.error("DB update error:", dbError.message);
        toast({
          title: "Error",
          description: "Failed to update car photos in database.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Photo Removed",
        description: "The photo has been successfully deleted.",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Unexpected Error",
        description: "Something went wrong removing the photo.",
        variant: "destructive",
      });
    } finally {
      setRemovingPhoto(null);
    }
  };

  const onSubmit = async (data: CarFormData) => {
    setSaving(true);

    try {
      const newPhotoUrls = await uploadNewPhotos();
      const allPhotos = [...existingPhotos, ...newPhotoUrls];

      const { error } = await supabase
        .from("cars")
        .update({
          ...data,
          photos: allPhotos,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Car Updated Successfully",
        description: "The car details have been updated.",
      });

      navigate("/admin/cars");
    } catch (error: any) {
      console.error("Update error:", error.message);
      toast({
        title: "Error",
        description: "Failed to update car. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading car details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link to="/admin/cars">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Car</h1>
            <p className="text-muted-foreground">Update car details and photos</p>
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
                  <Label htmlFor="name">Car Name *</Label>
                  <Input id="name" {...register("name", { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input id="brand" {...register("brand", { required: true })} />
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="small_bags">Small Bags</Label>
                  <Input
                    id="small_bags"
                    type="number"
                    {...register("small_bags", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mileage">Mileage *</Label>
                  <Input id="mileage" {...register("mileage", { required: true })} />
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
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                />
              </div>

              {/* Current Photos */}
              <div className="space-y-4">
                <Label>Current Photos</Label>
                {existingPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingPhotos.map((photoUrl, i) => (
                      <div key={i} className="relative group">
                        <img 
                          src={photoUrl} 
                          alt={`Car photo ${i + 1}`} 
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={removingPhoto === photoUrl}
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemovePhoto(photoUrl)}
                        >
                          {removingPhoto === photoUrl ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No photos uploaded yet.</p>
                )}
              </div>

              {/* Upload New Photos */}
              <div className="space-y-4">
                <Label>Add New Photos</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <Label htmlFor="newPhotos" className="cursor-pointer">
                    <span className="text-sm font-medium">Click to upload new photos</span>
                    <Input
                      id="newPhotos"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNewFileChange}
                      className="sr-only"
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP up to 10MB each
                  </p>
                </div>
                
                {newPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newPreviews.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={src} 
                          alt={`New preview ${idx + 1}`} 
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeNewPreview(idx)}
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
                  onClick={() => navigate("/admin/cars")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}