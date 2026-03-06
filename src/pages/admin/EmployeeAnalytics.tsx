
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data for analytics
const departmentData = [
  { name: "Engineering", employees: 18, tasks: 45, completedTasks: 32 },
  { name: "Marketing", employees: 8, tasks: 26, completedTasks: 21 },
  { name: "Sales", employees: 12, tasks: 38, completedTasks: 29 },
  { name: "Human Resources", employees: 5, tasks: 15, completedTasks: 13 },
  { name: "Finance", employees: 7, tasks: 22, completedTasks: 18 },
];

const taskCompletionData = [
  { name: "Jan", completed: 65, assigned: 85 },
  { name: "Feb", completed: 78, assigned: 95 },
  { name: "Mar", completed: 82, assigned: 92 },
  { name: "Apr", completed: 74, assigned: 90 },
  { name: "May", completed: 80, assigned: 95 },
];

const leaveData = [
  { name: "Sick Leave", value: 15 },
  { name: "Vacation", value: 32 },
  { name: "Personal", value: 8 },
  { name: "Bereavement", value: 3 },
  { name: "Other", value: 5 },
];

const EmployeeAnalytics = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Employee Analytics</h1>
        <p className="text-muted-foreground">Comprehensive statistics and analytics</p>
      </div>

      <Tabs defaultValue="department">
        <TabsList className="mb-4">
          <TabsTrigger value="department">Department Analytics</TabsTrigger>
          <TabsTrigger value="tasks">Task Statistics</TabsTrigger>
          <TabsTrigger value="leaves">Leave Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="department">
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Employees and tasks by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="employees" name="Employees" fill="#8884d8" />
                    <Bar dataKey="tasks" name="Assigned Tasks" fill="#82ca9d" />
                    <Bar dataKey="completedTasks" name="Completed Tasks" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
              <CardDescription>Monthly tasks assigned vs. completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={taskCompletionData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="assigned" name="Tasks Assigned" fill="#8884d8" />
                    <Bar dataKey="completed" name="Tasks Completed" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves">
          <Card>
            <CardHeader>
              <CardTitle>Leave Distribution</CardTitle>
              <CardDescription>Types of leaves taken by employees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={leaveData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Days" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeAnalytics;
