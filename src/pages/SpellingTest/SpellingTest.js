import React, { useState, useEffect, useRef } from "react";
import WordData from "../../data/WordData";

const SpellingTest = () => {
  const categories = ["all", ...Object.keys(WordData)];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [numberOfWords, setNumberOfWords] = useState(5);
  const [testWords, setTestWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && testStarted) {
      inputRef.current.focus();
    }
  }, [currentIndex, testStarted]);

  // Start test handler
  const startTest = () => {
    const wordsFromCategory =
      selectedCategory === "all"
        ? Object.values(WordData).flat()
        : WordData[selectedCategory] || [];

    const count = Math.min(numberOfWords, wordsFromCategory.length);

    // Shuffle and slice
    const shuffled = [...wordsFromCategory].sort(() => 0.5 - Math.random());
    setTestWords(shuffled.slice(0, count));

    // Reset state
    setCurrentIndex(0);
    setAnswers([]);
    setInputValue("");
    setShowResult(false);
    setTestStarted(true);
  };

  // Speech synthesis for current word
  const speakCurrentWord = () => {
    if (testWords.length === 0 || showResult) return;
    const utterance = new SpeechSynthesisUtterance(testWords[currentIndex]);
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (testStarted) {
      speakCurrentWord();
    }
  }, [currentIndex, testWords, showResult, testStarted]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!inputValue.trim()) return; // ignore empty submissions

      setAnswers((prev) => [...prev, inputValue.trim()]);
      setInputValue("");

      if (currentIndex + 1 < testWords.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowResult(true);
        setTestStarted(false);
      }
    }
  };

  const correctCount = answers.reduce((count, answer, i) => {
    if (answer.toLowerCase() === testWords[i].toLowerCase()) return count + 1;
    return count;
  }, 0);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {!testStarted && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
            Select Test Settings
          </h2>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setNumberOfWords(5); // Reset number when category changes
              }}
              className="w-full border border-gray-400 rounded px-3 py-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Words" : cat}
                </option>
              ))}

            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-semibold">
              Number of words (max {
                selectedCategory === "all"
                  ? Object.values(WordData).flat().length
                  : (WordData[selectedCategory]?.length || 0)
              }):
            </label>

            <input
              type="number"
              min={1}
              max={
                selectedCategory === "all"
                  ? Object.values(WordData).flat().length
                  : (WordData[selectedCategory]?.length || 0)
              }


              value={numberOfWords}
              onChange={(e) => {
                const maxWords =
                  selectedCategory === "all"
                    ? Object.values(WordData).flat().length
                    : (WordData[selectedCategory]?.length || 0);
                setNumberOfWords(Math.min(Math.max(1, +e.target.value), maxWords));
              }}

              className="w-full border border-gray-400 rounded px-3 py-2"
            />
          </div>

          <button
            onClick={startTest}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors shadow-md w-full"
          >
            Start Test
          </button>
        </>
      )}

      {testStarted && !showResult && testWords.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Spelling Test</h2>
          <p className="mb-4 text-center text-gray-700 font-medium">
            Word {currentIndex + 1} of {testWords.length}
          </p>

          <div className="flex items-center space-x-3">
            <input
              ref={inputRef}
              type="text"
              className="flex-grow border border-gray-400 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type the word you hear and press Enter"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              onClick={speakCurrentWord}
              aria-label="Listen Again"
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded text-white shadow-md transition-colors"
              title="Listen again"
              type="button"
            >
              {/* Speaker icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a10 10 0 010 14.14" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.54 8.46a5 5 0 010 7.07" />
              </svg>
            </button>
          </div>
        </>
      )}

      {showResult && (
        <div className="mb-6 text-left">
          <p className="mt-4 font-semibold text-center text-gray-800">
            🎯 Score: {correctCount} / {testWords.length}
          </p>
          {testWords.map((word, i) => {
            const userAnswer = answers[i] || "";
            const isCorrect = userAnswer.toLowerCase() === word.toLowerCase();
            return (
              <div key={i} className="mb-2">
                <span className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {i + 1}. Your answer: "{userAnswer}"
                </span>
                {!isCorrect && (
                  <span className="ml-2 text-blue-700">
                    Correct: "{word}"
                  </span>
                )}
              </div>

            );
          })}
        </div>
      )}
    </div>
  );
};

export default SpellingTest;
