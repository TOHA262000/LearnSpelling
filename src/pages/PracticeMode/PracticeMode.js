import React, { useState, useEffect, useRef } from "react";
import WordData from "../../data/WordData";

export default function PracticeMode() {
  const [started, setStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attempts, setAttempts] = useState(["", "", ""]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);

  const inputRef = useRef(null);

  const currentWord = words[currentWordIndex] || "";

  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (started && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentAttempt, started]);

  useEffect(() => {
    if (selectedCategory) {
      setWords(WordData[selectedCategory]);
      setStarted(false); // Reset session
      setCurrentWordIndex(0);
      setAttempts(["", "", ""]);
      setCurrentAttempt(0);
      setFeedback([]);
      setIsFeedbackVisible(false);
    }
  }, [selectedCategory]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const updatedAttempts = [...attempts];
    updatedAttempts[currentAttempt] = value;
    setAttempts(updatedAttempts);

    if (value.length === currentWord.length) {
      const isCorrect = value.toLowerCase() === currentWord.toLowerCase();
      const updatedFeedback = [...feedback];
      updatedFeedback[currentAttempt] = isCorrect;
      setFeedback(updatedFeedback);

      setTimeout(() => {
        if (currentAttempt === 2) {
          setIsFeedbackVisible(true);
          setTimeout(() => {
            goToNextWord();
          }, 2000);
        } else {
          setCurrentAttempt(currentAttempt + 1);
        }
      }, 500);
    }
  };

  const showFeedback = () => {
    const results = attempts.map((a) => a.toLowerCase() === currentWord.toLowerCase());
    setFeedback(results);
    setIsFeedbackVisible(true);
    setTimeout(() => {
      goToNextWord();
    }, 2500);
  };

  const goToNextWord = () => {
    if (currentWordIndex + 1 < words.length) {
      setCurrentWordIndex(currentWordIndex + 1);
      setAttempts(["", "", ""]);
      setCurrentAttempt(0);
      setFeedback([]);
      setIsFeedbackVisible(false);
      speakWord(words[currentWordIndex + 1]);
    } else {
      setStarted(false);
    }
  };

  const renderKeyboard = () => {
    const layout = [
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["z", "x", "c", "v", "b", "n", "m"],
    ];
    const typed = attempts[currentAttempt].toLowerCase();

    return (
      <div className="mt-6 space-y-2 text-center">
        {layout.map((row, i) => (
          <div key={i} className="flex justify-center space-x-1">
            {row.map((key) => (
              <div
                key={key}
                className={`w-10 h-10 flex items-center justify-center border rounded ${
                  typed.includes(key) ? "bg-blue-400 text-white" : "bg-gray-200"
                }`}
              >
                {key}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderAttemptInput = () => {
    const hideWord = currentAttempt === 2;
    return (
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Attempt {currentAttempt + 1}
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder={hideWord ? "Type the word" : currentWord}
          value={attempts[currentAttempt]}
          onChange={handleInputChange}
          className="w-full border border-gray-400 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    );
  };

  const renderFeedback = () => {
    return (
      <div className="mt-4 text-center">
        <h3 className="font-semibold mb-2">Your Results:</h3>
        <ul>
          {attempts.map((attempt, i) => (
            <li
              key={i}
              className={`py-1 ${
                feedback[i]
                  ? "text-green-600 font-semibold"
                  : "text-red-500 font-semibold"
              }`}
            >
              Attempt {i + 1}: {attempt} — {feedback[i] ? "Correct ✅" : "Wrong ❌"}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Spelling Practice</h1>

      {!selectedCategory ? (
        <div>
          <label className="block font-semibold mb-2 text-gray-700">
            Choose a Category:
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Select a category --</option>
            {Object.keys(WordData).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      ) : !started ? (
        <div className="text-center">
          <p className="mb-4">
            You will type each word 3 times. The last time, the word will be
            hidden.
          </p>
          <button
            onClick={() => {
              setStarted(true);
              speakWord(currentWord);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start
          </button>
        </div>
      ) : (
        <>
          <p className="text-center mb-2">
            Word {currentWordIndex + 1} of {words.length}
          </p>

          <div className="text-center mb-4">
            <button
              onClick={() => speakWord(currentWord)}
              className="text-blue-600 underline"
            >
              🔊 Listen
            </button>
          </div>

          {renderAttemptInput()}
          {renderKeyboard()}
          {isFeedbackVisible && renderFeedback()}
        </>
      )}
    </div>
  );
}
