export interface DashboardStats {
    totalStudents: number;
    totalCompanies: number;
    totalJobs: number;
    totalApplications: number;
    totalPlacements: number;
  }
  
  export interface AdminStudent {
    id: string;
    rollNumber: string;
    branch: string;
    cgpa: number;
    graduationYear: number;
    phone: string;
    user: {
      name: string;
      email: string;
    };
  }
  
  export interface AdminCompany {
    id: string;
    companyName: string;
    industry: string;
    location: string;
    phone: string;
    website?: string;
    isApproved: boolean;
    user: {
      name: string;
      email: string;
    };
  }