
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Circle, Clock, CheckCircle2, Search, Filter, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import TaskDialog from "@/pages/tasks/TaskDialog";
import TaskCard from "@/pages/tasks/TaskCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock task data
const mockTasks = [
  {
    id: 1,
    title: "Update employee onboarding documentation",
    description: "Review and update the employee onboarding process documentation to reflect the new HR policies.",
    status: "To Do",
    priority: "Medium",
    dueDate: "2025-05-20",
    assignedTo: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com"
    },
    assignedBy: {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com"
    },
    comments: [
      {
        id: 1,
        user: {
          id: 2,
          name: "Jane Smith"
        },
        text: "Please use the new company template for this update.",
        date: "2025-05-10T10:30:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Prepare quarterly financial report",
    description: "Compile Q1 financial data and prepare report for management review.",
    status: "In Progress",
    priority: "High",
    dueDate: "2025-05-15",
    assignedTo: {
      id: 3,
      name: "Emily Brown",
      email: "emily.b@example.com"
    },
    assignedBy: {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com"
    },
    comments: []
  },
  {
    id: 3,
    title: "Interview candidates for developer position",
    description: "Conduct technical interviews for the senior developer position.",
    status: "In Progress",
    priority: "Medium",
    dueDate: "2025-05-18",
    assignedTo: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com"
    },
    assignedBy: {
      id: 4,
      name: "Michael Johnson",
      email: "michael.j@example.com"
    },
    comments: []
  },
  {
    id: 4,
    title: "Deploy application updates",
    description: "Deploy the latest features to production environment after final testing.",
    status: "To Do",
    priority: "High",
    dueDate: "2025-05-25",
    assignedTo: {
      id: 5,
      name: "Robert Wilson",
      email: "robert.w@example.com"
    },
    assignedBy: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com"
    },
    comments: []
  },
  {
    id: 5,
    title: "Review marketing campaign results",
    description: "Analyze the results of the Q1 marketing campaign and prepare summary report.",
    status: "Completed",
    priority: "Medium",
    dueDate: "2025-05-08",
    assignedTo: {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com"
    },
    assignedBy: {
      id: 4,
      name: "Michael Johnson",
      email: "michael.j@example.com"
    },
    comments: [
      {
        id: 2,
        user: {
          id: 2,
          name: "Jane Smith"
        },
        text: "Report completed and sent to management.",
        date: "2025-05-08T16:45:00Z"
      }
    ]
  },
  {
    id: 6,
    title: "Update company website content",
    description: "Refresh the company website with new team members and product information.",
    status: "Completed",
    priority: "Low",
    dueDate: "2025-05-05",
    assignedTo: {
      id: 6,
      name: "Sarah Davis",
      email: "sarah.d@example.com"
    },
    assignedBy: {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com"
    },
    comments: []
  },
  {
    id: 7,
    title: "Submit expense reports",
    description: "Compile and submit all expense reports for the business trip last month.",
    status: "Not Completed",
    priority: "Medium",
    dueDate: "2025-05-01",
    assignedTo: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com"
    },
    assignedBy: {
      id: 4,
      name: "Michael Johnson",
      email: "michael.j@example.com"
    },
    comments: []
  }
];

const Tasks = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [dueDateFilter, setDueDateFilter] = useState<string>("all");
  
  // Filter tasks based on user role, search term, and status
  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Employee can only see their own tasks
    const matchesRole = user?.role === "admin" || user?.role === "hr" || 
      (user?.id && task.assignedTo.id === parseInt(user.id));

    // Filter by priority if set
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    // Filter by due date
    let matchesDueDate = true;
    if (dueDateFilter !== "all") {
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      const diffTime = Math.abs(dueDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (dueDateFilter === "today" && dueDate.toDateString() !== today.toDateString()) {
        matchesDueDate = false;
      } else if (dueDateFilter === "week" && diffDays > 7) {
        matchesDueDate = false;
      } else if (dueDateFilter === "month" && diffDays > 30) {
        matchesDueDate = false;
      }
    }
    
    return matchesSearch && matchesRole && matchesPriority && matchesDueDate;
  });
  
  // Filter tasks based on active tab
  const getFilteredTasksByStatus = () => {
    if (activeTab === "all") return filteredTasks;
    if (activeTab === "todo") return filteredTasks.filter(task => task.status === "To Do");
    if (activeTab === "inprogress") return filteredTasks.filter(task => task.status === "In Progress");
    if (activeTab === "completed") return filteredTasks.filter(task => task.status === "Completed");
    if (activeTab === "notcompleted") return filteredTasks.filter(task => task.status === "Not Completed");
    return filteredTasks;
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleViewTask = (task: any) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };
  
  const handleTaskSave = (task: any) => {
    // Here would be API call to save task
    setIsDialogOpen(false);
  };
  
  const tasksToDisplay = getFilteredTasksByStatus();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your tasks
          </p>
        </div>
        
        {(user?.role === "admin" || user?.role === "hr") && (
          <Button
            onClick={() => {
              setSelectedTask(null);
              setIsDialogOpen(true);
            }}
            className="btn-gradient"
          >
            Add Task
          </Button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-5 w-full md:w-[500px]">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="todo">
              <Circle className="mr-1 h-4 w-4" />
              To Do
            </TabsTrigger>
            <TabsTrigger value="inprogress">
              <Clock className="mr-1 h-4 w-4" />
              In Progress
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="notcompleted">
              <AlertCircle className="mr-1 h-4 w-4" />
              Not Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>Priority</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dueDateFilter} onValueChange={setDueDateFilter}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>Due Date</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Due Today</SelectItem>
              <SelectItem value="week">Due This Week</SelectItem>
              <SelectItem value="month">Due This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasksToDisplay.length > 0 ? (
          tasksToDisplay.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={() => handleViewTask(task)} 
              isEmployeeView={user?.role === "employee"}
            />
          ))
        ) : (
          <Card className="col-span-full p-6 text-center text-muted-foreground">
            <p>No tasks found. {searchTerm ? "Try a different search term." : activeTab !== "all" ? "Try a different filter." : ""}</p>
          </Card>
        )}
      </div>
      
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
        onSave={handleTaskSave}
        isEmployeeView={user?.role === "employee"}
      />
    </div>
  );
};

export default Tasks;
