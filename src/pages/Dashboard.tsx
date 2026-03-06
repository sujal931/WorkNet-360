
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { ChevronRight, Users, Clock, Briefcase, CheckCircle, CalendarDays, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfMonth } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import StatCard from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockEmployeeData = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    department: "Engineering",
    role: "Frontend Developer",
    avatar: ""
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    department: "Marketing",
    role: "Marketing Specialist",
    avatar: ""
  },
  {
    id: 3,
    name: "Charlie Davis",
    email: "charlie@example.com",
    department: "HR",
    role: "HR Manager",
    avatar: ""
  },
];

const mockJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engineering",
    applications: 12,
    status: "Open"
  },
  {
    id: 2,
    title: "Marketing Specialist",
    department: "Marketing",
    applications: 8,
    status: "Open"
  },
];

const mockAttendance = [
  { day: 'Mon', present: 45, absent: 5 },
  { day: 'Tue', present: 47, absent: 3 },
  { day: 'Wed', present: 44, absent: 6 },
  { day: 'Thu', present: 48, absent: 2 },
  { day: 'Fri', present: 46, absent: 4 },
];

const mockTasks = [
  {
    id: 1,
    title: "Review project proposal",
    assignedTo: "Alice Johnson",
    priority: "High",
    status: "In Progress",
    dueDate: "2025-05-20"
  },
  {
    id: 2,
    title: "Prepare quarterly report",
    assignedTo: "Bob Smith",
    priority: "Medium",
    status: "Todo",
    dueDate: "2025-05-25"
  },
];

const mockLeaveRequests = [
  {
    id: 1,
    employee: "Charlie Davis",
    type: "Vacation",
    startDate: "2025-05-18",
    endDate: "2025-05-22",
    status: "Pending"
  },
  {
    id: 2,
    employee: "Alice Johnson",
    type: "Sick",
    startDate: "2025-05-15",
    endDate: "2025-05-16",
    status: "Approved"
  },
];

const mockEmployeeAttendance = [
  { date: '2025-05-01', status: 'present', time: '8:55 AM - 5:05 PM' },
  { date: '2025-05-02', status: 'present', time: '9:00 AM - 5:00 PM' },
  { date: '2025-05-03', status: 'weekend', time: '-' },
  { date: '2025-05-04', status: 'weekend', time: '-' },
  { date: '2025-05-05', status: 'present', time: '8:45 AM - 5:15 PM' },
  { date: '2025-05-06', status: 'present', time: '9:00 AM - 5:00 PM' },
  { date: '2025-05-07', status: 'present', time: '8:50 AM - 5:10 PM' },
];

const mockEmployeeTasks = [
  { id: 1, title: 'Complete project proposal', priority: 'High', dueDate: '2025-05-20', status: 'In Progress' },
  { id: 2, title: 'Submit monthly report', priority: 'Medium', dueDate: '2025-05-15', status: 'To Do' },
  { id: 3, title: 'Team meeting notes', priority: 'Low', dueDate: '2025-05-10', status: 'Completed' },
  { id: 4, title: 'Review code changes', priority: 'High', dueDate: '2025-05-18', status: 'In Progress' },
  { id: 5, title: 'Update documentation', priority: 'Medium', dueDate: '2025-05-22', status: 'To Do' },
];

const mockEmployeeLeave = [
  { id: 1, type: 'Vacation', startDate: '2025-06-10', endDate: '2025-06-15', status: 'Pending' },
  { id: 2, type: 'Sick Leave', startDate: '2025-05-03', endDate: '2025-05-04', status: 'Approved' },
  { id: 3, type: 'Personal Leave', startDate: '2025-07-15', endDate: '2025-07-16', status: 'Rejected' },
];

const mockInternalJobs = [
  { id: 1, title: "Senior Software Engineer", department: "Engineering", location: "Remote" },
  { id: 2, title: "Marketing Specialist", department: "Marketing", location: "New York" },
  { id: 3, title: "HR Manager", department: "Human Resources", location: "Chicago" },
];

const mockPayrollInfo = {
  status: "Processed",
  lastPayDate: "2025-04-30",
  nextPayDate: "2025-05-31",
  amount: "$4,250.00"
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const isEmployee = user?.role === "employee";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isEmployee) {
    // Get count of completed tasks
    const completedTasksCount = mockEmployeeTasks.filter(task => task.status === "Completed").length;
    // Get count of approved leaves
    const approvedLeavesCount = mockEmployeeLeave.filter(leave => leave.status === "Approved").length;
    // Count of internal job opportunities
    const internalJobsCount = mockInternalJobs.length;

    // Employee Dashboard View
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "User"}
          </p>
        </div>
      
        {/* Row 1: Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{mockEmployeeTasks.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Assigned to you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Tasks Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{completedTasksCount}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {completedTasksCount > 0 
                  ? `${Math.round((completedTasksCount / mockEmployeeTasks.length) * 100)}% completion rate`
                  : "No tasks completed yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-500" />
                Leaves Taken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{approvedLeavesCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Approved leaves this year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" />
                Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">95%</p>
              <p className="text-sm text-muted-foreground mt-1">Monthly attendance rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Functional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Your recent task assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockEmployeeTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="p-2 border rounded-md hover:bg-muted/50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{task.title}</span>
                      <Badge
                        variant={
                          task.priority === "High"
                            ? "destructive"
                            : task.priority === "Medium"
                            ? "default"
                            : "outline"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Due: {format(new Date(task.dueDate), "MMM d")}</span>
                      <Badge
                        variant={
                          task.status === "Completed"
                            ? "outline"
                            : task.status === "In Progress"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => navigate("/tasks")}
              >
                View All Tasks
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>Status of your leave applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {mockEmployeeLeave.map(leave => (
                  <div key={leave.id} className="p-2 border rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{leave.type}</span>
                      <Badge
                        variant={
                          leave.status === "Approved"
                            ? "outline"
                            : leave.status === "Pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {leave.status}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(leave.startDate), "MMM d")} - {format(new Date(leave.endDate), "MMM d")}
                    </span>
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate("/leave/history")}
              >
                View Leave History
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Utility Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Internal Job Opportunities</CardTitle>
              <CardDescription>Open positions you can apply for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="text-3xl font-bold mb-2">{internalJobsCount}</div>
                <p className="text-center mb-4">openings available across the organization</p>
                <Button 
                  onClick={() => navigate("/recruitment/internal-jobs")}
                  className="w-full sm:w-auto"
                >
                  Browse Job Openings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Payroll Status</CardTitle>
              <CardDescription>Your salary payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={mockPayrollInfo.status === "Processed" ? "outline" : "secondary"}>
                    {mockPayrollInfo.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Payment:</span>
                  <span>{format(new Date(mockPayrollInfo.lastPayDate), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Next Payment:</span>
                  <span>{format(new Date(mockPayrollInfo.nextPayDate), "MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-bold">{mockPayrollInfo.amount}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate("/payroll")}
                >
                  View Payroll History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Admin/HR Dashboard View
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "User"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Employees"
          value="50"
          description="Total employees"
          changeValue="+2 this month"
          changeType="increase"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Attendance"
          value="95%"
          description="Average attendance"
          changeValue="+2% from last month"
          changeType="increase"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          title="Open Positions"
          value="8"
          description="Job openings"
          changeValue="+3 this week"
          changeType="increase"
          icon={<Briefcase className="h-4 w-4" />}
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest updates across the organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                    <p className="text-sm">
                      New employee <span className="font-medium">John Doe</span> joined the
                      Design team
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                    <p className="text-sm">
                      <span className="font-medium">Project X</span> deadline updated to
                      June 15
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                    <p className="text-sm">
                      <span className="font-medium">Q2 Review</span> meeting scheduled for
                      next week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Calendar</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {format(date, "MMMM yyyy")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>
                  Daily attendance for the current week
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mockAttendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#4ade80" name="Present" />
                    <Bar dataKey="absent" fill="#f87171" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Pending Leave Requests</CardTitle>
                  <CardDescription>
                    Requests awaiting approval
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/leave/requests")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                {mockLeaveRequests
                  .filter((request) => request.status === "Pending")
                  .map((request) => (
                    <div
                      key={request.id}
                      className="mb-4 grid grid-cols-[25px_1fr] items-start last:mb-0"
                    >
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-yellow-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {request.employee}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.type} leave: {format(new Date(request.startDate), "MMM d")} -{" "}
                          {format(new Date(request.endDate), "MMM d")}
                        </p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Employees</CardTitle>
                <CardDescription>Manage your team members</CardDescription>
              </div>
              <Button onClick={() => navigate("/employees")}>View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEmployeeData.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{employee.role}</p>
                      <p className="text-sm text-muted-foreground">{employee.department}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Recent tasks and their status</CardDescription>
              </div>
              <Button onClick={() => navigate("/tasks")}>View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{task.title}</h3>
                      <Badge
                        variant={
                          task.priority === "High"
                            ? "destructive"
                            : task.priority === "Medium"
                            ? "default"
                            : "outline"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Assigned to: {task.assignedTo}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <Badge
                          variant={
                            task.status === "Completed"
                              ? "outline"
                              : task.status === "In Progress"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground">
                        Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recruitment">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Recent Job Postings</CardTitle>
                <CardDescription>Active job openings</CardDescription>
              </div>
              <Button onClick={() => navigate("/recruitment/jobs")}>Manage Jobs</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.department}
                        </p>
                      </div>
                      <Badge>{job.status}</Badge>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center text-sm">
                      <span>Applications: {job.applications || 0}</span>
                      <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/recruitment/applications")}>
                        View <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
