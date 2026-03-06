
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

interface PendingEmployeeDetailsProps {
  employee: any;
  onApprove: (employeeId: string, details: any) => void;
}

const PendingEmployeeDetails = ({ employee, onApprove }: PendingEmployeeDetailsProps) => {
  const [joinDate, setJoinDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<string>("active");
  const [department, setDepartment] = useState<string>(employee.department || "");
  const [position, setPosition] = useState<string>(employee.position || "");
  const [workLocation, setWorkLocation] = useState<string>("onsite");
  const [manager, setManager] = useState<string>("");
  
  const [isFormComplete, setIsFormComplete] = useState<boolean>(false);
  
  // Check if form is complete when values change
  useState(() => {
    const requiredFieldsFilled = department && position;
    setIsFormComplete(!!requiredFieldsFilled);
  });
  
  const handleApprove = () => {
    const employmentDetails = {
      joinDate,
      status,
      department,
      position,
      workLocation,
      manager
    };
    
    onApprove(employee.id, employmentDetails);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Employment Details</CardTitle>
        <CardDescription>
          Fill employment details to approve {employee.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <Select value={department} onValueChange={setDepartment}>
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
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleApprove}
          disabled={!isFormComplete}
        >
          Approve Employee
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingEmployeeDetails;
