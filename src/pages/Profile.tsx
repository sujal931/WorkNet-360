import { useState, useEffect, ChangeEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { User } from "@/contexts/AuthContext";
import { CalendarIcon, Upload } from "lucide-react";

interface ExtendedUser extends Omit<User, 'dateOfBirth'> {
  address?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string; // Changed from Date | string to match User interface
  workLocation?: 'Onsite' | 'Remote' | 'Hybrid';
  documents?: Array<{name: string, url: string, uploadDate: string}>;
}

const Profile = () => {
  const { user, isLoading } = useAuth();
  const [profileData, setProfileData] = useState<Partial<ExtendedUser> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        department: user.department || "",
        position: user.position || "",
        avatar: user.avatar || "",
        address: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        workLocation: "Onsite",
        documents: []
      });
      
      // If user has date of birth already set, parse it
      if (user.dateOfBirth) {
        setDate(new Date(user.dateOfBirth));
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      // Convert Date to string when saving to profileData to match the expected type
      setProfileData(prev => prev ? { ...prev, dateOfBirth: selectedDate.toISOString() } : null);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedDocument(e.target.files[0]);
    }
  };

  const handleDocumentUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDocument && documentName) {
      // Here we would handle the actual file upload to a server
      // For now, let's simulate adding it to the documents array
      const newDocument = {
        name: documentName,
        url: URL.createObjectURL(selectedDocument),
        uploadDate: new Date().toISOString()
      };
      
      setProfileData(prev => 
        prev ? { 
          ...prev, 
          documents: [...(prev.documents || []), newDocument] 
        } : null
      );
      
      toast.success("Document uploaded successfully");
      setSelectedDocument(null);
      setDocumentName("");
    } else {
      toast.error("Please select a document and provide a name");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would handle the actual profile update to a server
    // Including image upload if selectedImage exists
    
    if (selectedImage) {
      // Simulate image upload and getting a URL back
      const imageUrl = URL.createObjectURL(selectedImage);
      setProfileData(prev => prev ? { ...prev, avatar: imageUrl } : null);
    }
    
    toast.success("Profile updated successfully");
    setIsEditing(false);
    setSelectedImage(null);
  };

  const formatDateStr = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "";
    return format(new Date(dateStr), "PPP");
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">My Profile</h1>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="employment">Employment Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="bg-card shadow-lg border-0">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-primary/20">
                <AvatarImage src={profileData?.avatar || ""} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">{profileData?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <CardTitle className="text-2xl">{profileData?.name}</CardTitle>
                <CardDescription>{profileData?.position || "Position not set"}</CardDescription>
                <CardDescription>{profileData?.email}</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(!isEditing)}
                className="ml-auto shadow-sm"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={profileData?.name || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={isEditing ? "bg-background" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email"
                      value={profileData?.email || ""}
                      onChange={handleChange}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Your phone number"
                      value={profileData?.phoneNumber || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={isEditing ? "bg-background" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      disabled={!isEditing}
                      value={profileData?.gender || ""}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger id="gender" className={isEditing ? "bg-background" : ""}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!isEditing}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address"
                      name="address"
                      placeholder="Your address"
                      value={profileData?.address || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={isEditing ? "bg-background" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department"
                      name="department"
                      placeholder="Your department"
                      value={profileData?.department || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={isEditing ? "bg-background" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input 
                      id="position"
                      name="position"
                      placeholder="Your position"
                      value={profileData?.position || ""}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={isEditing ? "bg-background" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="avatar">Profile Image</Label>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <Input 
                          id="avatar"
                          name="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="bg-background"
                        />
                      ) : (
                        <Input 
                          id="avatar"
                          placeholder="No image selected"
                          disabled
                          value={profileData?.avatar ? "Profile image uploaded" : "No image uploaded"}
                        />
                      )}
                    </div>
                    {selectedImage && (
                      <p className="text-xs text-muted-foreground">
                        Selected file: {selectedImage.name}
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <CardFooter className="flex justify-end px-0">
                    <Button type="submit" className="shadow-md">Save Changes</Button>
                  </CardFooter>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="space-y-6">
          <Card className="bg-card shadow-lg border-0">
            <CardHeader>
              <CardTitle>Employment Information</CardTitle>
              <CardDescription>Your employment details and history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <p className="text-sm p-2 bg-muted rounded-md">{user?.id || "EMP-" + Math.floor(Math.random() * 10000)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Join Date</Label>
                    <p className="text-sm p-2 bg-muted rounded-md">April 15, 2023</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Employment Status</Label>
                    <p className="text-sm p-2 bg-muted rounded-md">Full-time</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Reporting Manager</Label>
                    <p className="text-sm p-2 bg-muted rounded-md">Sarah Johnson</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Work Location</Label>
                    <Select
                      disabled={!isEditing}
                      value={profileData?.workLocation || "Onsite"}
                      onValueChange={(value) => handleSelectChange("workLocation", value)}
                    >
                      <SelectTrigger className={isEditing ? "bg-background" : ""}>
                        <SelectValue placeholder="Select work location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Onsite">Onsite</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {isEditing && (
                  <CardFooter className="flex justify-end px-0 pt-4">
                    <Button onClick={handleSubmit} className="shadow-md">Save Changes</Button>
                  </CardFooter>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card className="bg-card shadow-lg border-0">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Your uploaded documents and certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profileData?.documents && profileData.documents.length > 0 ? (
                  profileData.documents.map((doc, index) => (
                    <div key={index} className="border rounded-lg p-4 flex items-center justify-between bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13v-1h6v1"/><path d="M11 18h2"/><path d="M12 12v6"/></svg>
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded on {format(new Date(doc.uploadDate), "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => window.open(doc.url)}>View</Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No documents uploaded yet</p>
                  </div>
                )}
                
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Upload New Document</h3>
                  <form onSubmit={handleDocumentUpload} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="documentName">Document Name</Label>
                        <Input 
                          id="documentName"
                          value={documentName}
                          onChange={(e) => setDocumentName(e.target.value)}
                          placeholder="Certificate name or document type"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="document">Document File</Label>
                        <Input 
                          id="document"
                          type="file"
                          onChange={handleDocumentChange}
                          className="bg-background"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={!selectedDocument || !documentName}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
