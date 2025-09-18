"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAdminData } from "@/hooks/useAdminData";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminReports() {
  const { cars, tours, attractions, bookings, loading, isSuperuser } = useAdminData();
  const reportRef = useRef<HTMLDivElement>(null);

  if (loading) return <div className="text-foreground">Loading report...</div>;

  const chartData = [
    { name: "Cars", count: cars.length },
    { name: "Tours", count: tours.length },
    { name: "Attractions", count: attractions.length },
    { name: "Bookings", count: bookings.length },
  ];

  const totalRevenue = bookings.reduce((sum, booking) => 
    sum + (booking.total_amount || 0), 0
  );

  const handleDownload = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();

      // Company header
      pdf.setFontSize(18);
      pdf.text("CarsRus Ltd", 14, 20);
      pdf.setFontSize(11);
      pdf.text("Royal Road, St Pierre, Mauritius", 14, 28);
      pdf.line(14, 32, 200, 32);

      // Add the captured preview (summary + chart)
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 14, 40, pdfWidth - 28, pdfHeight - 60);

      // Start new section: Detailed tables
      let yOffset = Math.min(pdfHeight + 50, 120);
      pdf.setFontSize(14);
      pdf.text("Detailed Data", 14, yOffset);
      yOffset += 8;

      // Cars table
      if (cars.length > 0) {
        pdf.setFontSize(12);
        pdf.text("Cars", 14, yOffset);
        yOffset += 6;
        cars.slice(0, 10).forEach((car: any, i: number) => {
          const text = `${i + 1}. ${car.name} - ${car.brand || 'N/A'} (${car.transmission || 'N/A'})`;
          pdf.text(text, 20, yOffset);
          yOffset += 6;
          if (yOffset > 270) {
            pdf.addPage();
            yOffset = 20;
          }
        });
        if (cars.length > 10) {
          pdf.text(`... and ${cars.length - 10} more cars`, 20, yOffset);
          yOffset += 6;
        }
      }

      yOffset += 10;
      if (tours.length > 0) {
        pdf.text("Tours", 14, yOffset);
        yOffset += 6;
        tours.slice(0, 10).forEach((tour: any, i: number) => {
          const text = `${i + 1}. ${tour.name} - ${tour.region || 'N/A'} (${tour.hours || 'N/A'} hrs)`;
          pdf.text(text, 20, yOffset);
          yOffset += 6;
          if (yOffset > 270) {
            pdf.addPage();
            yOffset = 20;
          }
        });
        if (tours.length > 10) {
          pdf.text(`... and ${tours.length - 10} more tours`, 20, yOffset);
          yOffset += 6;
        }
      }

      yOffset += 10;
      if (attractions.length > 0) {
        pdf.text("Attractions", 14, yOffset);
        yOffset += 6;
        attractions.slice(0, 10).forEach((attr: any, i: number) => {
          const text = `${i + 1}. ${attr.name} - ${attr.region || 'N/A'}`;
          pdf.text(text, 20, yOffset);
          yOffset += 6;
          if (yOffset > 270) {
            pdf.addPage();
            yOffset = 20;
          }
        });
        if (attractions.length > 10) {
          pdf.text(`... and ${attractions.length - 10} more attractions`, 20, yOffset);
          yOffset += 6;
        }
      }

      // Footer
      pdf.setFontSize(10);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 290);

      pdf.save(`admin-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Reports</h2>
        <Button 
          onClick={handleDownload} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Download PDF Report
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        {isSuperuser
          ? "Superuser: This report includes all platform data"
          : "Admin: This report includes only your uploaded data"}
      </p>

      {/* Preview (summary + chart) */}
      <div
        ref={reportRef}
        className="p-6 border rounded-lg bg-card shadow space-y-6"
      >
        <h3 className="text-xl font-semibold text-foreground">Analytics Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{cars.length}</p>
            <p className="text-sm text-muted-foreground">Total Cars</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{tours.length}</p>
            <p className="text-sm text-muted-foreground">Total Tours</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{attractions.length}</p>
            <p className="text-sm text-muted-foreground">Total Attractions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </div>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}