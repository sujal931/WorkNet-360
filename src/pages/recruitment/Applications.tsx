import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Download,
  FileText,
  Phone,
  Mail,
  Calendar,
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

// Types
type ApplicationStatus = "Applied" | "Screening" | "Interview" | "Offered" | "Hired" | "Rejected";

type Application = {
  id: number;
  job: {
    id: number;
    title: string;
    department: string;
  };
  applicant: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  resumeUrl: string;
  status: ApplicationStatus;
  isInternalApplicant: boolean;
  notes: {
    text: string;
    by: string;
    date: string;
  }[];
  appliedDate: string;
};

// Mock application data
const initialApplications: Application[] = [
  {
    id: 1,
    job: {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
    },
    applicant: {
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "555-123-4567",
      avatar: "",
    },
    resumeUrl: "#",
    status: "Screening",
    isInternalApplicant: false,
    notes: [
      {
        text: "Strong technical skills, good fit for the team.",
        by: "Sarah Miller",
        date: "2025-05-10"
      }
    ],
    appliedDate: "2025-05-05"
  },
  {
    id: 2,
    job: {
      id: 2,
      title: "Product Manager",
      department: "Product",
    },
    applicant: {
      name: "Emma Davis",
      email: "emma@example.com",
      phone: "555-987-6543",
      avatar: "",
    },
    resumeUrl: "#",
    status: "Interview",
    isInternalApplicant: true,
    notes: [
      {
        text: "Currently working in Marketing, looking for career transition.",
        by: "Sarah Miller",
        date: "2025-05-08"
      }
    ],
    appliedDate: "2025-05-02"
  },
  {
    id: 3,
    job: {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
    },
    applicant: {
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "555-456-7890",
      avatar: "",
    },
    resumeUrl: "#",
    status: "Applied",
    isInternalApplicant: false,
    notes: [],
    appliedDate: "2025-05-11"
  },
  {
    id: 4,
    job: {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
    },
    applicant: {
      name: "Jessica Wilson",
      email: "jessica@example.com",
      phone: "555-789-0123",
      avatar: "",
    },
    resumeUrl: "#",
    status: "Interview",
    isInternalApplicant: false,
    notes: [
      {
        text: "Excellent communication skills, scheduled for technical interview.",
        by: "Robert Chen",
        date: "2025-05-09"
      }
    ],
    appliedDate: "2025-05-04"
  },
  {
    id: 5,
    job: {
      id: 5,
      title: "DevOps Engineer",
      department: "Engineering",
    },
    applicant: {
      name: "David Kim",
      email: "david@example.com",
      phone: "555-234-5678",
      avatar: "",
    },
    resumeUrl: "#",
    status: "Rejected",
    isInternalApplicant: false,
    notes: [
      {
        text: "Lacks required experience with Kubernetes.",
        by: "Robert Chen",
        date: "2025-05-07"
      }
    ],
    appliedDate: "2025-05-01"
  }
];

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterJob, setFilterJob] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [newNote, setNewNote] = useState("");
  const [newStatus, setNewStatus] = useState<ApplicationStatus | "">("");
  
  // Get unique jobs for filtering
  const uniqueJobs = Array.from(new Set(applications.map(app => app.job.id)))
    .map(id => {
      const app = applications.find(a => a.job.id === id);
      return app ? { id: app.job.id, title: app.job.title } : null;
    })
    .filter(Boolean) as { id: number; title: string }[];
  
  const handleOpenDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailsOpen(true);
    setActiveTab("details");
    setNewStatus("");
  };
  
  const handleAddNote = () => {
    if (!newNote.trim() || !selectedApplication) return;
    
    const updatedApplications = applications.map(app => {
      if (app.id === selectedApplication.id) {
        return {
          ...app,
          notes: [
            ...app.notes,
            {
              text: newNote,
              by: "Sarah Miller", // Normally would be the current user
              date: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return app;
    });
    
    setApplications(updatedApplications);
    setNewNote("");
    
    // Update the selected application with the new note
    const updatedApp = updatedApplications.find(app => app.id === selectedApplication.id);
    if (updatedApp) {
      setSelectedApplication(updatedApp);
    }
    
    toast.success("Note added successfully");
  };
  
  const handleStatusChange = () => {
    if (!newStatus || !selectedApplication) return;
    
    const updatedApplications = applications.map(app => {
      if (app.id === selectedApplication.id) {
        return {
          ...app,
          status: newStatus as ApplicationStatus
        };
      }
      return app;
    });
    
    setApplications(updatedApplications);
    
    // Update the selected application with the new status
    const updatedApp = updatedApplications.find(app => app.id === selectedApplication.id);
    if (updatedApp) {
      setSelectedApplication(updatedApp);
    }
    
    toast.success(`Status updated to ${newStatus}`);
    setNewStatus("");
  };
  
  // Filter applications
  const filteredApplications = applications
    .filter(app => 
      app.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(app => filterStatus === "all" || app.status === filterStatus)
    .filter(app => filterJob === "all" || app.job.id === parseInt(filterJob));
  
  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "Applied":
        return "bg-blue-500/10 text-blue-500 border-blue-200";
      case "Screening":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-200";
      case "Interview":
        return "bg-purple-500/10 text-purple-500 border-purple-200";
      case "Offered":
        return "bg-green-500/10 text-green-500 border-green-200";
      case "Hired":
        return "bg-green-600/10 text-green-600 border-green-300";
      case "Rejected":
        return "bg-red-500/10 text-red-500 border-red-200";
      default:
        return "";
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground mt-1">
          Manage and review job applications
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search applications..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Screening">Screening</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offered">Offered</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filterJob}
            onValueChange={setFilterJob}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Job</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {uniqueJobs.map(job => (
                <SelectItem key={job.id} value={job.id.toString()}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <Card 
              key={application.id} 
              className="shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOpenDetails(application)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(application.status)}
                  >
                    {application.status}
                  </Badge>
                  {application.isInternalApplicant && (
                    <Badge variant="secondary">Internal</Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-2">{application.applicant.name}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Applied for <span className="font-medium">{application.job.title}</span>
                </div>
              </CardHeader>
              <CardContent className="pb-4 space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{application.applicant.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{application.applicant.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>
                      Applied: {format(new Date(application.appliedDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Resume</span>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download Resume</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full p-6 text-center text-muted-foreground">
            <p>No applications found. {searchTerm && "Try a different search term."}</p>
          </Card>
        )}
      </div>
      
      {/* Application Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle>{selectedApplication.applicant.name}</DialogTitle>
                    <DialogDescription>
                      Application for {selectedApplication.job.title}
                    </DialogDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(selectedApplication.status)}
                  >
                    {selectedApplication.status}
                  </Badge>
                </div>
              </DialogHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="notes">Notes ({selectedApplication.notes.length})</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedApplication.applicant.avatar} />
                      <AvatarFallback className="text-xl">
                        {getInitials(selectedApplication.applicant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{selectedApplication.applicant.name}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{selectedApplication.applicant.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{selectedApplication.applicant.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Application Details</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Job Title</p>
                          <p className="font-medium">{selectedApplication.job.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Department</p>
                          <p>{selectedApplication.job.department}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(selectedApplication.status)}
                          >
                            {selectedApplication.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Applied Date</p>
                          <p>{format(new Date(selectedApplication.appliedDate), "MMM d, yyyy")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Applicant Type</p>
                          <p>{selectedApplication.isInternalApplicant ? "Internal Employee" : "External Candidate"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Resume</h4>
                      <div className="border rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
                        <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="font-medium">Resume.pdf</p>
                        <p className="text-sm text-muted-foreground">Click to view</p>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Skills & Experience</h4>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-primary/5">JavaScript</Badge>
                        <Badge variant="outline" className="bg-primary/5">React</Badge>
                        <Badge variant="outline" className="bg-primary/5">Node.js</Badge>
                        <Badge variant="outline" className="bg-primary/5">TypeScript</Badge>
                        <Badge variant="outline" className="bg-primary/5">MongoDB</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedApplication.isInternalApplicant 
                          ? "Internal candidate with 3 years of experience in the company." 
                          : "5+ years of experience in software development."}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Add New Note</h4>
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Add your notes about this candidate..." 
                        className="min-h-[80px]"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="mt-2" 
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                    >
                      Add Note
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Existing Notes</h4>
                    {selectedApplication.notes.length > 0 ? (
                      <div className="space-y-4">
                        {selectedApplication.notes.map((note, index) => (
                          <div key={index} className="bg-muted/40 rounded-lg p-4">
                            <p className="text-sm">{note.text}</p>
                            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                              <span>By {note.by}</span>
                              <span>{format(new Date(note.date), "MMM d, yyyy")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No notes yet.</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Change Status</h4>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Select
                          value={newStatus}
                          onValueChange={(value) => setNewStatus(value as ApplicationStatus)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Applied">Applied</SelectItem>
                            <SelectItem value="Screening">Screening</SelectItem>
                            <SelectItem value="Interview">Interview</SelectItem>
                            <SelectItem value="Offered">Offered</SelectItem>
                            <SelectItem value="Hired">Hired</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleStatusChange} disabled={!newStatus}>
                        Update Status
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Button variant="outline" className="w-full justify-start">
                          <Clock className="mr-2 h-4 w-4" />
                          Schedule Interview
                        </Button>
                      </div>
                      <div>
                        <Button variant="outline" className="w-full justify-start">
                          <ClipboardList className="mr-2 h-4 w-4" />
                          Create Assessment
                        </Button>
                      </div>
                      <div>
                        <Button variant="outline" className="w-full justify-start" onClick={() => {
                          setNewStatus("Offered");
                          handleStatusChange();
                        }}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Send Offer
                        </Button>
                      </div>
                      <div>
                        <Button variant="outline" className="w-full justify-start" onClick={() => {
                          setNewStatus("Rejected");
                          handleStatusChange();
                        }}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject Candidate
                        </Button>
                      </div>
                    </div>
                    
                    <Textarea 
                      placeholder="Additional instructions or notes for this action..." 
                      className="min-h-[80px]"
                    />
                    
                    <div>
                      <Button className="w-full">
                        Send Email to Candidate
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Applications;
