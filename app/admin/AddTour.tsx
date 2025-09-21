use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uploadFiles } from "@/utils/uploadFiles";

export default function AddTour() {
  const [name, setName] = useState("");
  const [hours, setHours] = useState("");
  const [region, setRegion] = useState("");
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files).slice(0, 5));
    }
  };

  const handleSubmit = async () => {
    const photoUrls = await uploadFiles("tour-images", photos, "tours");

    const { error } = await supabase.from("tours").insert([
      {
        name,
        hours,
        region,
        details,
        photos: photoUrls,
      },
    ]);

    if (error) console.error(error);
    else alert("Tour added successfully!");
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Add Tour</h2>
      <input type="text" placeholder="Tour Name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Number of Hours" onChange={(e) => setHours(e.target.value)} />
      <input type="text" placeholder="Region" onChange={(e) => setRegion(e.target.value)} />
      <textarea placeholder="Details" onChange={(e) => setDetails(e.target.value)} />

      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded">
        Submit
      </button>
    </div>
  );
}