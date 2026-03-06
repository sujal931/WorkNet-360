
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

// Mock attendance data
const mockAttendanceData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  
  // Generate random status (mostly present, some absent)
  const randomStatus = Math.random() > 0.9 ? "Absent" : Math.random() > 0.8 ? "Half Day" : "Present";
  
  return {
    id: i + 1,
    date: date,
    checkIn: randomStatus !== "Absent" ? new Date(date.setHours(9, Math.floor(Math.random() * 30), 0)) : null,
    checkOut: randomStatus !== "Absent" ? new Date(date.setHours(17, Math.floor(Math.random() * 30), 0)) : null,
    status: randomStatus,
    workHours: randomStatus === "Present" ? 8 : randomStatus === "Half Day" ? 4 : 0,
    notes: randomStatus !== "Present" ? (randomStatus === "Absent" ? "Sick leave" : "Left early") : "",
  };
});

const AttendanceHistoryTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [month, setMonth] = useState(new Date().getMonth().toString());
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  const itemsPerPage = 10;
  
  // Filter attendance data based on month and year
  const filteredData = mockAttendanceData.filter(record => {
    const recordMonth = record.date.getMonth().toString();
    const recordYear = record.date.getFullYear().toString();
    return recordMonth === month && recordYear === year;
  });
  
  // Paginate data
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Helper to format time
  const formatTime = (date: Date | null) => {
    if (!date) return "--:--";
    return format(date, "HH:mm");
  };
  
  // Helper to get badge variant based on status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Present":
        return "default";
      case "Half Day":
        return "secondary"; // Changed from "warning" to "secondary"
      case "Absent":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  return (
    <Card className="card-gradient">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Attendance History</CardTitle>
          
          <div className="flex gap-2">
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">January</SelectItem>
                <SelectItem value="1">February</SelectItem>
                <SelectItem value="2">March</SelectItem>
                <SelectItem value="3">April</SelectItem>
                <SelectItem value="4">May</SelectItem>
                <SelectItem value="5">June</SelectItem>
                <SelectItem value="6">July</SelectItem>
                <SelectItem value="7">August</SelectItem>
                <SelectItem value="8">September</SelectItem>
                <SelectItem value="9">October</SelectItem>
                <SelectItem value="10">November</SelectItem>
                <SelectItem value="11">December</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead className="hidden sm:table-cell">Work Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Notes</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {currentRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {format(record.date, "EEE, MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{formatTime(record.checkIn)}</TableCell>
                  <TableCell>{formatTime(record.checkOut)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{record.workHours} hours</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{record.notes}</TableCell>
                </TableRow>
              ))}
              
              {currentRecords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end mt-4 gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center text-sm">
              Page {currentPage} of {totalPages}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceHistoryTable;
