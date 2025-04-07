
import React from "react";
import TypingTest from "@/components/TypingTest";
import { Keyboard, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const goToStatistics = () => {
    navigate("/statistics", { replace: false });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#0d0d11] flex flex-col"
    >
      <header className="py-6">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Keyboard size={24} className="text-yellow-300" />
              <h1 className="text-2xl font-medium text-white">TapTapMe</h1>
            </div>
            <Button 
              variant="ghost" 
              onClick={goToStatistics}
              className="text-gray-400 hover:text-yellow-300 hover:bg-yellow-300/10"
            >
              <BarChart size={24} />
              <span className="sr-only">Статистика</span>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container">
        <TypingTest />
      </main>
    </motion.div>
  );
};

export default Index;
