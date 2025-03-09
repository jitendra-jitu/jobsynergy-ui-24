
export interface Job {
  id?: string;
  // Core fields for display
  title?: string;
  company?: string;
  description?: string;
  salary?: string;
  experience?: string;
  industry?: string;
  skills?: string[];
  confidenceScore?: number;
  
  // Fields from the actual API response
  "Company"?: string;
  "Description"?: string;
  "Industry"?: string;
  "Job Experience Required"?: string;
  "Job Salary"?: string;
  "Job Title"?: string;
  "Key Skills"?: string;
}

export interface Profile {
  fullName: string;
  email: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  careerGoals: string;
  resumeUrl?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  duration: string;
  description?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}
