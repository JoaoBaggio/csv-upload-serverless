
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, CheckCircle2, XCircle, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSignedUploadURL, uploadCSVToSignedURL } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export const CSVUploader = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const processFile = async (file: File) => {
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);
    setUploadStatus("idle");

    try {
      // Step 1: Get a signed URL for upload
      const { uploadUrl, key } = await getSignedUploadURL(file.name);
      
      // Step 2: Upload the file to the signed URL
      await uploadCSVToSignedURL(uploadUrl, file);
      
      setUploadStatus("success");
      toast({
        title: "Upload Successful",
        description: `File uploaded successfully with key: ${key}`,
      });
    } catch (error) {
      setUploadStatus("error");
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    maxFiles: 1,
    disabled: isUploading,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0]);
      }
    },
  });

  const reset = () => {
    setUploadedFile(null);
    setUploadStatus("idle");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {uploadedFile && uploadStatus !== "idle" ? (
        <div className="p-8 border-2 border-dashed rounded-lg">
          <div className="flex flex-col items-center justify-center text-center">
            {uploadStatus === "success" ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">Upload Successful</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  Your file {uploadedFile.name} has been processed.
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-medium">Upload Failed</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-4">
                  There was a problem processing {uploadedFile.name}.
                </p>
              </>
            )}
            <Button onClick={reset} variant="outline">Upload Another File</Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
            isDragActive ? "border-purple-light bg-purple-light/5" : "border-gray-300 hover:border-purple-DEFAULT"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-purple-light/10 flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-purple-DEFAULT" />
            </div>
            <h3 className="text-lg font-medium">
              {isDragActive ? "Drop the file here" : "Upload CSV File"}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Drag and drop a CSV file, or click to browse files
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Required fields: email, first_name, last_name</span>
            </div>
          </div>
        </div>
      )}

      {uploadedFile && uploadStatus === "idle" && (
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-DEFAULT border-t-transparent"></div>
            <p className="text-sm">Processing {uploadedFile.name}...</p>
          </div>
        </div>
      )}
    </div>
  );
};
