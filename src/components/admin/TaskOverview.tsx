
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const mockTasks = [
  { id: 1, title: "Review department budgets", priority: "high", assignedTo: "Sarah (HR)", deadline: "2025-05-20", status: "in progress" },
  { id: 2, title: "Approve payroll batch", priority: "high", assignedTo: "Admin", deadline: "2025-05-18", status: "not started" },
  { id: 3, title: "Update company policies", priority: "medium", assignedTo: "Mark (HR)", deadline: "2025-05-25", status: "in progress" }
];

const TaskOverview = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Task Overview</CardTitle>
        <CardDescription>Recent tasks across departments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden sm:table-cell">Assigned To</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell className="hidden sm:table-cell">{task.assignedTo}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={task.priority === "high" ? "destructive" : "outline"}>
                      {task.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-right">
          <Button variant="link" size="sm" onClick={() => navigate("/tasks")}>
            View All Tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskOverview;
