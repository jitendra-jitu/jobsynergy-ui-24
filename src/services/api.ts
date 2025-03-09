
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
    // The Flask backend expects the file with key 'file', not 'resume'
    formData.append("file", file);
    
    console.log("Uploading file:", file.name, "size:", file.size, "type:", file.type);
    
    const response = await fetch(`${API_BASE_URL}/upload-resume`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header here, the browser will set it correctly with boundary for multipart/form-data
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error response:", errorData);
      throw new Error(errorData.error || "Failed to upload resume");
    }
    
    const data = await response.json();
    console.log("Resume upload response:", data);
    
    // Map API response to our Profile structure
    return {
      fullName: data.full_name || "",
      email: data.email || "",
      skills: data.skills || [],
      experience: (data.experience || []).map((exp: any) => ({
        id: crypto.randomUUID(),
        jobTitle: exp.job_title || "",
        company: exp.company || "",
        duration: exp.duration || "",
        description: exp.description || ""
      })),
      education: (data.education || []).map((edu: any) => ({
        id: crypto.randomUUID(),
        degree: edu.degree || "",
        institution: edu.institution || "",
        year: edu.year || ""
      })),
      careerGoals: data.career_goals || ""
    };
  } catch (error) {
    console.error("Resume upload failed:", error);
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
