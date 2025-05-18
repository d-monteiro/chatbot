// import React from "react";
import Navbar from "@/components/Navbar";

const About = () => {
    return (
        <div className="h-screen flex flex-col relative overflow-hidden">
            <Navbar />
            
            <div className="flex-grow flex items-center px-6 md:px-12 pt-20">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* Left side - Text content */}
                    <div className="space-y-6 z-10 bg-gray-100 p-10 md:p-16 rounded-lg shadow-md border-2 border-gray-200 h-full flex flex-col justify-center">
                        <div className="mb-4">
                            <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-4 text-black">
                                About Us
                            </h1>
                        </div>
                        <p className="text-lg md:text-2xl text-black max-w-lg">
                            We are a team of passionate developers dedicated to creating innovative AI solutions that enhance user experiences.
                        </p>
                        <p className="text-lg md:text-2xl text-black max-w-lg">
                            Our mission is to make AI technology accessible, helpful, and intuitive for everyone.
                        </p>
                    </div>
                    
                    {/* Right side - Team information */}
                    <div className="space-y-6 z-10 bg-white p-10 md:p-16 rounded-lg shadow-md border-2 border-gray-200 h-full flex flex-col justify-center">
                        <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-4 text-black">
                            Our Team
                        </h2>
                        <p className="text-lg md:text-xl text-black">
                            Our diverse team brings together expertise in machine learning, 
                            natural language processing, and user experience design to 
                            create VotaAI, a chatbot platform that truly understands your needs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;