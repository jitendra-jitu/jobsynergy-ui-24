
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  postDate: string;
  salary?: string;
  confidenceScore?: number;
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
