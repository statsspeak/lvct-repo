import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PatientsSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="h-10 w-40 bg-gray-200 rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="h-10 w-full bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-gray-200 rounded"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
