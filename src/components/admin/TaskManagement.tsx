
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const mockTasks = [
  { id: 1, title: "Review department budgets", priority: "high", assignedTo: "Sarah Williams (HR)", deadline: "2025-05-20", status: "in progress" },
  { id: 2, title: "Approve payroll batch", priority: "high", assignedTo: "Michael Brown (HR)", deadline: "2025-05-18", status: "not started" },
  { id: 3, title: "Update company policies", priority: "medium", assignedTo: "Jane Smith (HR)", deadline: "2025-05-25", status: "in progress" },
  { id: 4, title: "Create Q3 project timeline", priority: "medium", assignedTo: "John Doe (Engineering)", deadline: "2025-05-30", status: "completed" },
  { id: 5, title: "Quarterly performance reviews", priority: "high", assignedTo: "HR Team", deadline: "2025-06-15", status: "not started" }
];

const TaskManagement = () => {
  const handleCreateTask = () => {
    toast.info("Opening task creation dialog");
    // In a real application, this would open a dialog to create a new task
  };
  
  const handleEditTask = (id: number) => {
    toast.info(`Editing task #${id}`);
    // In a real application, this would open a dialog to edit the task
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">Task Management</CardTitle>
          <CardDescription>Assign and manage tasks across departments</CardDescription>
        </div>
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" /> Create Task
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-8"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not started">Not Started</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="hidden lg:table-cell">Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{task.assignedTo}</TableCell>
                  <TableCell>
                    <Badge
                      variant={task.priority === "high" ? "destructive" : "outline"}
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{task.deadline}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        task.status === "completed" ? "outline" :
                        task.status === "in progress" ? "secondary" : "default"
                      }
                      className={task.status === "completed" ? "border-green-500 text-green-700" : ""}
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTask(task.id)}
                    >
                      View/Edit
                    </Button>
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

export default TaskManagement;
