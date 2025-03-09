
import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { saveProfile, uploadResume } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Upload, User, Briefcase, GraduationCap, Target } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const Profile = () => {
  const { profile, setProfile } = useProfile();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleAddExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: uuidv4(), jobTitle: "", company: "", duration: "", description: "" },
      ],
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const handleExperienceChange = (id: string, field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleAddEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: uuidv4(), degree: "", institution: "", year: "" },
      ],
    }));
  };

  const handleRemoveEducation = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handleEducationChange = (id: string, field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const profileData = await uploadResume(file);
      setProfile(profileData);
      toast({
        title: "Resume Uploaded",
        description: "Your profile has been updated with resume data",
      });
    } catch (error) {
      console.error("Resume upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await saveProfile(profile);
      toast({
        title: "Profile Saved",
        description: "Your profile has been saved successfully",
      });
    } catch (error) {
      console.error("Profile save failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-job-primary flex items-center justify-center text-white">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-gray-600">
              Complete your profile to get personalized job recommendations
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-job-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="johndoe@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill (e.g. JavaScript, Python, React)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddSkill} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center bg-job-light text-job-primary px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-job-primary hover:text-job-dark"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-job-primary" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 border rounded-md relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`jobTitle-${index}`}>Job Title</Label>
                      <Input
                        id={`jobTitle-${index}`}
                        value={exp.jobTitle}
                        onChange={(e) =>
                          handleExperienceChange(exp.id, "jobTitle", e.target.value)
                        }
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`company-${index}`}>Company</Label>
                      <Input
                        id={`company-${index}`}
                        value={exp.company}
                        onChange={(e) =>
                          handleExperienceChange(exp.id, "company", e.target.value)
                        }
                        placeholder="Tech Company Inc."
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`duration-${index}`}>Duration</Label>
                    <Input
                      id={`duration-${index}`}
                      value={exp.duration}
                      onChange={(e) =>
                        handleExperienceChange(exp.id, "duration", e.target.value)
                      }
                      placeholder="Jan 2020 - Present"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={exp.description || ""}
                      onChange={(e) =>
                        handleExperienceChange(exp.id, "description", e.target.value)
                      }
                      placeholder="Describe your responsibilities and achievements"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddExperience}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-job-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education.map((edu, index) => (
                <div key={edu.id} className="p-4 border rounded-md relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        value={edu.degree}
                        onChange={(e) =>
                          handleEducationChange(edu.id, "degree", e.target.value)
                        }
                        placeholder="Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`institution-${index}`}>Institution</Label>
                      <Input
                        id={`institution-${index}`}
                        value={edu.institution}
                        onChange={(e) =>
                          handleEducationChange(
                            edu.id,
                            "institution",
                            e.target.value
                          )
                        }
                        placeholder="University of Technology"
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor={`year-${index}`}>Year</Label>
                    <Input
                      id={`year-${index}`}
                      value={edu.year}
                      onChange={(e) =>
                        handleEducationChange(edu.id, "year", e.target.value)
                      }
                      placeholder="2015 - 2019"
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddEducation}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </CardContent>
          </Card>

          {/* Career Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-job-primary" />
                Career Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="careerGoals">
                  What are your career goals and aspirations?
                </Label>
                <Textarea
                  id="careerGoals"
                  value={profile.careerGoals}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      careerGoals: e.target.value,
                    }))
                  }
                  placeholder="Describe your career goals and what you're looking for in your next role"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-job-primary" />
                Resume Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-3">
                  Upload your resume to automatically fill your profile
                </p>
                <input
                  type="file"
                  id="resume"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("resume")?.click()}
                  disabled={isLoading}
                >
                  {isLoading ? "Uploading..." : "Select Resume"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
