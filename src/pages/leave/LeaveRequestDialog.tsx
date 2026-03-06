
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface LeaveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: any;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

const LeaveRequestDialog = ({
  open,
  onOpenChange,
  request,
  onApprove,
  onReject,
}: LeaveRequestDialogProps) => {
  if (!request) return null;
  
  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline">Pending</Badge>;
      case "Approved":
        return <Badge variant="default">Approved</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(request.employee.name)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium text-lg">{request.employee.name}</h3>
              <p className="text-sm text-muted-foreground">{request.employee.department}</p>
            </div>
            
            <div className="ml-auto">
              {getStatusBadge(request.status)}
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Leave Type</p>
              <p className="font-medium">{request.leaveType}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{request.days} day{request.days !== 1 ? 's' : ''}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium">{format(request.startDate, "MMMM d, yyyy")}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{format(request.endDate, "MMMM d, yyyy")}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Applied On</p>
              <p className="font-medium">{format(request.appliedDate, "MMMM d, yyyy")}</p>
            </div>
            
            {request.status !== "Pending" && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {request.status === "Approved" ? "Approved" : "Rejected"} On
                </p>
                <p className="font-medium">
                  {request.approvedDate ? format(request.approvedDate, "MMMM d, yyyy") : "N/A"}
                </p>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Reason for Leave</p>
            <p>{request.reason}</p>
          </div>
          
          {request.status === "Rejected" && request.rejectionReason && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rejection Reason</p>
              <p>{request.rejectionReason}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestDialog;
