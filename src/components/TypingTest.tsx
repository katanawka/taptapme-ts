
import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { generateRandomText, generateLongerText } from "@/utils/textGenerator";
import { RefreshCw } from "lucide-react";
import CharacterDisplay from "./CharacterDisplay";
import TypingStats from "./TypingStats";
import { useNavigate } from "react-router-dom";

const typingSound = new Audio("/keyboard-click.mp3");
const errorSound = new Audio("/keyboard-error.mp3");

typingSound.load();
errorSound.load();

const TypingTest: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [typedText, setTypedText] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [tabPressed, setTabPressed] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    resetTest();
    
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setIsTimerRunning(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    
    if (isTimerRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsCompleted(true);
            setIsTimerRunning(false);
            saveStatsAndNavigate();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (startTime && typedText.length > 0) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes > 0.05) {
        const words = typedText.length / 5;
        const currentWpm = words / elapsedMinutes;
        setWpm(currentWpm);
      }

      if (totalKeystrokes > 0) {
        const currentAccuracy = (correctKeystrokes / totalKeystrokes) * 100;
        setAccuracy(currentAccuracy);
      }
    }
  }, [typedText, startTime, totalKeystrokes, correctKeystrokes]);

  useEffect(() => {
    if (typedText.length === text.length && text.length > 0) {
      setTimeout(() => {
        loadNewText();
      }, 1000);
    }
  }, [typedText, text]);

  const saveStatsAndNavigate = () => {
    if (wpm > 0) {
      const newStat = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        wpm: Math.round(wpm),
        accuracy: Math.round(accuracy)
      };

      const savedStats = localStorage.getItem("typingStats");
      const stats = savedStats ? JSON.parse(savedStats) : [];
      
      localStorage.setItem("typingStats", JSON.stringify([...stats, newStat]));
      
      setTimeout(() => {
        navigate("/statistics");
      }, 1500);
    } else {
      navigate("/statistics");
    }
  };

  const resetTest = () => {
    setText(generateLongerText(3));
    setTypedText("");
    setIsCompleted(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(30);
    setIsTimerRunning(false);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setTabPressed(false);
    setIsFocused(true);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const loadNewText = () => {
    setText(generateLongerText(3));
    setTypedText("");
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setTabPressed(true);
      return;
    }
    
    if (e.key === "Enter" && tabPressed) {
      e.preventDefault();
      resetTest();
      return;
    }

    if (e.key !== "Tab") {
      setTabPressed(false);
    }

    if (startTime === null) {
      setStartTime(Date.now());
      setIsTimerRunning(true);
    }

    if (e.key === "Backspace") {
      setTypedText((prev) => prev.slice(0, -1));
      typingSound.currentTime = 0;
      typingSound.play().catch(e => console.log("Audio play error:", e));
      return;
    }

    if (e.key.length !== 1 || typedText.length >= text.length) {
      return;
    }

    setTotalKeystrokes(prev => prev + 1);
    
    const isCorrect = text[typedText.length] === e.key;
    if (isCorrect) {
      setCorrectKeystrokes(prev => prev + 1);
      
      typingSound.currentTime = 0;
      typingSound.play().catch(e => console.log("Audio play error:", e));
    } else {
      errorSound.currentTime = 0;
      errorSound.play().catch(e => console.log("Audio play error:", e));
    }

    setTypedText((prev) => prev + e.key);
  };

  const handleContainerClick = () => {
    setIsFocused(true);
    if (startTime !== null && !isCompleted) {
      setIsTimerRunning(true);
    }
    inputRef.current?.focus();
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 cursor-text relative"
      onClick={handleContainerClick}
    >
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute pointer-events-none"
        onKeyDown={handleKeyDown}
        autoFocus
      />

      <div className="max-w-3xl w-full mb-6">
        <div className="text-center mb-2">
          <span className="text-xl font-medium text-white">{timeLeft}s</span>
        </div>
        
        <div className="text-center mb-6 space-x-1 leading-relaxed relative">
          <div className={`${!isFocused ? 'blur-[3px]' : ''}`}>
            {text.split("").map((char, index) => (
              <CharacterDisplay
                key={index}
                expectedChar={char}
                typedChar={index < typedText.length ? typedText[index] : null}
                isCurrent={index === typedText.length}
              />
            ))}
          </div>
          
          {!isFocused && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="rounded-lg">
                <span className="text-white text-lg font-medium">
                  Нажмите сюда чтобы продолжить
                </span>
              </div>
            </div>
          )}
        </div>

        {isCompleted ? (
          <div className="text-center">
            <h2 className="text-2xl font-medium mb-4 text-gray-100">Завершено!</h2>
            <TypingStats wpm={wpm} accuracy={accuracy} />
            <div className="flex justify-center mt-4">
              <button 
                onClick={resetTest} 
                className="p-2 rounded-full hover:bg-yellow-300/20 transition-colors"
              >
                <RefreshCw 
                  size={24} 
                  className="text-gray-500 hover:text-yellow-300 transition-colors" 
                />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <TypingStats wpm={wpm} accuracy={accuracy} />
            <div className="flex justify-center mt-4">
              <button 
                onClick={resetTest} 
                className="p-2 rounded-full hover:bg-yellow-300/20 transition-colors"
              >
                <RefreshCw 
                  size={20} 
                  className="text-gray-500 hover:text-yellow-300 transition-colors" 
                />
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-400 text-xs fixed bottom-8">
        <kbd className="px-1 py-0.5 bg-white text-black rounded mr-1 text-xs font-medium">Tab</kbd> + 
        <kbd className="px-1 py-0.5 bg-white text-black rounded ml-1 text-xs font-medium">Enter</kbd> чтобы начать заново
      </div>
    </div>
  );
};

export default TypingTest;
