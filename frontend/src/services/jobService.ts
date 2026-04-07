import API from "./api";
import type { JobFilters, CreateJobInput } from "../types/job";

export const getAllJobs = (filters: JobFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", String(filters.page));
  if (filters.limit) params.append("limit", String(filters.limit));
  if (filters.search) params.append("search", filters.search);
  if (filters.location) params.append("location", filters.location);
  if (filters.jobType) params.append("jobType", filters.jobType);
  if (filters.minCgpa) params.append("minCgpa", String(filters.minCgpa));
  if (filters.active) params.append("active", "true");

  return API.get(`/job?${params.toString()}`);
};

export const getJobById = (jobId: string) => {
  return API.get(`/job/${jobId}`);
};

export const createJob = (data: CreateJobInput) => {
  return API.post("/job", data);
};

export const applyToJob = (jobId: string) => {
  return API.post(`/job/${jobId}/apply`);
};

export const getCompanyJobs = () => {
    return API.get("/company/jobs");
  };