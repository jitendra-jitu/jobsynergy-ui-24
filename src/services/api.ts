
import { Job, Profile } from "../types/job";
import { toast } from "@/hooks/use-toast";

// Set the correct API endpoint
const API_BASE_URL = "http://localhost:5000";
const PREDICTION_ENDPOINT = "http://127.0.0.1:5000/predict";

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
    console.log("Fetching recommended jobs with skills:", skills);
    
    // Attempt to retrieve recommended jobs from cache
    const cachedJobs = localStorage.getItem("recommendedJobs");
    if (cachedJobs) {
      const jobs = JSON.parse(cachedJobs);
      console.log("Using cached recommended jobs:", jobs);
      return jobs.map((job: any, index: number) => ({
        ...job,
        id: job.id || index.toString(),
        confidenceScore: job.confidence || job.confidenceScore || 0
      }));
    }
    
    // If no cached jobs, return sample data
    console.log("No cached recommended jobs found, using sample data");
    return SAMPLE_JOBS.map((job, index) => ({
      ...job,
      id: index.toString(),
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
    if (!jobTitle || !skills || skills.length === 0) {
      throw new Error("Job title and skills are required for recommendations");
    }
    
    // Format skills as a pipe-separated string
    const skillsString = skills.join("|");
    
    // Prepare the request payload with the correct format
    const payload = {
      job_title: jobTitle,
      key_skills: skillsString
    };
    
    console.log("POST request to prediction endpoint:", PREDICTION_ENDPOINT);
    console.log("POST payload:", payload);
    
    // Try to make an actual API call to the prediction endpoint
    try {
      const response = await fetch(PREDICTION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        console.error("Error response from prediction API:", response.status);
        throw new Error(`Failed to get job recommendations: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received prediction data:", data);
      
      // Format the response data to match our Job structure
      const formattedJobs = Array.isArray(data) ? data.map((job, index) => ({
        ...job,
        id: index.toString(),
        confidenceScore: job.confidence || 0
      })) : [];
      
      // Cache the results
      localStorage.setItem("recommendedJobs", JSON.stringify(formattedJobs));
      
      return formattedJobs;
    } catch (apiError) {
      console.error("API call failed, using sample data instead:", apiError);
      
      // If the API call fails, fall back to the sample data
      const fallbackData = SAMPLE_JOBS.map((job, index) => ({
        ...job,
        id: index.toString(),
        confidenceScore: job.confidence
      }));
      
      // Cache the fallback data
      localStorage.setItem("recommendedJobs", JSON.stringify(fallbackData));
      
      return fallbackData;
    }
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
