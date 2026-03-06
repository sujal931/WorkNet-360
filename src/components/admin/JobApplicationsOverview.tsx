
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data
const mockApplications = [
  { id: 1, position: "Senior Developer", employee: "Alex Chen", department: "Engineering", status: "pending" },
  { id: 2, position: "Team Lead", employee: "Jessica Wong", department: "Customer Support", status: "pending" }
];

const JobApplicationsOverview = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Job Applications</CardTitle>
        <CardDescription>Recent internal job applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead className="hidden sm:table-cell">Applicant</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.position}</TableCell>
                  <TableCell className="hidden sm:table-cell">{application.employee}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">
                      {application.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-right">
          <Button variant="link" size="sm" onClick={() => navigate("/recruitment/applications")}>
            View All Applications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobApplicationsOverview;
