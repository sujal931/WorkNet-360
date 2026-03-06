
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for job outcomes
const mockJobOutcomes = [
  { 
    id: 1,
    employee: "John Doe", 
    previousPosition: "Junior Developer",
    previousDepartment: "Engineering",
    newPosition: "Mid-level Developer", 
    newDepartment: "Engineering",
    effectiveDate: "2025-06-01",
    status: "Completed"
  },
  { 
    id: 2, 
    employee: "Emily Brown",
    previousPosition: "Marketing Assistant",
    previousDepartment: "Marketing",
    newPosition: "Marketing Specialist", 
    newDepartment: "Marketing",
    effectiveDate: "2025-06-15",
    status: "Pending"
  },
  { 
    id: 3, 
    employee: "Michael Johnson",
    previousPosition: "Sales Representative",
    previousDepartment: "Sales",
    newPosition: "Senior Sales Representative", 
    newDepartment: "Sales",
    effectiveDate: "2025-07-01",
    status: "Pending"
  }
];

const JobOutcomes = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Internal Job Outcomes</h1>
        <p className="text-muted-foreground">View internal job application results and position changes</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Position Changes</CardTitle>
          <CardDescription>Employees who have successfully applied for internal positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Previous Position</TableHead>
                  <TableHead>New Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockJobOutcomes.map((outcome) => (
                  <TableRow key={outcome.id}>
                    <TableCell className="font-medium">{outcome.employee}</TableCell>
                    <TableCell>{outcome.previousPosition}</TableCell>
                    <TableCell>{outcome.newPosition}</TableCell>
                    <TableCell>{outcome.newDepartment}</TableCell>
                    <TableCell>{outcome.effectiveDate}</TableCell>
                    <TableCell>
                      <Badge variant={outcome.status === "Completed" ? "outline" : "secondary"}>
                        {outcome.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Transfers Summary</CardTitle>
          <CardDescription>Summary of interdepartmental transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Engineering</h3>
              <div className="mt-2 text-2xl font-bold">+2</div>
              <div className="text-sm text-muted-foreground">Transfers In</div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Marketing</h3>
              <div className="mt-2 text-2xl font-bold">+1</div>
              <div className="text-sm text-muted-foreground">Transfers In</div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Sales</h3>
              <div className="mt-2 text-2xl font-bold">-1</div>
              <div className="text-sm text-muted-foreground">Transfers Out</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobOutcomes;
