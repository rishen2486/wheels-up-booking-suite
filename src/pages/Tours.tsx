"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";

export default function Tours() {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      const { data, error } = await supabase.from("tours").select("*");
      if (error) {
        console.error("Error fetching tours:", error.message);
        return;
      }
      setTours(data || []);
      setLoading(false);
    };

    fetchTours();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6">
          <div className="text-center text-muted-foreground">Loading tours...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground mb-6">Tours</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.length > 0 ? (
            tours.map((tour) => (
              <div key={tour.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow bg-card">
                {tour.image_url && (
                  <img
                    src={tour.image_url}
                    alt={tour.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="font-semibold text-lg text-foreground">{tour.name}</h3>
                {tour.region && (
                  <p className="text-sm text-muted-foreground">{tour.region}</p>
                )}
                {tour.hours && (
                  <p className="text-sm text-muted-foreground">Duration: {tour.hours} hours</p>
                )}
                {tour.details && (
                  <p className="text-sm text-muted-foreground mt-2">{tour.details}</p>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No tours available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}