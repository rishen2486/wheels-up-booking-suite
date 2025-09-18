import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export async function exportDataToCSV(type: "cars" | "tours" | "attractions" | "bookings") {
  try {
    // Get current user
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return;

    // Check if superuser
    const { data: profile } = await supabase
      .from("profiles")
      .select("superuser")
      .eq("user_id", user.id)
      .single();

    const isSuperuser = profile?.superuser || false;
    const condition = isSuperuser ? {} : { user_id: user.id };

    // Fetch selected dataset
    const { data } = await supabase
      .from(type)
      .select("*")
      .match(condition);

    if (!data) return;

    // Convert to CSV
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${type}-export-${new Date().toISOString().split('T')[0]}.csv`);
  } catch (error) {
    console.error(`Error exporting ${type} to CSV:`, error);
  }
}

export async function exportDataToExcel(type: "cars" | "tours" | "attractions" | "bookings") {
  try {
    // Get current user
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return;

    // Check if superuser
    const { data: profile } = await supabase
      .from("profiles")
      .select("superuser")
      .eq("user_id", user.id)
      .single();

    const isSuperuser = profile?.superuser || false;
    const condition = isSuperuser ? {} : { user_id: user.id };

    // Fetch selected dataset
    const { data } = await supabase
      .from(type)
      .select("*")
      .match(condition);

    if (!data) return;

    // Convert to Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, type);
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${type}-export-${new Date().toISOString().split('T')[0]}.xlsx`);
  } catch (error) {
    console.error(`Error exporting ${type} to Excel:`, error);
  }
}