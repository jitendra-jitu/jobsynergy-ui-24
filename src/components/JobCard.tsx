
import React from "react";
import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ExternalLink, MapPin, Building, Calendar } from "lucide-react";

interface JobCardProps {
  job: Job;
  isRecommended?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isRecommended = false }) => {
  return (
    <Card className="job-card h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <Building className="h-4 w-4 mr-1" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{job.location}</span>
            </div>
            {job.postDate && (
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{job.postDate}</span>
              </div>
            )}
          </div>
          {job.salary && (
            <div className="px-3 py-1 rounded-md bg-job-light text-job-primary text-sm font-medium">
              {job.salary}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">{job.description}</p>
        <div className="flex flex-wrap mt-2">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="skill-tag bg-gray-100 text-gray-600">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>

        {isRecommended && job.confidenceScore !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Match Score</span>
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
        <Button className="w-full gap-2">
          Apply Now
          <ExternalLink className="h-4 w-4" />
        </Button>
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
