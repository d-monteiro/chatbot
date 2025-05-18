import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate("/chat"); // Redirect to chat after successful login
    } catch (error: any) {
      setErrorMessage(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-6 md:px-12 pt-20">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-200">
            <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
            
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-800 hover:bg-green-900"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "A entrar..." : "Entrar"}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Ainda não tens conta?{" "}
                <a href="/register" className="text-chatbot-primary hover:underline text-green-900">
                  Regista-te
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;