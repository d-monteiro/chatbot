import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Add this line to prevent form data appearing in URL
  
  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords não são iguais");
    return;
  }
  
  try {
    setLoading(true);
    
    // Use the register function from AuthContext
    await register(formData.name, formData.email, formData.password);
    navigate("/chat");
    
  } catch (err) {
    setError(err instanceof Error ? err.message : "Falha no registo");
  } finally {
    setLoading(false);
  }
};
  
  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-6 md:px-12 pt-20">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-200">
            <h1 className="text-3xl font-bold mb-6 text-center">Registo</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-800 hover:bg-green-900"
                  disabled={loading}
                >
                  {loading ? "A criar conta..." : "Criar Conta"}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tens conta?{" "}
                <a href="/login" className="text-chatbot-primary hover:underline text-green-900">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;