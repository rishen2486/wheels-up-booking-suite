use client;

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { uploadFiles } from "@/utils/uploadFiles";

export default function AddCar() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [seats, setSeats] = useState("");
  const [bags, setBags] = useState("");
  const [transmission, setTransmission] = useState("Automatic");
  const [mileage, setMileage] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files).slice(0, 5));
    }
  };

  const handleSubmit = async () => {
    const photoUrls = await uploadFiles("car-images", photos, "cars");

    const { error } = await supabase.from("cars").insert([
      {
        make,
        model,
        year,
        seats,
        bags,
        transmission,
        mileage,
        photos: photoUrls,
      },
    ]);

    if (error) console.error(error);
    else alert("Car added successfully!");
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">Add Car</h2>
      <input type="text" placeholder="Make" onChange={(e) => setMake(e.target.value)} />
      <input type="text" placeholder="Model" onChange={(e) => setModel(e.target.value)} />
      <input type="text" placeholder="Year" onChange={(e) => setYear(e.target.value)} />
      <input type="text" placeholder="Seats" onChange={(e) => setSeats(e.target.value)} />
      <input type="text" placeholder="Bags" onChange={(e) => setBags(e.target.value)} />
      <select onChange={(e) => setTransmission(e.target.value)}>
        <option value="Automatic">Automatic</option>
        <option value="Manual">Manual</option>
      </select>
      <input type="text" placeholder="Mileage" onChange={(e) => setMileage(e.target.value)} />

      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded">
        Submit
      </button>
    </div>
  );
}