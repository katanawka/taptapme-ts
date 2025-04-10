
import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import { generateRandomText, generateLongerText } from "@/utils/textGenerator";
import { RefreshCw, Clock, Type, Hash } from "lucide-react";
import CharacterDisplay from "./CharacterDisplay";
import TypingStats from "./TypingStats";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";

const typingSound = new Audio("/keyboard-click.mp3");
const errorSound = new Audio("/keyboard-error.mp3");

typingSound.load();
errorSound.load();

const DEFAULT_TIME_OPTIONS = [15, 30, 60, 120];

const TypingTest: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [typedText, setTypedText] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [selectedTime, setSelectedTime] = useState<number>(30);
  const [customTime, setCustomTime] = useState<string>("");
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [tabPressed, setTabPressed] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [isCustomTimeDialogOpen, setIsCustomTimeDialogOpen] = useState<boolean>(false);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [testMode, setTestMode] = useState<{
    time: number, 
    numbers: boolean, 
    punctuation: boolean
  }>({
    time: 30,
    numbers: false,
    punctuation: false
  });

  useEffect(() => {
    resetTest();
    
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node) &&
          !document.querySelector('.buttons-container')?.contains(e.target as Node)) {
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
    setText(generateLongerText(12, testMode.numbers));
    setTypedText("");
    setIsCompleted(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(selectedTime);
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
    setText(generateLongerText(12, testMode.numbers));
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
    if (!isFocused) {
      setIsFocused(true);
      if (startTime !== null && !isCompleted) {
        setIsTimerRunning(true);
      }
    }
    inputRef.current?.focus();
  };

  const handleTimeChange = (newTime: number) => {
    if (newTime === testMode.time) return;
    
    if (startTime !== null) {
      setSelectedTime(newTime);
      setTimeLeft(newTime);
      resetTest();
    } else {
      setSelectedTime(newTime);
      setTimeLeft(newTime);
    }
  };

  const handleModeChange = (type: 'time' | 'numbers' | 'punctuation', value: number | boolean) => {
    if (type === 'numbers' && testMode.numbers === value) return;
    if (type === 'time' && testMode.time === value) return;
    
    const newMode = { ...testMode, [type]: value };
    setTestMode(newMode);

    if (type === 'time' && startTime !== null) {
      setSelectedTime(value as number);
      setTimeLeft(value as number);
      resetTest();
    } else if (type !== 'time') {
      resetTest();
    }
  };

  const parseCustomTimeInput = (input: string): number | null => {
    let totalSeconds = 0;
    
    if (/^\d+$/.test(input)) {
      return parseInt(input, 10);
    }
    
    const hoursMatch = input.match(/(\d+)h/);
    if (hoursMatch) {
      totalSeconds += parseInt(hoursMatch[1], 10) * 3600;
    }
    
    const minutesMatch = input.match(/(\d+)m/);
    if (minutesMatch) {
      totalSeconds += parseInt(minutesMatch[1], 10) * 60;
    }
    
    return totalSeconds > 0 ? totalSeconds : null;
  };

  const applyCustomTime = () => {
    const parsedTime = parseCustomTimeInput(customTime);
    
    if (!parsedTime) {
      toast("Неверное значение времени", {
        description: "Пожалуйста, введите число или используйте формат h/m (например, 1h30m)",
        style: { background: "#121318", color: "#e5e7eb", borderColor: "rgba(255,255,255,0.1)" }
      });
      return;
    }
    
    if (parsedTime < 5 || parsedTime > 3600) {
      toast("Неверное значение времени", {
        description: "Пожалуйста, введите значение от 5 секунд до 1 часа",
        style: { background: "#121318", color: "#e5e7eb", borderColor: "rgba(255,255,255,0.1)" }
      });
      return;
    }
    
    setSelectedTime(parsedTime);
    setTimeLeft(parsedTime);
    setIsCustomTimeDialogOpen(false);
    
    if (startTime !== null) {
      resetTest();
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 relative"
    >
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute left-0 top-0 w-2 h-2 pointer-events-none"
        onKeyDown={handleKeyDown}
        autoFocus
      />

      <div className="max-w-3xl w-full mb-6">
        
        <div className="buttons-container flex flex-col items-center justify-center w-full mb-6 gap-2">
          <div className="flex bg-[#0f0f13] rounded-lg px-2 py-1 gap-1 w-full max-w-md justify-center shadow-sm">
            <ToggleGroup 
              type="single" 
              value={String(testMode.time)} 
              onValueChange={(value) => value && handleModeChange('time', Number(value))}
              className="flex items-center"
            >
              {DEFAULT_TIME_OPTIONS.map((time) => (
                <ToggleGroupItem
                  key={time}
                  value={String(time)}
                  aria-label={`${time} seconds`}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    testMode.time === time ? 
                    'bg-yellow-300/20 text-yellow-300 data-[state=on]:bg-yellow-300/20 data-[state=on]:text-yellow-300' : 
                    'text-gray-400 hover:bg-[#1a1a1f] hover:text-gray-200'
                  }`}
                >
                  {time}
                </ToggleGroupItem>
              ))}
              
              <ToggleGroupItem 
                value="custom"
                aria-label="Custom time"
                onClick={() => setIsCustomTimeDialogOpen(true)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  !DEFAULT_TIME_OPTIONS.includes(testMode.time) ? 
                  'bg-yellow-300/20 text-yellow-300 data-[state=on]:bg-yellow-300/20 data-[state=on]:text-yellow-300' : 
                  'text-gray-400 hover:bg-[#1a1a1f] hover:text-gray-200'
                }`}
              >
                <Clock className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <Separator 
              orientation="vertical" 
              className="mx-2 h-6 bg-gray-700/50 w-[2px] self-center" 
            />

            <div className="flex items-center space-x-1">
              <ToggleGroup 
                type="single" 
                value={testMode.numbers ? 'numbers' : 'default'}
                onValueChange={(value) => {
                  if (value) handleModeChange('numbers', value === 'numbers');
                }}
                className="flex items-center"
              >
                <ToggleGroupItem 
                  value="default"
                  className={`px-2 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                    !testMode.numbers ? 
                    'bg-yellow-300/20 text-yellow-300 data-[state=on]:bg-yellow-300/20 data-[state=on]:text-yellow-300' : 
                    'text-gray-400 hover:bg-[#1a1a1f] hover:text-gray-200'
                  }`}
                >
                  <Type className="h-4 w-4" />
                  <span className="text-xs">Обычный</span>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="numbers"
                  className={`px-2 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                    testMode.numbers ? 
                    'bg-yellow-300/20 text-yellow-300 data-[state=on]:bg-yellow-300/20 data-[state=on]:text-yellow-300' : 
                    'text-gray-400 hover:bg-[#1a1a1f] hover:text-gray-200'
                  }`}
                >
                  <Hash className="h-4 w-4" />
                  <span className="text-xs">Числа</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>

        <div className="text-center mb-2">
          {startTime !== null && (
            <span className="font-mono text-2xl font-light text-yellow-300">{timeLeft}</span>
          )}
        </div>
        
        <div 
          ref={containerRef}
          className="text-center mb-6 leading-relaxed relative w-full cursor-text" 
          onClick={handleContainerClick}
        >
          <div 
            className={`${!isFocused ? 'blur-[3px]' : ''} transition-none max-w-2xl mx-auto`}
            style={{ 
              wordWrap: 'break-word',
              wordBreak: 'normal',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.8',
              height: '7.2em',
              overflow: 'hidden',
              userSelect: 'none'
            }}
          >
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
                className="p-2 rounded-full hover:bg-yellow-300/20 transition-colors group"
              >
                <RefreshCw 
                  size={24} 
                  className="group-hover:text-yellow-300 transition-colors text-gray-500" 
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
                className="p-2 rounded-full hover:bg-yellow-300/20 transition-colors group"
              >
                <RefreshCw 
                  size={20} 
                  className="group-hover:text-yellow-300 transition-colors text-gray-500" 
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
      
      <Dialog open={isCustomTimeDialogOpen} onOpenChange={setIsCustomTimeDialogOpen}>
        <DialogContent className="bg-[#121318] border-0 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Продолжительность теста</DialogTitle>
            <DialogDescription>
              Введите желаемую продолжительность теста
            </DialogDescription>
          </DialogHeader>
          <Input 
            type="text" 
            placeholder="Например: 30, 1m, 1h30m" 
            className="bg-[#1a1a1f] border-0 text-gray-300"
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
          />
          <p className="text-xs text-gray-400 -mt-1">
            Вы можете использовать «h» для часов и «m» для минут, например «1h30m».
          </p>
          <DialogFooter>
            <Button 
              onClick={applyCustomTime}
              className="bg-yellow-300/20 text-yellow-300 hover:bg-yellow-300/30"
            >
              Применить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TypingTest;
