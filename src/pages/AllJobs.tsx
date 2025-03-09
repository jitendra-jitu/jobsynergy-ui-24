
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSampleJobs } from "@/services/api";
import JobCard from "@/components/JobCard";
import { Briefcase, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Job } from "@/types/job";

const AllJobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: rawJobs = [], isLoading, error } = useQuery({
    queryKey: ["sampleJobs"],
    queryFn: fetchSampleJobs,
  });

  // Format jobs to work with our JobCard component
  const jobs: Job[] = rawJobs.map((job: any, index) => ({
    id: index.toString(),
    title: job["Job Title"] || "",
    company: job["Industry"] || "",
    location: job["Functional Area"] || "",
    description: job["Role Category"] || "",
    skills: job["Key Skills"] ? job["Key Skills"].split('|').map((s: string) => s.trim()) : [],
    postDate: job["Job Experience Required"] || "",
    salary: job["Job Salary"] || "",
  }));

  const filteredJobs = jobs.filter(
    (job) =>
      (job.title && job.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.company && job.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.skills && job.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ))
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Briefcase className="mr-2 h-8 w-8 text-job-primary" />
          All Available Jobs
        </h1>
        <p className="text-gray-600">
          Browse through all our job listings and find your next opportunity
        </p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search jobs by title, company, or skill..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-4" />
              <Skeleton className="h-16 w-full mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">Error loading jobs. Please try again.</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllJobs;
