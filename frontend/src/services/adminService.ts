import API from "./api";

export const getDashboardStats = () => {
  return API.get("/admin/dashboard");
};

export const getAllStudents = () => {
  return API.get("/admin/students");
};

export const getAllCompanies = () => {
  return API.get("/admin/companies");
};

export const approveCompany = (companyId: string) => {
  return API.patch(`/admin/company/${companyId}/approve`);
};