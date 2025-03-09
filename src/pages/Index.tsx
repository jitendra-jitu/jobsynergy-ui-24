
import React from "react";
import { Link } from "react-router-dom";
import { useProfile } from "@/contexts/ProfileContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isProfileComplete } = useProfile();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center bg-job-pattern px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect Job Match with AI
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Our advanced CNN algorithm analyzes your skills and experience to recommend the best job opportunities for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant={isProfileComplete ? "default" : "outline"}
              className={`text-lg h-14 px-8 gap-2 ${
                !isProfileComplete ? "border-dashed" : ""
              }`}
              asChild
            >
              <Link to={"/profile"}>
                Complete Profile First
              </Link>
            </Button>
          </div>

          {!isProfileComplete && (
            <p className="mt-4 text-sm text-gray-500">
              Please complete your profile to get personalized job recommendations
            </p>
          )}
        </div>

        <div className="mt-16 max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-job-light text-job-primary mb-3">
                1
              </div>
              <h3 className="font-medium mb-1">Create Profile</h3>
              <p className="text-sm text-gray-600">Fill in your skills and experience</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-job-light text-job-primary mb-3">
                2
              </div>
              <h3 className="font-medium mb-1">AI Analysis</h3>
              <p className="text-sm text-gray-600">Our CNN model analyzes your profile</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-job-light text-job-primary mb-3">
                3
              </div>
              <h3 className="font-medium mb-1">Get Matches</h3>
              <p className="text-sm text-gray-600">Receive personalized job recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
