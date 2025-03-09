
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
    
    return await response.json();
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

export async function uploadResume(file: File): Promise<Profile> {
  try {
    const formData = new FormData();
    formData.append("resume", file);
    
    const response = await fetch(`${API_BASE_URL}/upload-resume`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Failed to upload resume");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error uploading resume:", error);
    toast({
      title: "Error",
      description: "Failed to upload resume. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/save-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    
    if (!response.ok) {
      throw new Error("Failed to save profile");
    }
    
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
    throw error;
  }
}
