
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

// Mock payroll data
const mockPayrollData = [
  {
    id: 1,
    employeeName: "John Doe",
    employeeId: "EMP001",
    month: "April",
    year: 2025,
    basicSalary: 5000,
    bonus: 500,
    deductions: 300,
    totalSalary: 5200,
    status: "Paid",
    paymentDate: "2025-05-05"
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    employeeId: "EMP002",
    month: "April",
    year: 2025,
    basicSalary: 6000,
    bonus: 800,
    deductions: 400,
    totalSalary: 6400,
    status: "Paid",
    paymentDate: "2025-05-05"
  },
  {
    id: 3,
    employeeName: "Michael Johnson",
    employeeId: "EMP003",
    month: "April",
    year: 2025,
    basicSalary: 4500,
    bonus: 300,
    deductions: 200,
    totalSalary: 4600,
    status: "Processing",
    paymentDate: null
  },
  {
    id: 4,
    employeeName: "Emily Brown",
    employeeId: "EMP004",
    month: "April",
    year: 2025,
    basicSalary: 5500,
    bonus: 0,
    deductions: 250,
    totalSalary: 5250,
    status: "Processing",
    paymentDate: null
  }
];

const Payroll = () => {
  const { user } = useAuth();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
        <p className="text-muted-foreground mt-1">
          View and manage employee payroll information
        </p>
      </div>
      
      <Card className="card-gradient">
        <CardHeader className="pb-2">
          <CardTitle>Monthly Payroll - April 2025</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden sm:table-cell">Employee ID</TableHead>
                  <TableHead className="text-right">Basic Salary</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Bonus</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Deductions</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {mockPayrollData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell className="hidden sm:table-cell">{record.employeeId}</TableCell>
                    <TableCell className="text-right">{formatCurrency(record.basicSalary)}</TableCell>
                    <TableCell className="hidden md:table-cell text-right">{formatCurrency(record.bonus)}</TableCell>
                    <TableCell className="hidden md:table-cell text-right">{formatCurrency(record.deductions)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(record.totalSalary)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={record.status === "Paid" ? "default" : "outline"}>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Next payment date: May 31, 2025
            </p>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>January</span>
                <Badge variant="outline">Completed</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>February</span>
                <Badge variant="outline">Completed</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>March</span>
                <Badge variant="outline">Completed</Badge>
              </li>
              <li className="flex justify-between items-center">
                <span>April</span>
                <Badge variant="default">Current</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payroll Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Employees:</dt>
                <dd className="font-medium">4</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Basic Salary:</dt>
                <dd className="font-medium">{formatCurrency(21000)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Bonus:</dt>
                <dd className="font-medium">{formatCurrency(1600)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total Deductions:</dt>
                <dd className="font-medium">{formatCurrency(1150)}</dd>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <dt className="font-medium">Total Payroll:</dt>
                <dd className="font-semibold">{formatCurrency(21450)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payroll;
