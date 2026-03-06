
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
const mockUsers = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", role: "employee", department: "Engineering", position: "Frontend Developer", joinDate: "2025-01-15" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "hr", department: "Human Resources", position: "HR Manager", joinDate: "2024-03-10" },
  { id: 3, name: "Robert Johnson", email: "robert.johnson@example.com", role: "employee", department: "Marketing", position: "Marketing Specialist", joinDate: "2025-02-05" },
  { id: 4, name: "Emily Davis", email: "emily.davis@example.com", role: "employee", department: "Sales", position: "Sales Representative", joinDate: "2025-04-20" },
  { id: 5, name: "Michael Brown", email: "michael.brown@example.com", role: "hr", department: "Human Resources", position: "HR Coordinator", joinDate: "2024-11-12" }
];

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Filter users based on search term and role filter
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  const handleEditUser = (userId: number) => {
    console.log("Edit user:", userId);
    toast.info(`Editing user ${userId}`);
    // In a real application, this would open the edit user dialog
  };
  
  const handleDeleteUser = (userId: number, userName: string) => {
    console.log("Delete user:", userId);
    toast.success(`User ${userName} has been removed`);
    // In a real application, this would show a confirmation dialog before deleting
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">User Management</CardTitle>
        <CardDescription>Manage employees and HR staff</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="employee">Employees</SelectItem>
              <SelectItem value="hr">HR Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden lg:table-cell">Position</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.department}</TableCell>
                  <TableCell className="hidden lg:table-cell">{user.position}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "hr" ? "outline" : "secondary"}
                    >
                      {user.role === "hr" ? "HR" : "Employee"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditUser(user.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            No users found matching your criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;
