"use client";

import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { exportDataToCSV, exportDataToExcel } from "@/utils/exportData";
import {
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminAnalytics() {
  const { cars, tours, attractions, bookings, loading, isSuperuser } = useAdminData();

  if (loading) return <div className="text-foreground">Loading analytics...</div>;

  const chartData = [
    { name: "Cars", count: cars.length },
    { name: "Tours", count: tours.length },
    { name: "Attractions", count: attractions.length },
    { name: "Bookings", count: bookings.length },
  ];

  const pieData = [
    { name: "Cars", value: cars.length },
    { name: "Tours", value: tours.length },
    { name: "Attractions", value: attractions.length },
  ];

  const totalRevenue = bookings.reduce((sum, booking) => 
    sum + (booking.total_amount || 0), 0
  );

  const pendingBookings = bookings.filter(b => b.payment_status === 'pending').length;
  const completedBookings = bookings.filter(b => b.payment_status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        {isSuperuser ? (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Superuser: All Platform Data
          </span>
        ) : (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Admin: Your Data Only
          </span>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Cars</h3>
          <p className="text-2xl font-bold text-foreground">{cars.length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Tours</h3>
          <p className="text-2xl font-bold text-foreground">{tours.length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Attractions</h3>
          <p className="text-2xl font-bold text-foreground">{attractions.length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          <p className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Total Bookings</h3>
          <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Pending Bookings</h3>
          <p className="text-2xl font-bold text-yellow-600">{pendingBookings}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">Completed Bookings</h3>
          <p className="text-2xl font-bold text-green-600">{completedBookings}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Items Overview</h3>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Distribution</h3>
          <div className="w-full h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => exportDataToCSV("cars")}
          variant="outline"
        >
          Export Cars (CSV)
        </Button>
        <Button
          onClick={() => exportDataToExcel("cars")}
          variant="outline"
        >
          Export Cars (Excel)
        </Button>
        <Button
          onClick={() => exportDataToCSV("tours")}
          variant="outline"
        >
          Export Tours (CSV)
        </Button>
        <Button
          onClick={() => exportDataToExcel("tours")}
          variant="outline"
        >
          Export Tours (Excel)
        </Button>
        <Button
          onClick={() => exportDataToCSV("attractions")}
          variant="outline"
        >
          Export Attractions (CSV)
        </Button>
        <Button
          onClick={() => exportDataToExcel("attractions")}
          variant="outline"
        >
          Export Attractions (Excel)
        </Button>
      </div>
    </div>
  );
}