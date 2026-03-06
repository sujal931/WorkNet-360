
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mock data
const mockPayrollUpdates = [
  { id: 1, employee: "James Wilson", amount: 4500, status: "unpaid", dueDate: "2025-05-30" },
  { id: 2, employee: "Emma Rodriguez", amount: 5200, status: "unpaid", dueDate: "2025-05-30" }
];

const PayrollOverview = () => {
  const navigate = useNavigate();
  
  const handleMarkPayrollPaid = (id: number) => {
    toast.success(`Payroll #${id} has been marked as paid`);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Payroll Snapshot</CardTitle>
        <CardDescription>Upcoming payroll status for employees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden sm:table-cell">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayrollUpdates.map((payroll) => (
                <TableRow key={payroll.id}>
                  <TableCell>{payroll.employee}</TableCell>
                  <TableCell className="hidden sm:table-cell">${payroll.amount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-8"
                      onClick={() => handleMarkPayrollPaid(payroll.id)}>
                      Mark as Paid
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-right">
          <Button variant="link" size="sm" onClick={() => navigate("/payroll")}>
            View Full Payroll
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollOverview;
