import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="py-4 px-6 md:px-12 w-full absolute top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-end items-center">
        <div className="flex items-center space-x-4">
          <a href="/about" className="text-black hover:text-chatbot-primary transition-colors">
            About Us
          </a>
          <Button variant="outline" className="border-gray-350 text-black bg-white hover:bg-white/90">
            Log in
          </Button>
            <Button className="bg-green-800 text-white hover:bg-green-900">
            Register
            </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;