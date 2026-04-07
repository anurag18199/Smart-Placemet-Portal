import API from "./api";
import type { CompanyProfileInput } from "../types/company";

export const getCompanyProfile = () => {
  return API.get("/company/profile");
};

export const updateCompanyProfile = (data: CompanyProfileInput) => {
  return API.put("/company/profile", data);
};

export const getJobApplicants = (jobId: string) => {
  return API.get(`/company/job/${jobId}/applicants`);
};

export const updateApplicationStatus = (
  applicationId: string,
  status: "SHORTLISTED" | "REJECTED" | "SELECTED"
) => {
  return API.patch(`/company/application/${applicationId}/status`, { status });
};

export const getCompanyJobs = () => {
  return API.get("/company/jobs");
};