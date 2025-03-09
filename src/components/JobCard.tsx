
import React from "react";
import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Building, Briefcase } from "lucide-react";

interface JobCardProps {
  job: Job;
  isRecommended?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isRecommended = false }) => {
  // Format display values from job object
  const title = job.title || job["Job Title"] || "";
  const company = job.company || job["Company"] || job["Industry"] || "";
  const salary = job.salary || job["Job Salary"] || "";
  const experience = job.experience || job["Job Experience Required"] || "";
  const description = job.description || job["Description"] || "";
  
  // Parse skills
  const skills = job.skills || 
    (job["Key Skills"] ? job["Key Skills"].split('|').map(s => s.trim()) : []);

  return (
    <Card className="job-card h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {company && (
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Building className="h-4 w-4 mr-1" />
                <span>{company}</span>
              </div>
            )}
            {experience && (
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{experience}</span>
              </div>
            )}
          </div>
          {salary && (
            <div className="px-3 py-1 rounded-md bg-job-light text-job-primary text-sm font-medium">
              {salary}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">{description}</p>
        )}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap mt-2">
            {skills.slice(0, 3).map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="skill-tag bg-gray-100 text-gray-600">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {isRecommended && job.confidenceScore !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Match</span>
              <span className="font-semibold">{Math.round(job.confidenceScore * 100)}%</span>
            </div>
            <div className="confidence-bar">
              <div 
                className="confidence-progress" 
                style={{ 
                  width: `${Math.round(job.confidenceScore * 100)}%`,
                  backgroundColor: getScoreColor(job.confidenceScore)
                }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full">Apply Now</Button>
      </CardFooter>
    </Card>
  );
};

function getScoreColor(score: number): string {
  if (score >= 0.8) return "#10b981"; // green
  if (score >= 0.6) return "#2563eb"; // blue
  if (score >= 0.4) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

export default JobCard;
