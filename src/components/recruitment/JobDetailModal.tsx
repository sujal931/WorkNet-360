
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, MapPin, Calendar, User, Building, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export interface JobDetailProps {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requiredSkills: string[];
  postedDate: string;
  closingDate: string;
  isApplied?: boolean;
}

interface JobDetailModalProps {
  job: JobDetailProps | null;
  isOpen: boolean;
  onClose: () => void;
}

const JobDetailModal = ({ job, isOpen, onClose }: JobDetailModalProps) => {
  const handleApply = () => {
    if (job?.isApplied) {
      toast.info("You've already applied for this position");
    } else {
      toast.success("Application submitted successfully");
      onClose();
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex flex-wrap gap-2 justify-between items-start mb-2">
            <Badge variant="outline" className="bg-primary/10">
              {job.department}
            </Badge>
            <Badge variant="outline">{job.type}</Badge>
          </div>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{job.location}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 py-2 max-h-[60vh]">
          <div className="space-y-6">
            {/* Dates */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  Posted: {format(new Date(job.postedDate), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  Closing: {format(new Date(job.closingDate), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium mb-2">Job Description</h3>
              <p className="text-muted-foreground">{job.description}</p>
            </div>

            {/* Required Skills */}
            <div>
              <h3 className="text-lg font-medium mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/5">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Additional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>Positions: 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  <span>Team: Product Development</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Remote Work: Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>Experience: 2+ years</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-medium mb-2">Benefits</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                <li>Competitive salary package</li>
                <li>Health and dental insurance</li>
                <li>401(k) with company match</li>
                <li>Generous paid time off</li>
                <li>Professional development budget</li>
                <li>Flexible working arrangements</li>
              </ul>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t">
          <Button
            className={job.isApplied ? "bg-green-600 hover:bg-green-700" : ""}
            onClick={handleApply}
            disabled={job.isApplied}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            {job.isApplied ? "Already Applied" : "Apply Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailModal;
