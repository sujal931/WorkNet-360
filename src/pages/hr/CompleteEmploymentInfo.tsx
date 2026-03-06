
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data for a pending user
const getMockUserById = (id: string) => {
  return {
    id: parseInt(id),
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    gender: "Female",
    phoneNumber: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    appliedDate: "2025-05-10",
    status: "pending",
    profileImage: ""
  };
};

// Mock departments and managers for dropdowns
const mockDepartments = ["Engineering", "Marketing", "Sales", "Human Resources", "Finance", "Operations"];
const mockManagers = [
  { id: 1, name: "John Doe", department: "Engineering" },
  { id: 2, name: "Jane Smith", department: "Marketing" },
  { id: 3, name: "Michael Johnson", department: "Sales" },
  { id: 4, name: "Emily Davis", department: "Human Resources" },
  { id: 5, name: "Robert Wilson", department: "Finance" },
  { id: 6, name: "Lisa Brown", department: "Operations" }
];

const CompleteEmploymentInfo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Get user data - in a real app this would be from an API call
  const userData = id ? getMockUserById(id) : null;
  
  // Form state
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [joinDate, setJoinDate] = useState<Date | undefined>(new Date());
  const [workLocation, setWorkLocation] = useState("Onsite");
  const [manager, setManager] = useState("");
  
  // Filtered managers based on department selection
  const filteredManagers = department 
    ? mockManagers.filter(m => m.department === department)
    : mockManagers;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - ensure all required fields are filled
    if (!employeeId || !department || !position || !joinDate || !workLocation || !manager) {
      alert("Please fill all required fields");
      return;
    }
    
    // In a real app, this would make an API call to update the user's employment info
    console.log("Submitting employment information:", {
      userId: id,
      employeeId,
      department,
      position,
      joinDate,
      workLocation,
      manager
    });
    
    // Navigate back to the pending approvals page
    navigate("/hr/pending-approvals");
  };
  
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  if (!userData) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p>User not found</p>
        <Button onClick={() => navigate("/hr/pending-approvals")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pending Approvals
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/hr/pending-approvals")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Pending Approvals
      </Button>
      
      <div>
        <h1 className="text-3xl font-bold">Complete Employment Information</h1>
        <p className="text-muted-foreground">
          Fill in the required employment details to approve this user
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userData.profileImage} alt={userData.name} />
              <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{userData.name}</CardTitle>
              <CardDescription className="text-base">{userData.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  placeholder="EMP-2025-001"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={department}
                  onValueChange={setDepartment}
                  required
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  placeholder="Job position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !joinDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {joinDate ? format(joinDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={joinDate}
                      onSelect={setJoinDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workLocation">Work Location</Label>
                <Select
                  value={workLocation}
                  onValueChange={setWorkLocation}
                  required
                >
                  <SelectTrigger id="workLocation">
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manager">Reporting Manager</Label>
                <Select
                  value={manager}
                  onValueChange={setManager}
                  required
                  disabled={!department}
                >
                  <SelectTrigger id="manager">
                    <SelectValue placeholder={!department ? "Select department first" : "Select manager"} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredManagers.map((mgr) => (
                      <SelectItem key={mgr.id} value={mgr.name}>
                        {mgr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col space-y-2">
              <Button type="submit" size="lg">
                Save and Approve User
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/hr/pending-approvals")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteEmploymentInfo;
