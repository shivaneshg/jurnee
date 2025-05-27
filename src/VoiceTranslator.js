import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import './index.css';

const VoiceTranslator = () => {
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en-US');
  const [targetLang, setTargetLang] = useState('hi');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: sourceLang });
  };

  const handleTranslate = async () => {
    if (!transcript) return alert("No speech detected!");

    try {
      const response = await axios.get(`https://api.mymemory.translated.net/get`, {
        params: {
          q: transcript,
          langpair: `${sourceLang.split('-')[0]}|${targetLang}`
        }
      });

      if (response.data && response.data.responseData) {
        setTranslatedText(response.data.responseData.translatedText);
      } else {
        throw new Error('Translation response format unexpected');
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate');
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }

  const languageOptions = [
    { code: "en-US", label: "English (US)" },
    { code: "en-GB", label: "English (UK)" },
    { code: "hi-IN", label: "Hindi" },
    { code: "ta-IN", label: "Tamil" },
    { code: "te-IN", label: "Telugu" },
    { code: "kn-IN", label: "Kannada" },
    { code: "ml-IN", label: "Malayalam" },
    { code: "mr-IN", label: "Marathi" },
    { code: "bn-IN", label: "Bengali" },
    { code: "gu-IN", label: "Gujarati" },
    { code: "pa-IN", label: "Punjabi" },
    { code: "fr-FR", label: "French" },
    { code: "es-ES", label: "Spanish" },
    { code: "de-DE", label: "German" },
    { code: "it-IT", label: "Italian" },
    { code: "pt-PT", label: "Portuguese" },
    { code: "ru-RU", label: "Russian" },
    { code: "ja-JP", label: "Japanese" },
    { code: "zh-CN", label: "Chinese (Simplified)" },
    { code: "zh-TW", label: "Chinese (Traditional)" },
    { code: "ar-SA", label: "Arabic" },
    { code: "ko-KR", label: "Korean" },
    { code: "th-TH", label: "Thai" },
    { code: "vi-VN", label: "Vietnamese" },
    { code: "id-ID", label: "Indonesian" },
    { code: "ms-MY", label: "Malay" },
    { code: "fil-PH", label: "Filipino" },
    { code: "nl-NL", label: "Dutch" },
    { code: "sv-SE", label: "Swedish" },
    { code: "no-NO", label: "Norwegian" },
    { code: "da-DK", label: "Danish" },
    { code: "fi-FI", label: "Finnish" },
    { code: "pl-PL", label: "Polish" },
    { code: "tr-TR", label: "Turkish" },
    { code: "el-GR", label: "Greek" },
    { code: "he-IL", label: "Hebrew" },
  ];

  const targetOptions = languageOptions.map(({ code, label }) => ({
    code: code.split('-')[0],
    label,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 p-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">👋 Greetings</h1>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Detect Language:</label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full border p-2 rounded"
          >
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-1">Target Language:</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full border p-2 rounded"
          >
            {targetOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {listening && (
          <div className="flex justify-center mb-4">
            <svg
              className="h-12 w-12 text-red-600 animate-ping"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a2 2 0 00-2 2v6a2 2 0 104 0V4a2 2 0 00-2-2zm-7 8a7 7 0 1014 0H17a5 5 0 01-10 0H3z" />
            </svg>
          </div>
        )}

        <div className="flex justify-between mb-6">
          <button
            onClick={startListening}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            Start
          </button>
          <button
            onClick={SpeechRecognition.stopListening}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded ml-2"
          >
            Stop
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Detected Speech:</label>
          <textarea
            readOnly
            className="w-full border p-2 rounded min-h-[60px]"
            value={transcript}
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Translated Text:</label>
          <textarea
            readOnly
            className="w-full border p-2 rounded min-h-[60px]"
            value={translatedText}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={resetTranscript}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Reset
          </button>

          <button
            onClick={handleTranslate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Translate
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceTranslator;
