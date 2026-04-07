export interface StudentProfile {
    id: string;
    rollNumber: string;
    branch: string;
    cgpa: number;
    graduationYear: number;
    phone: string;
    linkedinUrl?: string;
    githubUrl?: string;
    resumeUrl?: string;
    user: {
      name: string;
      email: string;
    };
  }
  
  export interface StudentProfileInput {
    rollNumber: string;
    branch: string;
    cgpa: number;
    graduationYear: number;
    phone: string;
    linkedinUrl?: string;
    githubUrl?: string;
    resumeUrl?: string;
  }