
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { Clock, CheckCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import AttendanceHistoryTable from "@/pages/attendance/AttendanceHistoryTable";

const Attendance = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  
  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(format(now, "HH:mm:ss"));
    toast.success("Check-in recorded successfully!");
  };
  
  const handleCheckOut = () => {
    const now = new Date();
    setCheckOutTime(format(now, "HH:mm:ss"));
    toast.success("Check-out recorded successfully!");
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-fore`ground mt-1">
          Track and manage attendance records
        </p>
      </div>
      
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="today">Today's Attendance</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
          {(user?.role === "admin" || user?.role === "hr") && (
            <TabsTrigger value="report">Attendance Report</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="today">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-gradient md:col-span-2">
              <CardHeader>
                <CardTitle>Attendance Check-in/out</CardTitle>
                <CardDescription>
                  Record your daily attendance
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Attendance Policy</AlertTitle>
                  <AlertDescription>
                    Work hours are from 9:00 AM to 5:00 PM. Please ensure you check in and out every day.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="text-lg font-medium">Today's Status</div>
                    <div className="flex items-center text-2xl font-bold">
                      {format(new Date(), "EEEE, MMMM d, yyyy")}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Check-in Time</div>
                        <div className="font-medium">
                          {checkInTime || "--:--:--"}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Check-out Time</div>
                        <div className="font-medium">
                          {checkOutTime || "--:--:--"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mt-6">
                      <Button
                        onClick={handleCheckIn}
                        disabled={!!checkInTime}
                        className="flex-1"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Check In
                      </Button>
                      
                      <Button
                        onClick={handleCheckOut}
                        disabled={!checkInTime || !!checkOutTime}
                        className="flex-1"
                      >
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Check Out
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-lg font-medium">Work Hours</div>
                    <div className="p-4 bg-muted rounded-md">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Today</span>
                          <span className="font-medium">
                            {checkInTime && checkOutTime ? "8 hours" : "In progress"}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm">This Week</span>
                          <span className="font-medium">32 hours</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm">This Month</span>
                          <span className="font-medium">140 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>
                  View your monthly attendance
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <AttendanceHistoryTable />
        </TabsContent>
        
        <TabsContent value="report">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Attendance Report</CardTitle>
              <CardDescription>
                View and analyze attendance data for all employees
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground">
                This feature is coming soon. You will be able to generate attendance reports for all employees,
                filter by date range, department, and export the data to Excel or PDF.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
