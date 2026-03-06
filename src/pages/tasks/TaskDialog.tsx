
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any | null;
  onSave: (task: any) => void;
  isEmployeeView: boolean;
}

const TaskDialog = ({ open, onOpenChange, task, onSave, isEmployeeView }: TaskDialogProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: new Date(),
    assignedTo: "",
  });
  const [comment, setComment] = useState("");
  const [date, setDate] = useState<Date>();
  
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: new Date(task.dueDate),
        assignedTo: task.assignedTo.id.toString(),
      });
      setDate(new Date(task.dueDate));
    } else {
      setFormData({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
        dueDate: new Date(),
        assignedTo: user?.id || "",
      });
      setDate(new Date());
    }
    setComment("");
  }, [task, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormData(prev => ({ ...prev, dueDate: selectedDate }));
    }
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      toast.error("Please enter a query before submitting.");
      return;
    }

    // Here would be API call to add comment
    toast.success("Query submitted successfully.");
    setComment("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...task, ...formData });
    toast.success(`Task ${task ? "updated" : "created"} successfully.`);
  };

  const isFormValid = () => {
    return formData.title && formData.description && formData.status && formData.priority && formData.dueDate;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Task Details" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {task ? "View or update the task details." : "Fill in the details to create a new task."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 md:col-span-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Task title"
                    disabled={isEmployeeView}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Task description"
                    rows={4}
                    disabled={isEmployeeView}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    {!isEmployeeView && (
                      <SelectItem value="Not Completed">Not Completed</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                  disabled={isEmployeeView}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isEmployeeView}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {!isEmployeeView && (
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(value) => handleSelectChange("assignedTo", value)}
                  >
                    <SelectTrigger id="assignedTo">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">John Doe</SelectItem>
                      <SelectItem value="2">Jane Smith</SelectItem>
                      <SelectItem value="3">Emily Brown</SelectItem>
                      <SelectItem value="5">Robert Wilson</SelectItem>
                      <SelectItem value="6">Sarah Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {task && (
                <div className="space-y-2">
                  <Label>Assigned By</Label>
                  <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{task.assignedBy.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{task.assignedBy.name}</span>
                  </div>
                </div>
              )}
            </div>

            {!isEmployeeView && (
              <DialogFooter className="mt-6">
                <Button type="submit" disabled={!isFormValid()}>
                  {task ? "Update Task" : "Create Task"}
                </Button>
              </DialogFooter>
            )}
          </form>

          {task && (
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Query Section
                </h3>
                <Badge variant="outline">
                  {task.comments.length} {task.comments.length === 1 ? "Query/Response" : "Queries/Responses"}
                </Badge>
              </div>

              <div className="space-y-4 max-h-60 overflow-y-auto p-1">
                {task.comments.length > 0 ? (
                  task.comments.map((comment: any) => (
                    <div key={comment.id} className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{comment.user.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.date), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground text-sm py-4">No queries or responses yet.</p>
                )}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask a question about this task..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCommentSubmit} variant="secondary" disabled={!comment.trim()}>
                  Submit Query
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
