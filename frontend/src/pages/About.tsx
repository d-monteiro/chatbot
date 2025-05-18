

const About = () => {
    return(
        <div className="h-screen flex flex-col relative overflow-hidden">
            <div className="flex-grow flex items-center px-6 md:px-12">
                <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left side - Text content */}
                    <div className="space-y-6 z-10 bg-white/80 p-6 md:p-8 rounded-lg">
                        <div className="mb-4">
                            <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-2 text-black">
                                About Us
                            </h1>
                        </div>
                        <p className="text-base md:text-xl text-black max-w-lg">
                            We are a team of passionate developers dedicated to creating innovative AI solutions that enhance user experiences.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;