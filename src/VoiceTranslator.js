import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const VoiceTranslator = () => {
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('hi'); 

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleTranslate = async () => {
    if (!transcript) return alert("No speech detected!");

    try {
      const response = await axios.post(
        'https://sarvam.ai/api/translate',
        {
          source: transcript,
          target_lang: targetLang,
          source_lang: 'en'
        },
        {
          headers: {
            Authorization: 'Bearer YOUR_SARVAM_API_KEY',
            'Content-Type': 'application/json'
          }
        }
      );
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Failed to translate');
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎤 Voice Translator</h1>

      <button
        onClick={SpeechRecognition.startListening}
        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
      >
        Start Listening
      </button>

      <button
        onClick={SpeechRecognition.stopListening}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Stop Listening
      </button>

      <div className="mt-4">
        <p><strong>Detected Speech:</strong> {transcript}</p>
      </div>

      <div className="mt-4">
        <label htmlFor="language">Translate to:</label>
        <select
          id="language"
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="ml-2 border p-1"
        >
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="kn">Kannada</option>
          <option value="ml">Malayalam</option>
          {/* Add more as per SarvamAI support */}
        </select>
      </div>

      <button
        onClick={handleTranslate}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Translate
      </button>

      <div className="mt-4">
        <p><strong>Translated Text:</strong>{translatedText}</p>
      </div>
    </div>
  );
};

export default VoiceTranslator;
