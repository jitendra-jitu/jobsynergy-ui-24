
import { Job, Profile } from "../types/job";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:5000";

// Sample data to use when API is not available
const SAMPLE_JOBS = [
  {
    "Job Title": "React Frontend Developer",
    "Key Skills": "React| Redux| JavaScript",
    "confidence": 1.0,
    "details": {
      "Company": "InnovateTech",
      "Description": "Develop interactive and responsive UIs using React and Redux.",
      "Industry": "IT-Software, Software Services",
      "Job Experience Required": "3 - 6 yrs",
      "Job Salary": "7.5 LPA",
      "confidence": 1.0
    }
  },
  {
    "Job Title": "Vue.js Developer",
    "Key Skills": "Vue.js| JavaScript| UI Development",
    "confidence": 0.5987082337374124,
    "details": {
      "Company": "Frontend Masters",
      "Description": "Build modern web applications using Vue.js and TypeScript.",
      "Industry": "Web Development",
      "Job Experience Required": "3 - 6 yrs",
      "Job Salary": "7.1 LPA",
      "confidence": 0.5987082337374124
    }
  },
  {
    "Job Title": "Frontend Developer",
    "Key Skills": "React.js| JavaScript| UI Development",
    "confidence": 0.5932752021550755,
    "details": {
      "Company": "Web Creators Inc.",
      "Description": "Design and develop responsive UI components with React.js.",
      "Industry": "IT-Software, Software Services",
      "Job Experience Required": "3 - 6 yrs",
      "Job Salary": "5.8 LPA",
      "confidence": 0.5932752021550755
    }
  },
  {
    "Job Title": "Java Backend Developer",
    "Key Skills": "Java| Spring Boot| Microservices",
    "confidence": 0.5226588978102378,
    "details": {
      "Company": "InnovateTech",
      "Description": "Develop and maintain backend services using Java and Spring Boot.",
      "Industry": "IT-Software, Software Services",
      "Job Experience Required": "2 - 5 yrs",
      "Job Salary": "6.2 LPA",
      "confidence": 0.5226588978102378
    }
  },
  {
    "Job Title": "React Developer",
    "Key Skills": "React| Next.js| Tailwind CSS",
    "confidence": 0.3571321286549576,
    "details": {
      "Company": "Frontend Gurus",
      "Description": "Develop fast and interactive web applications using React and Next.js.",
      "Industry": "Web Development",
      "Job Experience Required": "3 - 5 yrs",
      "Job Salary": "6.7 LPA",
      "confidence": 0.3571321286549576
    }
  }
];

export async function fetchSampleJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sample-jobs`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching sample jobs:", error);
    toast({
      title: "Error",
      description: "Failed to fetch jobs. Please try again.",
      variant: "destructive",
    });
    return [];
  }
}

export async function fetchRecommendedJobs(skills?: string[]): Promise<Job[]> {
  try {
    console.log("Using sample recommended jobs data instead of API call");
    console.log("Skills to recommend jobs for:", skills);
    
    // Add IDs for React keys
    return SAMPLE_JOBS.map((job, index) => ({
      ...job,
      id: index.toString(),
      // Make sure confidence is available at the top level
      confidenceScore: job.confidence
    }));
  } catch (error) {
    console.error("Error fetching recommended jobs:", error);
    toast({
      title: "Error",
      description: "Failed to fetch recommended jobs. Please try again.",
      variant: "destructive",
    });
    return [];
  }
}

export async function requestRecommendedJobs(jobTitle: string, skills: string[]): Promise<Job[]> {
  try {
    console.log("Requesting recommended jobs with:", { jobTitle, skills });
    
    // Prepare the request payload with the correct format
    const payload = {
      job_title: jobTitle,
      key_skills: skills.join("|")
    };
    
    console.log("POST payload:", payload);
    
    // In a real implementation, this would make an actual API call
    // const response = await fetch(`${API_BASE_URL}/recommend-jobs`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(payload)
    // });
    // 
    // if (!response.ok) {
    //   throw new Error("Failed to get job recommendations");
    // }
    // 
    // return await response.json();
    
    // For now, simulate by returning the sample data
    return SAMPLE_JOBS.map((job, index) => ({
      ...job,
      id: index.toString(),
      confidenceScore: job.confidence
    }));
  } catch (error) {
    console.error("Error requesting recommended jobs:", error);
    toast({
      title: "Error",
      description: "Failed to get job recommendations. Please try again.",
      variant: "destructive",
    });
    return [];
  }
}

// Local storage only functions for profile
export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    toast({
      title: "Success",
      description: "Profile saved successfully!",
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    toast({
      title: "Error",
      description: "Failed to save profile. Please try again.",
      variant: "destructive",
    });
  }
}

export function getProfile(): Profile | null {
  try {
    const profileData = localStorage.getItem("userProfile");
    if (profileData) {
      return JSON.parse(profileData);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return null;
  }
}

export async function parseResumeData(file: File): Promise<Profile> {
  try {
    const API_URL = "http://localhost:5000/upload-resume";
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to parse resume");
    }

    const data = await response.json();
    
    // Format the data to match our Profile structure
    return {
      fullName: data.full_name || "",
      email: data.email || "",
      skills: data.skills || [],
      experience: Array.isArray(data.experience) 
        ? data.experience.map((exp: any, index: number) => ({
            id: index.toString(),
            jobTitle: exp.job_title || "",
            company: exp.company || "",
            duration: exp.duration || "",
            description: exp.description || ""
          }))
        : [],
      education: Array.isArray(data.education)
        ? data.education.map((edu: any, index: number) => ({
            id: index.toString(),
            degree: edu.degree || "",
            institution: edu.institution || "",
            year: edu.year || ""
          }))
        : [],
      careerGoals: data.career_goals || "",
    };
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw error;
  }
}
