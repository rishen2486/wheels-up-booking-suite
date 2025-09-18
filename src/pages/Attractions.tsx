"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";

export default function Attractions() {
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttractions = async () => {
      const { data, error } = await supabase.from("attractions").select("*");
      if (error) {
        console.error("Error fetching attractions:", error.message);
        return;
      }
      setAttractions(data || []);
      setLoading(false);
    };

    fetchAttractions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6">
          <div className="text-center text-muted-foreground">Loading attractions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Attractions</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {attractions.length > 0 ? (
            attractions.map((attraction) => (
              <div key={attraction.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow bg-card">
                {attraction.image_url && (
                  <img
                    src={attraction.image_url}
                    alt={attraction.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="font-semibold text-lg text-foreground">{attraction.name}</h3>
                {attraction.region && (
                  <p className="text-sm text-muted-foreground">{attraction.region}</p>
                )}
                {attraction.hours && (
                  <p className="text-sm text-muted-foreground">Duration: {attraction.hours} hours</p>
                )}
                {attraction.details && (
                  <p className="text-sm text-muted-foreground mt-2">{attraction.details}</p>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No attractions available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}