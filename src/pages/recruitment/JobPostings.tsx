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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, Plus, MapPin, Calendar, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import ResumeParser from "@/components/recruitment/ResumeParser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define JobType interface with all required properties
type JobType = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: { min: number; max: number; currency: string };
  isInternal: boolean;
  postedDate: string;
  closingDate: string;
  status: string;
  applications: number | undefined;
};

// Mock job postings data with safe initialization
const initialJobs: JobType[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "New York, NY",
    type: "Full-time",
    description: "We're looking for an experienced software engineer to join our team...",
    requirements: ["5+ years experience", "React", "Node.js", "AWS"],
    salary: { min: 120000, max: 150000, currency: "USD" },
    isInternal: false,
    postedDate: "2025-05-01",
    closingDate: "2025-05-30",
    status: "Open",
    applications: 12
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    description: "Looking for a product manager to oversee our flagship product...",
    requirements: ["3+ years experience", "Agile methodologies", "User research"],
    salary: { min: 100000, max: 130000, currency: "USD" },
    isInternal: true,
    postedDate: "2025-04-25",
    closingDate: "2025-05-25",
    status: "Open",
    applications: 8
  },
  {
    id: 3,
    title: "UX/UI Designer",
    department: "Design",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Join our design team to create beautiful and user-friendly interfaces...",
    requirements: ["3+ years experience", "Figma", "User testing", "Portfolio"],
    salary: { min: 90000, max: 120000, currency: "USD" },
    isInternal: false,
    postedDate: "2025-04-20",
    closingDate: "2025-05-20",
    status: "Open",
    applications: 15
  },
  {
    id: 4,
    title: "Marketing Coordinator",
    department: "Marketing",
    location: "Chicago, IL",
    type: "Part-time",
    description: "Support our marketing initiatives and help grow our brand presence...",
    requirements: ["1+ years experience", "Social media", "Content creation"],
    salary: { min: 45000, max: 55000, currency: "USD" },
    isInternal: false,
    postedDate: "2025-04-15",
    closingDate: "2025-05-15",
    status: "Open",
    applications: 20
  },
  {
    id: 5,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Help us build and maintain our infrastructure and deployment pipelines...",
    requirements: ["3+ years experience", "AWS", "Docker", "Kubernetes", "CI/CD"],
    salary: { min: 110000, max: 140000, currency: "USD" },
    isInternal: true,
    postedDate: "2025-04-10",
    closingDate: "2025-05-10",
    status: "Open",
    applications: 6
  }
];

type FormValues = {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salaryMin: number;
  salaryMax: number;
  isInternal: boolean;
  closingDate: string;
};

const JobPostings = () => {
  const [jobs, setJobs] = useState<JobType[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      description: "",
      requirements: "",
      salaryMin: 0,
      salaryMax: 0,
      isInternal: false,
      closingDate: new Date().toISOString().split('T')[0],
    }
  });
  
  const handleCreateJob = (data: FormValues) => {
    const newJob = {
      id: jobs.length + 1,
      title: data.title,
      department: data.department,
      location: data.location,
      type: data.type,
      description: data.description,
      requirements: data.requirements.split(',').map(req => req.trim()),
      salary: {
        min: data.salaryMin,
        max: data.salaryMax,
        currency: "USD"
      },
      isInternal: data.isInternal,
      postedDate: new Date().toISOString().split('T')[0],
      closingDate: data.closingDate,
      status: "Open",
      applications: 0
    };
    
    setJobs([newJob, ...jobs]);
    setIsCreateDialogOpen(false);
    form.reset();
    toast.success("Job posting created successfully");
  };
  
  const handleEditJob = (job: JobType) => {
    form.reset({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements.join(', '),
      salaryMin: job.salary.min,
      salaryMax: job.salary.max,
      isInternal: job.isInternal,
      closingDate: job.closingDate,
    });
    
    setSelectedJob(job);
    setIsCreateDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedJob) {
      setJobs(jobs.filter(job => job.id !== selectedJob.id));
      setIsDeleteDialogOpen(false);
      setSelectedJob(null);
      toast.success("Job posting deleted successfully");
    }
  };
  
  const filteredJobs = jobs
    .filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(job => filterStatus === "all" || job.status === filterStatus)
    .filter(job => filterType === "all" || job.type === filterType);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="resume-parser">Resume Parser</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Job Postings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your company's open positions
              </p>
            </div>
            <Button onClick={() => {
              form.reset();
              setSelectedJob(null);
              setIsCreateDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Job
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs..."
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
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filterType}
                onValueChange={setFilterType}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Type</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Card key={job.id} className="shadow-sm border-0">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant={job.isInternal ? "secondary" : "outline"}>
                          {job.isInternal ? "Internal" : "Public"}
                        </Badge>
                        <Badge variant="outline">{job.type}</Badge>
                        <Badge variant="outline">{job.status}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditJob(job)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setSelectedJob(job);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="text-xl mt-2">{job.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{job.department}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{job.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          Posted: {format(new Date(job.postedDate), "MMM d, yyyy")}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>
                          Closing: {format(new Date(job.closingDate), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {job.salary.currency}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-4 w-4" />
                          <span>Applications ({job.applications || 0})</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full p-6 text-center text-muted-foreground">
                <p>No job postings found. {searchTerm && "Try a different search term."}</p>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="resume-parser">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Resume Parser</h1>
            <p className="text-muted-foreground mt-1">
              Parse resumes using AI to extract candidate information
            </p>
          </div>
          
          <ResumeParser />
        </TabsContent>
      </Tabs>
      
      {/* Create/Edit Job Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedJob ? "Edit Job Posting" : "Create New Job Posting"}</DialogTitle>
            <DialogDescription>
              Fill in the details to {selectedJob ? "update the" : "create a new"} job posting.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateJob)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Engineering" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. New York, NY or Remote" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detailed job description..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add requirements separated by commas..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter requirements separated by commas (e.g. "5+ years experience, React, Node.js")
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="salaryMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Salary</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="salaryMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Salary</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="closingDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-8">
                  <FormField
                    control={form.control}
                    name="isInternal"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Internal Job Posting
                          </FormLabel>
                          <FormDescription>
                            This job will only be visible to current employees
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">
                  {selectedJob ? "Update Job" : "Create Job"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Job Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job posting? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobPostings;
