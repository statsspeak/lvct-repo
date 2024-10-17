"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  scheduleAppointment,
  getAppointments,
} from "@/app/actions/communications";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar as CalendarIcon,
  User,
  FileText,
  Plus,
} from "lucide-react";

interface Appointment {
  id: string;
  patientId: string;
  date: Date;
  type: string;
  notes: string | null;
  scheduledBy: string;
  createdAt: Date;
  updatedAt: Date;
  patient: {
    firstName: string;
    lastName: string;
  };
}

export function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAppointments = useCallback(
    async (date: Date) => {
      setLoading(true);
      try {
        const result = await getAppointments(date.toISOString().split("T")[0]);
        if ("appointments" in result && Array.isArray(result.appointments)) {
          const formattedAppointments: Appointment[] = result.appointments.map(
            (app) => ({
              ...app,
              date: new Date(app.date),
              createdAt: new Date(app.createdAt),
              updatedAt: new Date(app.updatedAt),
            })
          );
          setAppointments(formattedAppointments);
        } else {
          throw new Error("Failed to fetch appointments");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch appointments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate, fetchAppointments]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setNewAppointment((prev) => ({
        ...prev,
        date: date.toISOString().split("T")[0],
      }));
    }
  };

  const handleScheduleAppointment = async () => {
    if (!newAppointment.date || !newAppointment.time) return;
    setLoading(true);
    try {
      const result = await scheduleAppointment({
        ...newAppointment,
        date: `${newAppointment.date}T${newAppointment.time}:00`,
      });
      if ("success" in result) {
        toast({
          title: "Appointment Scheduled",
          description: "The appointment has been successfully scheduled.",
        });
        setIsDialogOpen(false);
        fetchAppointments(new Date(newAppointment.date));
      } else {
        throw new Error(
          result.error ? result.error.toString() : "An unknown error occurred"
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Appointments for {selectedDate?.toDateString()}
            </span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule New Appointment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={newAppointment.patientId}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          patientId: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          time: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      onValueChange={(value) =>
                        setNewAppointment({ ...newAppointment, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Initial Consultation">
                          Initial Consultation
                        </SelectItem>
                        <SelectItem value="Test Results">
                          Test Results
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={newAppointment.notes}
                      onChange={(e) =>
                        setNewAppointment({
                          ...newAppointment,
                          notes: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={handleScheduleAppointment}
                    disabled={loading}
                  >
                    {loading ? <Spinner className="mr-2" size="sm" /> : null}
                    Schedule
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No appointments scheduled for this day.
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          {appointment.patient.firstName}{" "}
                          {appointment.patient.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge>{appointment.type}</Badge>
                    </div>
                    {appointment.notes && (
                      <p className="mt-2 text-sm flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        {appointment.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
