
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, CheckCircle, X, File, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

// Mock resume parsing response
const mockParsedData = {
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "(123) 456-7890",
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "MIT",
      year: "2015-2019"
    },
    {
      degree: "Master of Computer Science",
      institution: "Stanford University",
      year: "2019-2021"
    }
  ],
  skills: [
    "JavaScript", "React", "Node.js", "Python", "SQL", "MongoDB", 
    "AWS", "Docker", "Git", "Machine Learning", "Data Analysis"
  ],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      period: "2021 - Present",
      description: "Led development of cloud-based solutions using AWS and microservices architecture."
    },
    {
      title: "Software Developer",
      company: "Data Insights",
      period: "2019 - 2021",
      description: "Built data visualization dashboards and analytics tools."
    }
  ]
};

const ResumeParser = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelection(droppedFile);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only PDF or Word documents are allowed');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size should be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    setParseError(null);
    setParsedData(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          simulateParsing();
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const simulateParsing = () => {
    setIsParsing(true);
    
    // Simulate API call to parse resume
    setTimeout(() => {
      // 10% chance of error for demo purposes
      const hasError = Math.random() < 0.1;
      
      if (hasError) {
        setParseError("Unable to parse resume. The file format may be unsupported or the content is not readable.");
        toast.error("Resume parsing failed");
      } else {
        setParsedData(mockParsedData);
        toast.success("Resume parsed successfully");
      }
      
      setIsParsing(false);
    }, 2000);
  };

  const handleFileRemove = () => {
    setFile(null);
    setParsedData(null);
    setParseError(null);
  };

  const handleParse = () => {
    if (!file) return;
    simulateUpload();
  };

  const handleSaveToCandidate = () => {
    toast.success("Data saved to candidate profile");
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-0">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">AI Resume Parser</CardTitle>
              <CardDescription>
                Upload a resume to automatically extract candidate information
              </CardDescription>
            </div>
            <Badge className="self-start md:self-auto" variant="outline">
              AI Powered
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-medium">
                    Drag & drop your resume here
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    or click to browse (PDF or Word document, max 5MB)
                  </p>
                </div>
                <div>
                  <Button className="cursor-pointer" onClick={() => document.getElementById("resume-upload")?.click()}>
                    <FileText className="mr-2 h-4 w-4" />
                    Select Resume
                  </Button>
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <File className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB • {file.type}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleFileRemove}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {!isUploading && !isParsing && !parsedData && !parseError && (
                <Button className="w-full" onClick={handleParse}>
                  <FileText className="mr-2 h-4 w-4" />
                  Parse Resume
                </Button>
              )}

              {isParsing && (
                <div className="text-center p-4">
                  <div className="flex justify-center items-center mb-3">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                  <p>Analyzing resume with AI...</p>
                </div>
              )}

              {parseError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">Parsing Error</h3>
                      <p className="text-sm mt-1">{parseError}</p>
                      <div className="mt-3">
                        <Button size="sm" variant="outline" onClick={() => setFile(null)}>
                          Try with another file
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {parsedData && (
        <Card className="shadow-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Parsed Information
              </CardTitle>
              <CardDescription>
                Review the extracted information below
              </CardDescription>
            </div>
            <Button onClick={handleSaveToCandidate}>
              Save to Candidate
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="border rounded-lg p-4 mt-2 space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{parsedData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{parsedData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{parsedData.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Education</h3>
                  <div className="border rounded-lg p-4 mt-2 space-y-4">
                    {parsedData.education.map((edu: any, index: number) => (
                      <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Skills</h3>
                  <div className="border rounded-lg p-4 mt-2">
                    <div className="flex flex-wrap gap-2">
                      {parsedData.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-primary/5">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Work Experience</h3>
                  <div className="border rounded-lg p-4 mt-2 space-y-4">
                    {parsedData.experience.map((exp: any, index: number) => (
                      <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                        <div className="flex justify-between">
                          <p className="font-medium">{exp.title}</p>
                          <span className="text-sm">{exp.period}</span>
                        </div>
                        <p className="text-sm">{exp.company}</p>
                        <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export as JSON
            </Button>
            <Button onClick={handleSaveToCandidate}>
              Save to Candidate Profile
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ResumeParser;
