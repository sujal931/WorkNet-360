
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data
const mockPayrollItems = [
  { id: 1, department: "Engineering", employees: 12, processed: 8, pending: 4 },
  { id: 2, department: "Marketing", employees: 6, processed: 6, pending: 0 },
  { id: 3, department: "HR", employees: 4, processed: 2, pending: 2 }
];

const PayrollSummary = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Payroll Summary</CardTitle>
        <CardDescription>Current month's payroll status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="hidden sm:table-cell">Total</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayrollItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.department}</TableCell>
                  <TableCell className="hidden sm:table-cell">{item.employees}</TableCell>
                  <TableCell className="text-right">
                    {item.pending > 0 ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">
                        {item.pending} pending
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Complete
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-right">
          <Button variant="link" size="sm" onClick={() => navigate("/payroll")}>
            View Payroll Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollSummary;
