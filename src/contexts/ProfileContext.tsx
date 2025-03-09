
import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile } from "../types/job";
import { v4 as uuidv4 } from "uuid";

interface ProfileContextType {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  isProfileComplete: boolean;
}

const defaultProfile: Profile = {
  fullName: "",
  email: "",
  skills: [],
  experience: [],
  education: [],
  careerGoals: "",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => {
    const savedProfile = localStorage.getItem("userProfile");
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });

  const isProfileComplete = Boolean(
    profile.fullName && 
    profile.email && 
    profile.skills.length > 0
  );

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, isProfileComplete }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
