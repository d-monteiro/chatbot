import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="py-6 px-6 md:px-16 w-full absolute top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="max-w-[95%] mx-auto flex justify-between items-center">
        {/* Left side - Logo/Brand */}
        <div className="font-serif text-2xl md:text-3xl font-bold ml-0 md:ml-4">
          <Link to="/" className="no-underline">
            <span className="text-chatbot-primary">Vota</span>
            <span className="text-green-800">AI</span>
          </Link>
        </div>
        
        {/* Right side - Navigation items */}
        <div className="flex items-center space-x-6 md:space-x-8 mr-0 md:mr-4">
          <Link 
            to="/about" 
            className="text-black hover:text-chatbot-primary transition-colors text-lg md:text-xl font-medium no-underline"
          >
            Sobre nós
          </Link>
          <Button 
            variant="outline" 
            className="border-gray-350 text-black bg-white hover:bg-white/90 text-lg md:text-xl px-6 md:px-8 py-3"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            className="bg-green-800 text-white hover:bg-green-900 text-lg md:text-xl px-6 md:px-8 py-3"
            onClick={() => navigate('/register')}
          >
            Registo
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;