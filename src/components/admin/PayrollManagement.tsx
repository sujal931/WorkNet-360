
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

// Mock data for demonstration
const mockPayroll = [
  { id: 1, employee: "John Doe", department: "Engineering", position: "Frontend Developer", salary: 75000, month: "May", year: 2025, status: "pending" },
  { id: 2, employee: "Jane Smith", department: "Human Resources", position: "HR Manager", salary: 85000, month: "May", year: 2025, status: "paid" },
  { id: 3, employee: "Robert Johnson", department: "Marketing", position: "Marketing Specialist", salary: 65000, month: "May", year: 2025, status: "pending" },
  { id: 4, employee: "Emily Davis", department: "Sales", position: "Sales Representative", salary: 70000, month: "April", year: 2025, status: "paid" },
  { id: 5, employee: "Michael Brown", department: "Human Resources", position: "HR Coordinator", salary: 60000, month: "May", year: 2025, status: "pending" }
];

const PayrollManagement = () => {
  const [filterMonth, setFilterMonth] = useState("May");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Filter payroll entries based on month and status filters
  const filteredPayroll = mockPayroll.filter(entry => {
    const matchesMonth = entry.month === filterMonth;
    const matchesStatus = filterStatus === "all" || entry.status === filterStatus;
    return matchesMonth && matchesStatus;
  });
  
  const handleMarkAsPaid = (id: number, employeeName: string) => {
    toast.success(`Payroll for ${employeeName} has been marked as paid`);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Payroll Management</CardTitle>
        <CardDescription>Manage payroll for all employees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee name, department..."
              className="pl-8"
            />
          </div>
          <Select
            value={filterMonth}
            onValueChange={setFilterMonth}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="January">January</SelectItem>
              <SelectItem value="February">February</SelectItem>
              <SelectItem value="March">March</SelectItem>
              <SelectItem value="April">April</SelectItem>
              <SelectItem value="May">May</SelectItem>
              <SelectItem value="June">June</SelectItem>
              <SelectItem value="July">July</SelectItem>
              <SelectItem value="August">August</SelectItem>
              <SelectItem value="September">September</SelectItem>
              <SelectItem value="October">October</SelectItem>
              <SelectItem value="November">November</SelectItem>
              <SelectItem value="December">December</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden lg:table-cell">Position</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayroll.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.employee}</TableCell>
                  <TableCell className="hidden md:table-cell">{entry.department}</TableCell>
                  <TableCell className="hidden lg:table-cell">{entry.position}</TableCell>
                  <TableCell>{formatCurrency(entry.salary / 12)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={entry.status === "paid" ? "outline" : "secondary"}
                      className={entry.status === "paid" ? "border-green-500 text-green-700" : ""}
                    >
                      {entry.status === "paid" ? "Paid" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.status === "pending" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMarkAsPaid(entry.id, entry.employee)}
                      >
                        Mark as Paid
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">Processed</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollManagement;
