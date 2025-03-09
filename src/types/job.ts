
export interface Job {
  id?: string;
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  skills?: string[];
  postDate?: string;
  salary?: string;
  confidenceScore?: number;
  
  // Fields from the actual API response
  "Job Title"?: string;
  "Key Skills"?: string;
  "Job Salary"?: string;
  "Job Experience Required"?: string;
  "Functional Area"?: string; 
  "Industry"?: string;
  "Role Category"?: string;
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
