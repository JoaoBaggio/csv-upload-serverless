
import { FilterParams, User, UserApiResponse } from "@/types";

// Mock database
let users: User[] = [];

// Generate some initial mock data
for (let i = 1; i <= 50; i++) {
  users.push({
    id: `user-${i}`,
    email: `user${i}@example.com`,
    first_name: `First${i}`,
    last_name: `Last${i}`,
  });
}

export const uploadCSV = async (file: File): Promise<{ success: boolean; count: number }> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(async () => {
      try {
        const text = await file.text();
        const rows = text.split("\n");
        const headers = rows[0].split(",");
        
        // Validate headers
        const requiredFields = ["email", "first_name", "last_name"];
        const headerMap: Record<string, number> = {};
        
        headers.forEach((header, index) => {
          headerMap[header.trim().toLowerCase()] = index;
        });
        
        if (!requiredFields.every(field => field in headerMap)) {
          throw new Error("CSV file must contain email, first_name, and last_name fields");
        }
        
        // Parse data rows
        const newUsers: User[] = [];
        
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const values = rows[i].split(",");
          const user: User = {
            id: `user-${Date.now()}-${i}`,
            email: values[headerMap.email].trim(),
            first_name: values[headerMap.first_name].trim(),
            last_name: values[headerMap.last_name].trim(),
          };
          
          newUsers.push(user);
        }
        
        // Add to "database"
        users = [...users, ...newUsers];
        
        resolve({
          success: true,
          count: newUsers.length,
        });
      } catch (error) {
        console.error("Error processing CSV:", error);
        resolve({
          success: false,
          count: 0,
        });
      }
    }, 800);
  });
};

export const fetchUsers = async (params: FilterParams): Promise<UserApiResponse> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      let filteredUsers = [...users];
      
      // Apply filtering if specified
      if (params.field && params.value) {
        const value = params.value.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user[params.field!].toLowerCase().includes(value)
        );
      }
      
      // Calculate pagination
      const startIndex = params.lastKey ? users.findIndex(user => user.email === JSON.parse(params.lastKey!).email.S) + 1 : 0;
      const endIndex = startIndex + params.limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      
      // Create lastKey for next page if there are more items
      const hasMoreItems = endIndex < filteredUsers.length;
      const lastKey = hasMoreItems 
        ? JSON.stringify({ email: { S: paginatedUsers[paginatedUsers.length - 1].email } })
        : null;
      
      resolve({
        items: paginatedUsers,
        lastKey: lastKey
      });
    }, 500);
  });
};
