"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, QrCode, TestTube, FileText, BarChart2 } from "lucide-react";

export default function LabTechnicianDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const dashboardItems = [
    {
      title: "Scan Patient QR Code",
      description: "Scan a patient's QR code to retrieve their information.",
      href: "/dashboard/lab-technician/scan-qr",
      icon: QrCode,
    },
    {
      title: "Manage Tests",
      description: "View and update test statuses.",
      href: "/dashboard/lab-technician/tests",
      icon: TestTube,
    },
    {
      title: "Record New Test",
      description: "Record a new test in the system.",
      href: "/dashboard/lab-technician/record-test",
      icon: FileText,
    },
    {
      title: "Test Analytics",
      description: "View test-related analytics.",
      href: "/dashboard/lab-technician/analytics",
      icon: BarChart2,
    },
  ];

  const filteredItems = dashboardItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Lab Technician Dashboard</h1>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search dashboard..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <item.icon className="w-6 h-6 text-primary" />
                <span>{item.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{item.description}</p>
              <Button asChild className="w-full">
                <Link href={item.href}>
                  <span className="sr-only">{`Go to ${item.title}`}</span>
                  {item.title}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredItems.length === 0 && (
        <p className="text-center text-muted-foreground">
          No matching items found.
        </p>
      )}
    </div>
  );
}
