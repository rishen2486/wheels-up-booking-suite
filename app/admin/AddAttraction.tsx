use client;

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uploadFiles } from "@/utils/uploadFiles";

export default function AddAttraction() {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files).slice(0, 5));
    }
  };

  const handleSubmit = async () => {
    const photoUrls = await uploadFiles("attraction-images", photos, "attractions");

    const { error } = await supabase.from("attractions").insert([
      {
        name,
        region,
        details,
        photos: photoUrls,
      },
    ]);

    if (error) console.error(error);
    else alert("Attraction added successfully!");
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Add Attraction</h2>
      <input type="text" placeholder="Attraction Name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Region" onChange={(e) => setRegion(e.target.value)} />
      <textarea placeholder="Details" onChange={(e) => setDetails(e.target.value)} />

      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded">
        Submit
      </button>
    </div>
  );
}