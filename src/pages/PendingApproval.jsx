
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md animate-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-500">WorkNet360</h1>
          <p className="text-muted-foreground mt-2">Employment Management System</p>
        </div>

        <Card className="border-t-4 border-t-amber-500 text-center">
          <CardHeader>
            <CardTitle className="text-amber-500">Registration Pending Approval</CardTitle>
            <CardDescription>
              Your account has been created and is awaiting approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-lg">What happens next?</h3>
              <p className="text-sm text-muted-foreground mt-2">
                An administrator will review your account information and assign you a role. 
                Once approved, you'll be able to log in to the system.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="font-semibold text-blue-600">Approval Process</h3>
              <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside space-y-1">
                <li>Your registration request has been submitted</li>
                <li>HR or Admin will review your information</li>
                <li>You'll be assigned a role and department</li>
                <li>Once approved, you can log in to access your dashboard</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate("/login")}
            >
              Return to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PendingApproval;
