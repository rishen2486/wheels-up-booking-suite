"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminData() {
  const [cars, setCars] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) {
          setLoading(false);
          return;
        }

        setUserId(user.id);

        // Check if user is superuser
        const { data: profile } = await supabase
          .from("profiles")
          .select("superuser")
          .eq("user_id", user.id)
          .single();

        const superuser = profile?.superuser || false;
        setIsSuperuser(superuser);

        // Build condition based on superuser status
        const condition = superuser ? {} : { user_id: user.id };

        // Fetch all data in parallel
        const [carsResult, toursResult, attractionsResult, bookingsResult] = await Promise.all([
          supabase.from("cars").select("*").match(condition),
          supabase.from("tours").select("*").match(condition),
          supabase.from("attractions").select("*").match(condition),
          superuser 
            ? supabase.from("bookings").select("*")
            : supabase.from("bookings").select("*").eq("user_id", user.id)
        ]);

        setCars(carsResult.data || []);
        setTours(toursResult.data || []);
        setAttractions(attractionsResult.data || []);
        setBookings(bookingsResult.data || []);

      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { 
    cars, 
    tours, 
    attractions, 
    bookings,
    loading, 
    isSuperuser, 
    userId,
    refetch: () => {
      // Trigger a reload of all data
      setLoading(true);
      const loadData = async () => {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return;

        const { data: profile } = await supabase
          .from("profiles")
          .select("superuser")
          .eq("user_id", user.id)
          .single();

        const superuser = profile?.superuser || false;
        const condition = superuser ? {} : { user_id: user.id };

        const [carsResult, toursResult, attractionsResult, bookingsResult] = await Promise.all([
          supabase.from("cars").select("*").match(condition),
          supabase.from("tours").select("*").match(condition),
          supabase.from("attractions").select("*").match(condition),
          superuser 
            ? supabase.from("bookings").select("*")
            : supabase.from("bookings").select("*").eq("user_id", user.id)
        ]);

        setCars(carsResult.data || []);
        setTours(toursResult.data || []);
        setAttractions(attractionsResult.data || []);
        setBookings(bookingsResult.data || []);
        setLoading(false);
      };
      loadData();
    }
  };
}