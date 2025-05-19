import Navbar from "@/components/Navbar";

// LinkedIn SVG icon component
const LinkedInIcon = () => (
  <svg
    className="inline-block mr-2"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.87 0-2.156 1.46-2.156 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.043 0 3.605 2.004 3.605 4.609v5.587z"/>
  </svg>
);

const About = () => {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-6 md:px-12 pt-20 h-full">
        <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Duarte Section */}
          <div className="space-y-6 z-10 bg-white p-10 md:p-16 rounded-lg shadow-md flex flex-col justify-center h-full border-2 border-green-200">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4 text-center">
              Duarte Monteiro
            </h2>
            <p className="text-lg md:text-xl text-black mb-4 text-center">
              Engenharia Eletrotécnica
            </p>
            <p className="text-lg md:text-xl text-black mb-4 text-center">
              FEUP
            </p>
            <div className="flex justify-center">
              <a
                href="https://www.linkedin.com/in/duarte-monteiro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-base flex items-center"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
          {/* Rian Section */}
          <div className="space-y-6 z-10 bg-white p-10 md:p-16 rounded-lg shadow-md flex flex-col justify-center h-full border-2 border-green-200">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4 text-center">
              Rian Silva
            </h2>
            <p className="text-lg md:text-xl text-black mb-4 text-center">
              Engenharia Mecânica
            </p>
            <p className="text-lg md:text-xl text-black mb-4 text-center">
              FEUP
            </p>
            <div className="flex justify-center">
              <a
                href="https://www.linkedin.com/in/rianapolo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-base flex items-center"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;