import React, { Suspense } from "react"
import { CommunicationDashboard } from "@/components/CommunicationDashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, BarChart2 } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Communication Statistics | Call Center Agent Dashboard",
  description: "View and analyze communication statistics for the call center",
}

export default function CommunicationStatsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <BarChart2 className="mr-2 h-8 w-8" />
          Communication Statistics
        </h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/call-center-agent/communications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Communications
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          }>
            <CommunicationDashboard />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}