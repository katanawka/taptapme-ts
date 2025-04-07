
import React from "react";
import { cn } from "@/lib/utils";

interface CharacterDisplayProps {
  expectedChar: string;
  typedChar: string | null;
  isCurrent: boolean;
}

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({
  expectedChar,
  typedChar,
  isCurrent,
}) => {
  const isCorrect = typedChar === expectedChar;
  const isIncorrect = typedChar !== null && typedChar !== expectedChar;
  
  const isSpace = expectedChar === " ";
  
  return (
    <span
      className={cn(
        "inline-block font-mono text-xl relative transition-all duration-200",
        isSpace ? "w-2" : "",
        isCorrect ? "text-white" : "",
        isIncorrect ? "text-[#ea384c] relative" : "",
        isCurrent ? "border-b-2 border-white animate-pulse-subtle" : "", 
        !typedChar ? "text-gray-500" : "",
        isCurrent ? "text-white" : ""
      )}
    >
      {isIncorrect && typedChar ? typedChar : (isSpace ? "\u00A0" : expectedChar)}
    </span>
  );
};

export default CharacterDisplay;
