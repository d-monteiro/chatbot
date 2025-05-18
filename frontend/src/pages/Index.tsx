// import React from "react";
import Navbar from "@/components/Navbar";
import BackgroundSlideshow from "@/components/BackgroundSlideshow";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-6 md:px-12 pt-20 h-full">
        <div className="max-w-7xl mx-auto w-full h-[80vh] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Left side - Text content */}
          <div className="space-y-6 z-10 bg-white p-10 md:p-16 rounded-lg shadow-md flex flex-col justify-center h-full border-2 border-gray-200">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6 text-black text-center">
                <span className="text-chatbot-primary">Vota</span>
                <span className="text-green-800">AI</span>
              </h1>
            </div>
            <p className="text-xl md:text-3xl text-black max-w-lg mb-8 mx-auto">
              Experience next-generation AI chatbot technology that understands, assists, 
              and evolves with your users' needs.
            </p>
            <div className="pt-6 flex justify-center">
              <Button 
                variant="outline" 
                className="border-chatbot-primary bg-white text-black hover:bg-gray-100 text-lg md:text-xl px-8 md:px-10 py-4"
                onClick={() => navigate('/about')}
              >
                About Us
              </Button>
            </div>
          </div>
          
          {/* Right side - Try it Out button with slideshow as background */}
          <div className="relative flex justify-center items-center 
              h-full min-h-[400px] md:min-h-[500px] rounded-lg shadow-md overflow-hidden border-2 border-gray-200">
            <Button 
              className="bg-green-800 text-2xl px-12 py-10 z-10 hover:bg-green-900 font-semibold"
              onClick={() => navigate('/chat')}
            >
              Try it Out
              <ArrowRight className="ml-4 h-7 w-7" />
            </Button>
            
            {/* Expanded slideshow container for vertical screens */}
            <div className="absolute inset-0 -z-0 overflow-hidden">
              <BackgroundSlideshow />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;