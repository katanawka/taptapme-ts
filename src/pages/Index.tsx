
import React from "react";
import TypingTest from "@/components/TypingTest";
import { Keyboard } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0d0d11] flex flex-col">
      <header className="py-6">
        <div className="container flex justify-center">
          <div className="flex items-center gap-2">
            <Keyboard size={24} className="text-yellow-300" />
            <h1 className="text-2xl font-medium text-white">TapTapMe</h1>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container">
        <TypingTest />
      </main>
    </div>
  );
};

export default Index;
