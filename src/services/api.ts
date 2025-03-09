
import { Job, Profile } from "../types/job";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:5000";

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

export async function fetchRecommendedJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch recommended jobs");
    }
    
    // Assign IDs to each job for React keys
    const jobs = await response.json();
    return jobs.map((job: Job, index: number) => ({
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

export function parseResumeData(file: File): Promise<void> {
  // Since we're only using localStorage, we'll just show a toast
  toast({
    title: "Resume Upload",
    description: "Resume parsing is not available in local mode.",
    variant: "destructive",
  });
  return Promise.reject("Resume parsing not available in local mode");
}
