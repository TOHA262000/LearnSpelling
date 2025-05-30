import { useState, useEffect } from "react";

export default function useSpeechSynthesis() {
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const voices = synth.getVoices();
      if (!voices || voices.length === 0) return;

      const preferredVoice =
        voices.find((v) => v.name === "Google UK English Female") ||
        voices.find((v) => v.name.includes("Zira")) ||
        voices.find((v) => v.lang === "en-US");

      setSelectedVoice(preferredVoice || voices[0]);
    };

    loadVoices();

    synth.addEventListener("voiceschanged", loadVoices);

    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speak = (text, options = {}) => {
    if (!selectedVoice) {
      console.warn("Voice not loaded yet");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;

    window.speechSynthesis.speak(utterance);
  };

  return { selectedVoice, speak };
}
