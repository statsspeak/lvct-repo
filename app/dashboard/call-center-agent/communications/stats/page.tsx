import React from "react";
import { CommunicationDashboard } from "@/components/CommunicationDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommunicationStatsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-lvct-purple">Communication Statistics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <CommunicationDashboard />
        </CardContent>
        
      </Card>
    </div>
  );
}
