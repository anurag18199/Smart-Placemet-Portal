import API from "./api";
import type { StudentProfileInput } from "../types/student";

export const updateStudentProfile = (data: StudentProfileInput) => {
  // Clean payload — remove empty optional URL strings, ensure numbers are numbers
  const payload: any = {
    rollNumber: data.rollNumber,
    branch: data.branch,
    cgpa: Number(data.cgpa),
    graduationYear: Number(data.graduationYear),
    phone: data.phone,
  };

  if (data.linkedinUrl && data.linkedinUrl.trim() !== "")
    payload.linkedinUrl = data.linkedinUrl;

  if (data.githubUrl && data.githubUrl.trim() !== "")
    payload.githubUrl = data.githubUrl;

  if (data.resumeUrl && data.resumeUrl.trim() !== "")
    payload.resumeUrl = data.resumeUrl;

  return API.put("/student/profile", payload);
};

export const getStudentApplications = () => {
  return API.get("/student/applications");
};