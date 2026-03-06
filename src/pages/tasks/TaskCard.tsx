
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Circle, Clock, CheckCircle2, Calendar, AlertCircle, MoreHorizontal, MessageSquare } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface TaskCardProps {
  task: any;
  onEdit: () => void;
  isEmployeeView: boolean;
}

const TaskCard = ({ task, onEdit, isEmployeeView }: TaskCardProps) => {
  const handleStatusChange = (newStatus: string) => {
    // Here would be API call to update task status
    toast.success(`Task status updated to ${newStatus}`);
  };
  
  const getStatusIcon = () => {
    switch (task.status) {
      case "To Do":
        return <Circle className="h-4 w-4 text-muted-foreground" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Not Completed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getPriorityBadge = () => {
    switch (task.priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>;
      case "Medium":
        return <Badge variant="default">Medium</Badge>;
      case "Low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };
  
  const isOverdue = () => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today && task.status !== "Completed";
  };
  
  const formatDueDate = () => {
    const dueDate = new Date(task.dueDate);
    return formatDistanceToNow(dueDate, { addSuffix: true });
  };
  
  return (
    <Card className={`hover-scale ${task.status === "Completed" ? "opacity-80" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{task.status}</span>
          </div>
          {getPriorityBadge()}
        </div>
        <CardTitle className="mt-2 text-lg">{task.title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {task.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className={isOverdue() ? "text-destructive font-medium" : "text-muted-foreground"}>
              {isOverdue() && task.status !== "Completed" && (
                <AlertCircle className="inline-block h-3 w-3 mr-1" />
              )}
              Due {formatDueDate()}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary font-medium">
              {task.assignedBy.name.split(" ").map((n: string) => n[0]).join("")}
            </div>
            <span className="text-muted-foreground">Assigned by: {task.assignedBy.name}</span>
          </div>
          
          {task.comments.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{task.comments.length} query/responses</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
        >
          View Details
        </Button>
        
        {isEmployeeView ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {task.status !== "To Do" && (
                <DropdownMenuItem onClick={() => handleStatusChange("To Do")}>
                  Mark as To Do
                </DropdownMenuItem>
              )}
              
              {task.status !== "In Progress" && (
                <DropdownMenuItem onClick={() => handleStatusChange("In Progress")}>
                  Mark as In Progress
                </DropdownMenuItem>
              )}
              
              {task.status !== "Completed" && (
                <DropdownMenuItem onClick={() => handleStatusChange("Completed")}>
                  Mark as Completed
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                Edit Task
              </DropdownMenuItem>
              
              {task.status !== "To Do" && (
                <DropdownMenuItem onClick={() => handleStatusChange("To Do")}>
                  Mark as To Do
                </DropdownMenuItem>
              )}
              
              {task.status !== "In Progress" && (
                <DropdownMenuItem onClick={() => handleStatusChange("In Progress")}>
                  Mark as In Progress
                </DropdownMenuItem>
              )}
              
              {task.status !== "Completed" && (
                <DropdownMenuItem onClick={() => handleStatusChange("Completed")}>
                  Mark as Completed
                </DropdownMenuItem>
              )}
              
              {task.status !== "Not Completed" && (
                <DropdownMenuItem onClick={() => handleStatusChange("Not Completed")}>
                  Mark as Not Completed
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
