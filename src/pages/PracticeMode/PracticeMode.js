import React, { useState, useEffect, useRef } from "react";
import WordData from "../../data/WordData";
import formatCategoryName from "../../components/formatCategoryName";
import useSpeechSynthesis from "../../hook/useSpeechSynthesis";
import toast, { Toaster } from "react-hot-toast";
export default function PracticeMode() {
  const { speak } = useSpeechSynthesis();
  const [started, setStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attempts, setAttempts] = useState(["", "", ""]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [feedback, setFeedback] = useState([]);
  const inputRef = useRef(null);
  const currentWord = words[currentWordIndex] || "";


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
          const resultsText = updatedAttempts
            .map((attempt, i) => {
              const attemptNum = `${i + 1}${["st", "nd", "rd"][i] || "th"} attempt`;
              const status = updatedFeedback[i] ? "✅ Correct" : "❌ Wrong";
              return `${attemptNum}: ${attempt} — ${status}`;
            })
            .join("\n");

          toast(
            <div className="text-center whitespace-pre-line leading-relaxed">
              <h2 className="text-base font-semibold text-blue-400 mb-2">
                {currentWord}
              </h2>
              <p className="text-sm">{resultsText}</p>
            </div>,
            {
              duration: 5000,
              position: "top-center",
              style: {
                background: "#1f2937", // dark gray
                color: "#f9fafb", // near white
                fontSize: "15px",
                padding: "16px 24px",
                borderRadius: "12px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                maxWidth: "320px",
                margin: "0 auto",
              },
            }
          );

          // Move to next word after showing the toast
          setTimeout(() => {
            goToNextWord();
          }, 2000);
        } else {
          setCurrentAttempt(currentAttempt + 1);
        }
      }, 500);


    }
  };

  const goToNextWord = () => {
    if (currentWordIndex + 1 < words.length) {
      setCurrentWordIndex(currentWordIndex + 1);
      setAttempts(["", "", ""]);
      setCurrentAttempt(0);
      setFeedback([]);
      speak(words[currentWordIndex + 1]);
    } else {
      setStarted(false);
    }
  };
  const goToPreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setAttempts(["", "", ""]);
      setCurrentAttempt(0);
      setFeedback([]);
      speak(words[currentWordIndex - 1]);
    }
  };
  const handleBackToCategory = () => {
    setSelectedCategory("");
    setStarted(false);
    setCurrentWordIndex(0);
    setAttempts(["", "", ""]);
    setCurrentAttempt(0);
    setFeedback([]);
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
                className={`w-10 h-10 flex items-center justify-center border rounded ${typed.includes(key) ? "bg-blue-400 text-white" : "bg-gray-200"
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

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <Toaster position="top-center" />
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
                {formatCategoryName(category)}
              </option>
            ))}

          </select>
        </div>
      ) : !started ? (
        <div className="text-center space-x-4">
          <p className="mb-4">
            You will type each word 3 times. The last time, the word will be hidden.
          </p>
          <button
            onClick={() => {
              setStarted(true);
              speak(currentWord);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start
          </button>
          <button
            onClick={() => setSelectedCategory("")}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
          >
            Back
          </button>
        </div>
      ) : (
        <>
          <p className="text-center mb-2">
            Word {currentWordIndex + 1} of {words.length}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => speak(currentWord)}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-100 text-indigo-700 border border-indigo-300 rounded hover:bg-indigo-200 transition"
            >
              🔊 Listen
            </button>

            <button
              onClick={goToPreviousWord}
              disabled={currentWordIndex === 0}
              className={`flex items-center gap-1 px-4 py-2 border rounded transition ${currentWordIndex === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              ⬅️ Previous
            </button>

            <button
              onClick={goToNextWord}
              disabled={currentWordIndex === words.length - 1}
              className={`flex items-center gap-1 px-4 py-2 border rounded transition ${currentWordIndex === words.length - 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
                }`}
            >
              Next ➡️
            </button>

            <button
              onClick={handleBackToCategory}
              className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              🔙 Choose Category
            </button>
          </div>



          {renderAttemptInput()}
          {renderKeyboard()}
        </>
      )}
    </div>
  );
}
