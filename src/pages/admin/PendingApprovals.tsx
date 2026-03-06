
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Mock pending registrations data
const mockPendingRegistrations = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    registrationDate: "2025-05-12",
    gender: "male",
    phoneNumber: "555-1234",
    dateOfBirth: "1990-05-15",
    profileImage: "https://ui-avatars.com/api/?name=John+Smith&background=0F62FE&color=fff"
  },
  {
    id: 2,
    name: "Sara Johnson",
    email: "sara.johnson@example.com",
    registrationDate: "2025-05-14",
    gender: "female",
    phoneNumber: "555-5678",
    dateOfBirth: "1988-07-22",
    profileImage: "https://ui-avatars.com/api/?name=Sara+Johnson&background=0F62FE&color=fff"
  },
  {
    id: 3,
    name: "Michael Wong",
    email: "michael.wong@example.com",
    registrationDate: "2025-05-14",
    gender: "male",
    phoneNumber: "555-9012",
    dateOfBirth: "1992-03-10",
    profileImage: "https://ui-avatars.com/api/?name=Michael+Wong&background=0F62FE&color=fff"
  }
];

const PendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState(mockPendingRegistrations);

  const approveUser = (userId: number, role: string, employmentDetails: any) => {
    console.log(`Approving user ${userId} with role ${role}`, employmentDetails);
    
    // In a real app, this would be an API call
    // For now, we'll just remove from the pending list
    setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    
    toast.success("User approved successfully!");
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Pending Approvals</h1>
      
      {pendingUsers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium">No pending approvals</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                All user registrations have been processed.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingUsers.map((user) => (
            <Card key={user.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Registered on {new Date(user.registrationDate).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Gender:</span>
                    <div className="mt-1">{user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                    <div className="mt-1">{user.phoneNumber}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Date of Birth:</span>
                    <div className="mt-1">{new Date(user.dateOfBirth).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Process Application</Button>
                  </DialogTrigger>
                  <ApprovalDialog user={user} onApprove={approveUser} />
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

interface ApprovalDialogProps {
  user: any;
  onApprove: (userId: number, role: string, employmentDetails: any) => void;
}

const ApprovalDialog = ({ user, onApprove }: ApprovalDialogProps) => {
  const [role, setRole] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [joinDate, setJoinDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<string>("active");
  const [department, setDepartment] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [workLocation, setWorkLocation] = useState<string>("onsite");
  const [manager, setManager] = useState<string>("");
  
  const [isFormComplete, setIsFormComplete] = useState<boolean>(false);
  
  // Check if form is complete when values change
  useState(() => {
    const requiredFieldsFilled = role && employeeId && department && position;
    setIsFormComplete(!!requiredFieldsFilled);
  });
  
  const handleApprove = () => {
    const employmentDetails = {
      employeeId,
      joinDate,
      status,
      department,
      position,
      workLocation,
      manager
    };
    
    onApprove(user.id, role, employmentDetails);
  };
  
  return (
    <DialogContent className="sm:max-w-md md:max-w-lg">
      <DialogHeader>
        <DialogTitle>Approve User: {user.name}</DialogTitle>
        <DialogDescription>
          Assign a role and provide employment details to approve this user.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="role">Assign Role <span className="text-red-500">*</span></Label>
            <Select onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hr">HR Manager</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID <span className="text-red-500">*</span></Label>
            <Input
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="EMP-12345"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="joinDate">Join Date</Label>
            <Input
              id="joinDate"
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Employment Status</Label>
            <Select defaultValue={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="probation">Probation</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
            <Select onValueChange={setDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Position <span className="text-red-500">*</span></Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Software Developer"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workLocation">Work Location</Label>
            <Select defaultValue={workLocation} onValueChange={setWorkLocation}>
              <SelectTrigger id="workLocation">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="manager">Reporting Manager</Label>
            <Input
              id="manager"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              placeholder="Manager name"
            />
          </div>
        </div>
      </div>
      
      <DialogFooter className="sm:justify-between">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button 
          type="button" 
          onClick={handleApprove} 
          disabled={!isFormComplete}
          className={!isFormComplete ? "opacity-50 cursor-not-allowed" : ""}
        >
          Approve User
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default PendingApprovals;
