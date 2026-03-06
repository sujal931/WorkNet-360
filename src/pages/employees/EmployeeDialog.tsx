
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: any;
  onSave?: (employee: any) => void;
  viewOnly?: boolean;
}

const EmployeeDialog = ({
  open,
  onOpenChange,
  employee,
  onSave,
  viewOnly = false,
}: EmployeeDialogProps) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    position: "",
    status: "Active",
    joinDate: "",
    phoneNumber: "",
    address: "",
    emergencyContact: "",
    notes: "",
    salary: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        id: employee.id || "",
        name: employee.name || "",
        email: employee.email || "",
        department: employee.department || "",
        position: employee.position || "",
        status: employee.status || "Active",
        joinDate: employee.joinDate || "",
        phoneNumber: employee.phoneNumber || "",
        address: employee.address || "",
        emergencyContact: employee.emergencyContact || "",
        notes: employee.notes || "",
        salary: employee.salary || "",
      });
    } else {
      // Reset form for new employee
      setFormData({
        id: "",
        name: "",
        email: "",
        department: "",
        position: "",
        status: "Active",
        joinDate: new Date().toISOString().slice(0, 10),
        phoneNumber: "",
        address: "",
        emergencyContact: "",
        notes: "",
        salary: "",
      });
    }
  }, [employee, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {viewOnly
              ? "Employee Details"
              : employee
              ? "Edit Employee"
              : "Add New Employee"}
          </DialogTitle>
          <DialogDescription>
            {viewOnly
              ? "View employee details and information."
              : "Fill in the employee information. All fields marked with * are required."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-4 grid grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              {viewOnly && (
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {getInitials(formData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{formData.name}</h3>
                    <p className="text-muted-foreground">{formData.position}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name {!viewOnly && "*"}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    readOnly={viewOnly}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address {!viewOnly && "*"}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    readOnly={viewOnly}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department {!viewOnly && "*"}</Label>
                  {viewOnly ? (
                    <Input
                      id="department"
                      value={formData.department}
                      readOnly
                    />
                  ) : (
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleSelectChange("department", value)}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Customer Support">Customer Support</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Position {!viewOnly && "*"}</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    readOnly={viewOnly}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    readOnly={viewOnly}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    readOnly={viewOnly}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  readOnly={viewOnly}
                  rows={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="employment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Employment Status {!viewOnly && "*"}</Label>
                  {viewOnly ? (
                    <Input
                      id="status"
                      value={formData.status}
                      readOnly
                    />
                  ) : (
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date {!viewOnly && "*"}</Label>
                  <Input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    required
                    readOnly={viewOnly}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={handleInputChange}
                    readOnly={viewOnly}
                    placeholder="Annual salary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  readOnly={viewOnly}
                  rows={3}
                  placeholder="Additional information about the employee"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            {!viewOnly && (
              <Button type="submit" className="btn-gradient">
                {employee ? "Update Employee" : "Add Employee"}
              </Button>
            )}
            {viewOnly && (
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
