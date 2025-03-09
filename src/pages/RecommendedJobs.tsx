
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRecommendedJobs } from "@/services/api";
import JobCard from "@/components/JobCard";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useProfile } from "@/contexts/ProfileContext";
import { Skeleton } from "@/components/ui/skeleton";

const RecommendedJobs = () => {
  const { profile, isProfileComplete } = useProfile();

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ["recommendedJobs", profile],
    queryFn: fetchRecommendedJobs,
    enabled: isProfileComplete,
  });

  if (!isProfileComplete) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          Complete Your Profile First
        </h1>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We need more information to provide job recommendations.
        </p>
        <Button asChild>
          <Link to="/profile">Go to Profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Recommended Jobs
        </h1>
        <p className="text-gray-600">
          Based on your skills and profile
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-4" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">Error loading recommended jobs.</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No recommended jobs found. Update your profile with more skills.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.sort((a, b) => (b.confidence || b.confidenceScore || 0) - (a.confidence || a.confidenceScore || 0))
            .map((job) => (
              <JobCard key={job.id} job={job} isRecommended={true} />
            ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedJobs;
