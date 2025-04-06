
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Upload, Database } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-DEFAULT" />
              People Management
            </CardTitle>
            <CardDescription>Manage and view user data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              View and filter all uploaded user information in the data table.
              Search by name, email, or other attributes to find specific users.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-DEFAULT" />
              Data Upload
            </CardTitle>
            <CardDescription>Upload new user data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Upload CSV files containing user information quickly and easily.
              Required fields: email, first_name, and last_name.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-DEFAULT" />
              Data Processing
            </CardTitle>
            <CardDescription>Automatic data handling</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              All uploaded data is automatically processed, validated, and stored
              for efficient retrieval and display in the system.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
