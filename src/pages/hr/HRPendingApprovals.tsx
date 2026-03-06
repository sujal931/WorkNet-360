
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, User, CalendarDays, Briefcase, Building } from "lucide-react";
import { format } from "date-fns";

// Mock data for pending approvals
const mockPendingUsers = [
  {
    id: 1,
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    gender: "Female",
    phoneNumber: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    appliedDate: "2025-05-10",
    employmentInfoComplete: false,
    profileImage: ""
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "michael.b@example.com",
    gender: "Male",
    phoneNumber: "+1 (555) 234-5678",
    dateOfBirth: "1985-08-22",
    appliedDate: "2025-05-11",
    employmentInfoComplete: false,
    profileImage: ""
  },
  {
    id: 3,
    name: "Jessica Lee",
    email: "jessica.l@example.com",
    gender: "Female",
    phoneNumber: "+1 (555) 345-6789",
    dateOfBirth: "1992-11-30",
    appliedDate: "2025-05-12",
    employmentInfoComplete: true,
    profileImage: "",
    employmentInfo: {
      employeeId: "EMP-2025-003",
      department: "Marketing",
      position: "Content Specialist",
      joinDate: "2025-06-01",
      workLocation: "Remote"
    }
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.w@example.com",
    gender: "Male",
    phoneNumber: "+1 (555) 456-7890",
    dateOfBirth: "1988-03-17",
    appliedDate: "2025-05-13",
    employmentInfoComplete: false,
    profileImage: ""
  },
  {
    id: 5,
    name: "Emily Johnson",
    email: "emily.j@example.com",
    gender: "Female",
    phoneNumber: "+1 (555) 567-8901",
    dateOfBirth: "1993-07-09",
    appliedDate: "2025-05-14",
    employmentInfoComplete: true,
    profileImage: "",
    employmentInfo: {
      employeeId: "EMP-2025-005",
      department: "Sales",
      position: "Sales Representative",
      joinDate: "2025-06-01",
      workLocation: "Hybrid"
    }
  }
];

const HRPendingApprovals = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Filter users based on search term and filter status
  const filteredUsers = mockPendingUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "incomplete") return matchesSearch && !user.employmentInfoComplete;
    if (filterStatus === "complete") return matchesSearch && user.employmentInfoComplete;
    
    return matchesSearch;
  });
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleComplete = (userId: number) => {
    navigate(`/hr/pending-approvals/${userId}`);
  };
  
  const handleApprove = (userId: number) => {
    // In a real app, this would make an API call to approve the user
    console.log(`Approving user with ID: ${userId}`);
    // Then refresh the list or update state
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pending Approvals</h1>
        <p className="text-muted-foreground">
          Complete employment information and approve new users
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs 
          value={filterStatus} 
          onValueChange={setFilterStatus}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="incomplete">Needs Info</TabsTrigger>
            <TabsTrigger value="complete">Ready to Approve</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending User Approvals</CardTitle>
          <CardDescription>
            Review and complete the employment information for these users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <div className="space-y-6">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{user.name}</h3>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>Applied: {format(new Date(user.appliedDate), "MMMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-3 md:items-center">
                    {user.employmentInfoComplete ? (
                      <>
                        <div className="flex flex-col text-sm mr-4">
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{user.employmentInfo?.position}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{user.employmentInfo?.department}</span>
                          </div>
                        </div>
                        <Badge className="mr-2 max-w-fit">Ready to Approve</Badge>
                        <Button onClick={() => handleApprove(user.id)}>
                          Approve User
                        </Button>
                      </>
                    ) : (
                      <>
                        <Badge variant="outline" className="mr-2 max-w-fit">Employment Info Needed</Badge>
                        <Button onClick={() => handleComplete(user.id)}>
                          Complete Info
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No matching users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HRPendingApprovals;
