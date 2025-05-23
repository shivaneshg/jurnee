import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

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
    SpeechRecognition.startListening({ 
      continuous: true, 
      language: sourceLang 
    });
  };

  const handleTranslate = async () => {
    if (!transcript) return alert("No speech detected!");

    try {
      // Using MyMemory Translation API (free, no API key needed)
      const response = await axios.get(
        `https://api.mymemory.translated.net/get`,
        {
          params: {
            q: transcript,
            langpair: `${sourceLang.split('-')[0]}|${targetLang}`
          }
        }
      );
      
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

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎤 Voice Translator</h1>

      <div className="mt-4">
        <label htmlFor="sourceLang">Speak in:</label>
        <select
          id="sourceLang"
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="ml-2 border p-1"
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="hi-IN">Hindi</option>
          <option value="ta-IN">Tamil</option>
          <option value="te-IN">Telugu</option>
          <option value="kn-IN">Kannada</option>
          <option value="ml-IN">Malayalam</option>
          <option value="mr-IN">Marathi</option>
          <option value="bn-IN">Bengali</option>
          <option value="gu-IN">Gujarati</option>
          <option value="pa-IN">Punjabi</option>
          <option value="fr-FR">French</option>
          <option value="es-ES">Spanish</option>
          <option value="de-DE">German</option>
          <option value="it-IT">Italian</option>
          <option value="pt-PT">Portuguese</option>
          <option value="ru-RU">Russian</option>
          <option value="ja-JP">Japanese</option>
          <option value="zh-CN">Chinese (Simplified)</option>
          <option value="zh-TW">Chinese (Traditional)</option>
          <option value="ar-SA">Arabic</option>
          <option value="ko-KR">Korean</option>
          <option value="th-TH">Thai</option>
          <option value="vi-VN">Vietnamese</option>
          <option value="id-ID">Indonesian</option>
          <option value="ms-MY">Malay</option>
          <option value="fil-PH">Filipino</option>
          <option value="nl-NL">Dutch</option>
          <option value="sv-SE">Swedish</option>
          <option value="no-NO">Norwegian</option>
          <option value="da-DK">Danish</option>
          <option value="fi-FI">Finnish</option>
          <option value="pl-PL">Polish</option>
          <option value="tr-TR">Turkish</option>
          <option value="el-GR">Greek</option>
          <option value="he-IL">Hebrew</option>
        </select>
      </div>

      <div className="mt-4 flex">
        <button
          onClick={startListening}
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
      </div>

      <div className="mt-4">
        <p><strong>Detected Speech:</strong> {transcript}</p>
      </div>

      <div className="mt-4">
        <label htmlFor="targetLang">Translate to:</label>
        <select
          id="targetLang"
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="ml-2 border p-1"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="kn">Kannada</option>
          <option value="ml">Malayalam</option>
          <option value="mr">Marathi</option>
          <option value="bn">Bengali</option>
          <option value="gu">Gujarati</option>
          <option value="pa">Punjabi</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="ja">Japanese</option>
          <option value="zh">Chinese (Simplified)</option>
          <option value="zh-TW">Chinese (Traditional)</option>
          <option value="ar">Arabic</option>
          <option value="ko">Korean</option>
          <option value="th">Thai</option>
          <option value="vi">Vietnamese</option>
          <option value="id">Indonesian</option>
          <option value="ms">Malay</option>
          <option value="tl">Filipino/Tagalog</option>
          <option value="nl">Dutch</option>
          <option value="sv">Swedish</option>
          <option value="no">Norwegian</option>
          <option value="da">Danish</option>
          <option value="fi">Finnish</option>
          <option value="pl">Polish</option>
          <option value="tr">Turkish</option>
          <option value="el">Greek</option>
          <option value="he">Hebrew</option>
        </select>
      </div>

      <button
        onClick={handleTranslate}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Translate
      </button>

      <div className="mt-4">
        <p><strong>Translated Text:</strong> {translatedText}</p>
      </div>
    </div>
  );
};

export default VoiceTranslator;