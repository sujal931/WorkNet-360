
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock payroll data for demonstration
const mockPayrollData = {
  hr: [
    { id: 1, name: "Jane Smith", position: "HR Manager", department: "Human Resources", salary: 6500, status: "Paid", date: "2025-05-01" },
    { id: 2, name: "Michael Brown", position: "HR Coordinator", department: "Human Resources", salary: 4800, status: "Paid", date: "2025-05-01" },
  ],
  employees: [
    { id: 3, name: "John Doe", position: "Software Developer", department: "Engineering", salary: 5200, status: "Paid", date: "2025-05-01" },
    { id: 4, name: "Alice Johnson", position: "Marketing Specialist", department: "Marketing", salary: 4500, status: "Processing", date: "2025-05-01" },
    { id: 5, name: "Robert Wilson", position: "Sales Representative", department: "Sales", salary: 4200, status: "Paid", date: "2025-05-01" },
  ]
};

const PayrollOverview = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll Overview</h1>
        <p className="text-muted-foreground">View organization-wide payroll information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Summary</CardTitle>
          <CardDescription>View current month's payroll by department</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Staff</TabsTrigger>
              <TabsTrigger value="hr">HR Staff</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...mockPayrollData.hr, ...mockPayrollData.employees].map((payroll) => (
                      <TableRow key={payroll.id}>
                        <TableCell className="font-medium">{payroll.name}</TableCell>
                        <TableCell>{payroll.position}</TableCell>
                        <TableCell>{payroll.department}</TableCell>
                        <TableCell>${payroll.salary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={payroll.status === "Paid" ? "outline" : "secondary"}>
                            {payroll.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{payroll.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="hr">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPayrollData.hr.map((payroll) => (
                      <TableRow key={payroll.id}>
                        <TableCell className="font-medium">{payroll.name}</TableCell>
                        <TableCell>{payroll.position}</TableCell>
                        <TableCell>${payroll.salary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={payroll.status === "Paid" ? "outline" : "secondary"}>
                            {payroll.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{payroll.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="employees">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPayrollData.employees.map((payroll) => (
                      <TableRow key={payroll.id}>
                        <TableCell className="font-medium">{payroll.name}</TableCell>
                        <TableCell>{payroll.position}</TableCell>
                        <TableCell>{payroll.department}</TableCell>
                        <TableCell>${payroll.salary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={payroll.status === "Paid" ? "outline" : "secondary"}>
                            {payroll.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollOverview;
