// import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
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
        Descobre rapidamente o que os partidos defendem nas Legislativas de 2025. Faz perguntas e obténs respostas claras e diretas.
      </p>
    </div>
    {/* Right side - Valor acrescentado */}
    <div className="space-y-8 z-10 bg-white p-10 md:p-16 rounded-lg shadow-md flex flex-col justify-center h-full border-2 border-green-200">
      <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4 text-center mb-8">
        O que podes aprender?
      </h2>
      <ul className="text-lg md:text-xl text-gray-800 space-y-4 list-disc list-inside">
        <li>
          <span className="font-semibold text-chatbot-primary">Comparar partidos:</span> Pergunta e vê as diferenças entre propostas de vários partidos.
        </li>
        <li>
          <span className="font-semibold text-chatbot-primary">Respostas imparciais:</span> O chatbot apresenta informação baseada nos programas oficiais, sem opiniões.
        </li>
        <li>
          <span className="font-semibold text-chatbot-primary">Explorar temas-chave:</span> Educação, saúde, ambiente, economia e mais — tudo explicado de forma simples.
        </li>
        <li>
          <span className="font-semibold text-chatbot-primary">Acesso rápido:</span> Não precisas de ler documentos longos — faz perguntas diretas e recebe respostas claras.
        </li>
      </ul>
      <div className="flex justify-center pt-4">
        <div>
          <Button
            variant="outline"
            className="bg-green-100 border border-green-300 rounded-lg px-12 py-8 text-green-900 text-center max-w-md text-ml"
            onClick={() => navigate('/chat?pergunta=O%20que%20propõem%20os%20partidos%20para%20a%20habitação%3F')}
          >
            <span className="font-semibold">Exemplo:</span>
            <span className="italic">"O que propõem os partidos para a habitação?"</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</main>
    </div>
  );
};

export default Index;