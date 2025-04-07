
import React from "react";

interface TypingStatsProps {
  wpm: number;
  accuracy: number;
}

const TypingStats: React.FC<TypingStatsProps> = ({ wpm, accuracy }) => {
  return (
    <div className="flex gap-6 justify-center mt-8 text-gray-300">
      <div className="text-center">
        <div className="text-3xl font-mono">{Math.round(wpm)}</div>
        <div className="text-sm uppercase tracking-wide">ЗНМ</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-mono">{accuracy.toFixed(0)}%</div>
        <div className="text-sm uppercase tracking-wide">Точность</div>
      </div>
    </div>
  );
};

export default TypingStats;
