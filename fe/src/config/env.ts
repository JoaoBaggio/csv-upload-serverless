
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4566",
  CSV_UPLOAD_ENDPOINT:
    import.meta.env.VITE_CSV_UPLOAD_ENDPOINT ||
    "/restapis/wybsit9doq/dev/_user_request_/process-csv",
};
