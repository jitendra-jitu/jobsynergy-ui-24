
import React, { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { saveProfile } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, User, Briefcase, GraduationCap, Target } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      saveProfile(profile);
    } catch (error) {
      console.error("Profile save failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="skills">Skills</Label>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill"
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
              {profile.experience.map((exp) => (
                <div key={exp.id} className="p-4 border rounded-md relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input
                        value={exp.jobTitle}
                        onChange={(e) =>
                          handleExperienceChange(exp.id, "jobTitle", e.target.value)
                        }
                        placeholder="Job Title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          handleExperienceChange(exp.id, "company", e.target.value)
                        }
                        placeholder="Company"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Duration</Label>
                    <Input
                      value={exp.duration}
                      onChange={(e) =>
                        handleExperienceChange(exp.id, "duration", e.target.value)
                      }
                      placeholder="Duration"
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
              {profile.education.map((edu) => (
                <div key={edu.id} className="p-4 border rounded-md relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          handleEducationChange(edu.id, "degree", e.target.value)
                        }
                        placeholder="Degree"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          handleEducationChange(
                            edu.id,
                            "institution",
                            e.target.value
                          )
                        }
                        placeholder="Institution"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label>Year</Label>
                    <Input
                      value={edu.year}
                      onChange={(e) =>
                        handleEducationChange(edu.id, "year", e.target.value)
                      }
                      placeholder="Year"
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
              <Textarea
                value={profile.careerGoals}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    careerGoals: e.target.value,
                  }))
                }
                placeholder="Describe your career goals"
                rows={3}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
