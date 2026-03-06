
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/employees": "Employee Management",
  "/tasks": "Task Management",
  "/attendance": "Attendance Tracking",
  "/leave": "Leave Management",
  "/leave/apply": "Apply for Leave",
  "/leave/requests": "Leave Requests",
  "/leave/history": "Leave History",
  "/payroll": "Payroll",
  "/recruitment": "Recruitment",
  "/recruitment/jobs": "Job Postings",
  "/recruitment/applications": "Applications",
  "/recruitment/internal": "Internal Job Postings",
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("");
  
  // Update page title based on current route
  useEffect(() => {
    const path = location.pathname;
    let title = pageTitles[path] || "WorkNet360";
    
    if (!title) {
      // For nested paths not in our mapping, try to find closest parent
      const pathSegments = path.split("/").filter(Boolean);
      let currentPath = "";
      
      for (let i = 0; i < pathSegments.length; i++) {
        currentPath += "/" + pathSegments[i];
        if (pageTitles[currentPath]) {
          title = pageTitles[currentPath];
        }
      }
    }
    
    setPageTitle(title);
    document.title = `${title} | WorkNet360`;
  }, [location.pathname]);

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
