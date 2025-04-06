
import { CSVUploader } from "@/components/upload/CSVUploader";

const UploadPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Upload Data</h1>
        <p className="text-muted-foreground mt-1">
          Upload a CSV file containing user data.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <CSVUploader />
        
        <div className="mt-8 border-t pt-4">
          <h3 className="font-medium mb-2">CSV Format Requirements</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>File must be in CSV format</li>
            <li>First row must contain headers</li>
            <li>Required columns: <code>email</code>, <code>first_name</code>, <code>last_name</code></li>
            <li>Data rows should match the header columns</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
