
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data
const mockTasks = [
  { id: 1, title: "Review new applicants", priority: "high", deadline: "2025-05-17", status: "in progress" },
  { id: 2, title: "Prepare monthly report", priority: "medium", deadline: "2025-05-20", status: "not started" }
];

const TasksOverview = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">My Tasks</CardTitle>
        <CardDescription>Tasks assigned to you as an HR manager</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Priority</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={task.priority === "high" ? "destructive" : "outline"}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge>{task.status}</Badge>
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

export default TasksOverview;
