
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Keyboard } from "lucide-react";
import { motion } from "framer-motion";

interface StatsData {
  id: number;
  date: string;
  wpm: number;
  accuracy: number;
}

const Statistics = () => {
  const [statsData, setStatsData] = useState<StatsData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedStats = localStorage.getItem("typingStats");
    if (savedStats) {
      setStatsData(JSON.parse(savedStats));
    }
  }, []);

  const goBack = () => {
    navigate("/", { replace: false });
  };

  const averageWpm = statsData.length
    ? Math.round(statsData.reduce((sum, stat) => sum + stat.wpm, 0) / statsData.length)
    : 0;
  
  const averageAccuracy = statsData.length
    ? Math.round(statsData.reduce((sum, stat) => sum + stat.accuracy, 0) / statsData.length)
    : 0;

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
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={goBack}
              className="text-gray-400 hover:text-yellow-300 hover:bg-yellow-300/10"
            >
              <ArrowLeft size={24} />
              <span className="sr-only">Назад</span>
            </Button>
            <div className="flex items-center gap-2">
              <Keyboard size={24} className="text-yellow-300" />
              <h1 className="text-2xl font-medium text-white">TapTapMe</h1>
            </div>
          </div>
          <h1 className="text-2xl font-medium text-white">Статистика печати</h1>
        </div>
      </header>
      
      <main className="flex-1 container py-6 pb-16 overflow-hidden">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid gap-6"
        >
          <div className="flex flex-wrap gap-4 justify-between mb-4">
            <div className="bg-[#1a1a24] p-4 rounded-lg w-full sm:w-[48%]">
              <h3 className="text-lg text-gray-300 mb-2">Средняя скорость</h3>
              <p className="text-3xl font-bold text-yellow-300">{averageWpm} зн/мин</p>
            </div>
            <div className="bg-[#1a1a24] p-4 rounded-lg w-full sm:w-[48%]">
              <h3 className="text-lg text-gray-300 mb-2">Средняя точность</h3>
              <p className="text-3xl font-bold text-yellow-300">{averageAccuracy}%</p>
            </div>
          </div>

          {statsData.length > 0 ? (
            <>
              <div className="bg-[#1a1a24] p-4 rounded-lg overflow-hidden">
                <h2 className="text-xl font-medium text-white mb-4">История скорости печати</h2>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={statsData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: "#9ca3af" }}
                        tickLine={{ stroke: "#555" }}
                      />
                      <YAxis 
                        tick={{ fill: "#9ca3af" }}
                        tickLine={{ stroke: "#555" }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border border-gray-800 bg-[#1a1a24] p-2 shadow-md text-white">
                                <div className="text-sm font-medium">{payload[0].payload.date}</div>
                                <div className="text-xs">
                                  зн/мин: <span className="font-medium text-yellow-300">{payload[0].value}</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                        cursor={{fill: 'rgba(250, 204, 21, 0.1)'}}
                      />
                      <Bar
                        dataKey="wpm"
                        fill="#FACC15"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#1a1a24] p-4 rounded-lg overflow-hidden">
                <h2 className="text-xl font-medium text-white mb-4">Диаграмма точности</h2>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={statsData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: "#9ca3af" }} 
                        tickLine={{ stroke: "#555" }}
                      />
                      <YAxis 
                        tick={{ fill: "#9ca3af" }}
                        tickLine={{ stroke: "#555" }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border border-gray-800 bg-[#1a1a24] p-2 shadow-md text-white">
                                <div className="text-sm font-medium">{payload[0].payload.date}</div>
                                <div className="text-xs">
                                  Точность: <span className="font-medium text-yellow-300">{payload[0].value}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                        cursor={{fill: 'rgba(250, 204, 21, 0.1)'}}
                      />
                      <Bar
                        dataKey="accuracy"
                        fill="#FACC15"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-[#1a1a24] p-8 rounded-lg text-center">
              <p className="text-gray-400">Данные о печати отсутствуют. Завершите тесты печати, чтобы увидеть вашу статистику.</p>
            </div>
          )}
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Statistics;
