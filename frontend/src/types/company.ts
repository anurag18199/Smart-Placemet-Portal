export interface CompanyProfile {
    id: string;
    companyName: string;
    description: string;
    website?: string;
    location: string;
    approved: boolean;
    user: {
      name: string;
      email: string;
    };
  }
  
  export interface CompanyProfileInput {
    companyName: string;
    description: string;
    website?: string;
    location: string;
    industry : string;
    phone: string;
  }