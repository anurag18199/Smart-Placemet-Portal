export type JobType = "INTERNSHIP" | "FULLTIME";

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  jobType: JobType;
  minCgpa: number;
  deadline: string;
  createdAt: string;
  company: {
    companyName: string;
    location: string;
    description?: string;
    website?: string;
  };
}

export interface JobsResponse {
  jobs: Job[];
  currentPage: number;
  totalPages: number;
  totalJobs: number;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  jobType?: string;
  minCgpa?: number;
  active?: boolean;
}

export interface CreateJobInput {
  title: string;
  description: string;
  location: string;
  salary: string;
  jobType: JobType;
  minCgpa: number;
  deadline: string;
}