
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MoreHorizontal, 
  Search, 
  UserPlus, 
  FileText, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import EmployeeDialog from "@/pages/employees/EmployeeDialog";

// Mock data for employees
const mockEmployees = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Engineering",
    position: "Senior Developer",
    status: "Active",
    joinDate: "2023-01-15"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Marketing",
    position: "Marketing Manager",
    status: "Active",
    joinDate: "2022-11-05"
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@example.com",
    department: "Human Resources",
    position: "HR Specialist",
    status: "Active",
    joinDate: "2023-03-22"
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily.b@example.com",
    department: "Finance",
    position: "Financial Analyst",
    status: "Active",
    joinDate: "2022-08-10"
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert.w@example.com",
    department: "Operations",
    position: "Operations Manager",
    status: "On Leave",
    joinDate: "2023-02-01"
  },
  {
    id: 6,
    name: "Sarah Davis",
    email: "sarah.d@example.com",
    department: "Engineering",
    position: "QA Engineer",
    status: "Active",
    joinDate: "2023-04-18"
  },
  {
    id: 7,
    name: "Thomas Miller",
    email: "thomas.m@example.com",
    department: "Sales",
    position: "Sales Executive",
    status: "Active",
    joinDate: "2022-09-30"
  },
  {
    id: 8,
    name: "Jennifer Taylor",
    email: "jennifer.t@example.com",
    department: "Customer Support",
    position: "Support Specialist",
    status: "Inactive",
    joinDate: "2021-12-05"
  }
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  const itemsPerPage = 5;
  
  // Filter employees based on search term
  const filteredEmployees = mockEmployees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Paginate employees
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };
  
  const handleEditEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsAddDialogOpen(true);
  };
  
  const handleDeleteEmployee = (id: number) => {
    toast.success(`Employee with ID ${id} deleted successfully`);
  };
  
  const handleAddSaveEmployee = (employee: any) => {
    toast.success(employee.id ? "Employee updated successfully" : "Employee added successfully");
    setIsAddDialogOpen(false);
  };
  
  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  // Helper function to get badge variant based on status
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "On Leave":
        return "secondary"; // Changed from "warning" to "secondary"
      case "Inactive":
        return "outline";
      default:
        return "outline";
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage your company's employees
          </p>
        </div>
        
        <Button 
          onClick={() => {
            setSelectedEmployee(null);
            setIsAddDialogOpen(true);
          }}
          className="btn-gradient"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
      
      <Card className="card-gradient">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Employee Directory</CardTitle>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-8 w-full sm:w-[260px]"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Position</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {currentEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.position}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={getStatusVariant(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewEmployee(employee)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {currentEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No employees found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end mt-4 gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center text-sm">
                Page {currentPage} of {totalPages}
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Employee Add/Edit Dialog */}
      <EmployeeDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        employee={selectedEmployee}
        onSave={handleAddSaveEmployee}
      />
      
      {/* Employee View Dialog */}
      <EmployeeDialog 
        open={isViewDialogOpen} 
        onOpenChange={setIsViewDialogOpen}
        employee={selectedEmployee}
        viewOnly
      />
    </div>
  );
};

export default Employees;
