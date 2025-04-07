
// A collection of short text samples for typing practice
const textSamples = [
  "The quick brown fox jumps over the lazy dog.",
  "She sells seashells by the seashore.",
  "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
  "Peter Piper picked a peck of pickled peppers.",
  "All human beings are born free and equal in dignity and rights.",
  "Be yourself; everyone else is already taken.",
  "Two things are infinite: the universe and human stupidity.",
  "So many books, so little time.",
  "A room without books is like a body without a soul.",
  "You only live once, but if you do it right, once is enough.",
  "In three words I can sum up everything I've learned about life: it goes on.",
  "If you tell the truth, you don't have to remember anything.",
  "A friend is someone who knows all about you and still loves you.",
  "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
  "Always forgive your enemies; nothing annoys them so much.",
  "Live as if you were to die tomorrow. Learn as if you were to live forever.",
  "Without music, life would be a mistake.",
  "We accept the love we think we deserve.",
  "It is better to be hated for what you are than to be loved for what you are not.",
  "It does not do to dwell on dreams and forget to live.",
  "The only way to do great work is to love what you do.",
  "Life is what happens when you're busy making other plans.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "In the end, we will remember not the words of our enemies, but the silence of our friends.",
  "Darkness cannot drive out darkness; only light can do that.",
  "Be the change that you wish to see in the world.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
];

// Monkeytype-style word generator that selects random words from the samples
const getRandomWords = (count: number): string => {
  const words: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomSample = textSamples[Math.floor(Math.random() * textSamples.length)];
    const sampleWords = randomSample.split(' ');
    const randomWord = sampleWords[Math.floor(Math.random() * sampleWords.length)]
      .replace(/[,.;:?!"]/g, ''); // Remove punctuation
    
    words.push(randomWord.toLowerCase());
  }
  
  return words.join(' ');
};

// Generate a random paragraph from the samples
export const generateRandomText = (): string => {
  const randomIndex = Math.floor(Math.random() * textSamples.length);
  return textSamples[randomIndex];
};

// Generate a longer text by combining multiple samples
export const generateLongerText = (numSamples: number = 3): string => {
  // For monkeytype style, generate random words instead of sentences
  return getRandomWords(25); // Generate 25 random words for a test
};
