
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <ShieldAlert className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        You don't have permission to access this page. Please contact your administrator
        if you believe this is an error.
      </p>
      <div className="space-x-4">
        <Button onClick={() => navigate("/dashboard")} variant="default">
          Back to Dashboard
        </Button>
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
