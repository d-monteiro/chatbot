import React from "react";
import Navbar from "@/components/Navbar";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <Navbar />
      
      <main className="flex-grow flex items-center px-6 md:px-12">
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6 z-10 bg-white/80 p-6 md:p-8 rounded-lg">
            <div className="mb-4">
              <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-2 text-black">
                <span className="text-chatbot-primary">Vota</span>
                <span className="text-black">AI</span>
              </h1>
            </div>
            <p className="text-base md:text-xl text-black max-w-lg">
              Experience next-generation AI chatbot technology that understands, assists, 
              and evolves with your users' needs.
            </p>
            <div className="pt-4">
              <Button variant="outline" className="border-chatbot-primary bg-white text-black hover:bg-gray-100">
                About Us
              </Button>
            </div>
          </div>
          
          {/* Right side - Try it Out button with slideshow as background */}
          <div className="relative flex justify-center items-center 
              h-full min-h-[250px] md:min-h-[300px] aspect-square md:aspect-auto">
            <Button className="button-primary text-lg px-8 py-6 z-10">
              Try it Out
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {/* Expanded slideshow container for vertical screens */}
            <div className="absolute inset-0 -z-0 rounded-lg overflow-hidden">
              <BackgroundSlideshow />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;