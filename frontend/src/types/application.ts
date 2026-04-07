export type ApplicationStatus = "APPLIED" | "SHORTLISTED" | "REJECTED" | "SELECTED";
export type UpdateableStatus = "SHORTLISTED" | "REJECTED" | "SELECTED";

export interface Application {
  id: string;
  status: ApplicationStatus;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    location: string;
    salary: string;
    jobType: "FULLTIME" | "INTERNSHIP";
    deadline: string;
    company: {
      companyName: string;
      location: string;
    };
  };
}