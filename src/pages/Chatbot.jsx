import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertTriangle, Volume2, VolumeX, Mic, MicOff, Camera, X } from 'lucide-react';

import { CONFIG } from '../config';

const CHAT_AGENT_API_URL = CONFIG.ENDPOINTS.CHAT;

const initialMessages = [
  {
    type: 'ai',
    content:
      'Halo! Saya adalah Predictive Maintenance Copilot Anda. Saya siap membantu memantau kesehatan mesin. Coba tanya "Berikan laporan status pabrik saat ini."'
  }
];

// Function to clean markdown from text
const cleanMarkdown = (text) => {
  if (!text) return text;
  return text
    .replace(/#{1,6}\s*/g, '')      // Remove # headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
    .replace(/\*(.*?)\*/g, '$1')     // Remove *italic*
    .replace(/`(.*?)`/g, '$1')       // Remove `code`
    .replace(/---+/g, '')            // Remove horizontal rules
    .replace(/\n{3,}/g, '\n\n')      // Reduce multiple newlines
    .trim();
};

export const Chatbot = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Image upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'id-ID'; // Indonesian

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Toggle Speech-to-Text
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition tidak didukung di browser ini');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Text-to-Speech function
  const speakText = (text) => {
    if (!isTTSEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Clean text for speech
    const cleanText = text
      .replace(/[*_`#]/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/[🔧🏭✅❌⚠️📊💡🤖👋🔴🟡🟢]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith('id')) || voices[0];
    if (idVoice) utterance.voice = idVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const userInput = input.trim();
    if (!userInput || isThinking) return;

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const newUserMessage = { type: 'human', content: userInput };
    const newHistory = [...messages, newUserMessage];

    setMessages(newHistory);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch(CHAT_AGENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_input: userInput,
          history: messages.map(msg => ({
            type: msg.type,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`[${response.status}] ${errorBody.slice(0, 100)}`);
      }

      const data = await response.json();
      // Clean markdown from AI response
      const cleanedResponse = cleanMarkdown(data.response);

      setMessages([...newHistory, { type: 'ai', content: cleanedResponse }]);
      speakText(cleanedResponse);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          type: 'error',
          content:
            `Koneksi gagal. Server mungkin sedang memproses atau belum siap.\n${error.message}`
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleTTS = () => {
    if (isSpeaking) stopSpeaking();
    setIsTTSEnabled(!isTTSEnabled);
  };

  // Image handling functions
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File terlalu besar. Maksimal 5MB.');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageAnalysis = async () => {
    if (!selectedImage) return;

    setIsThinking(true);
    setMessages(prev => [...prev, {
      type: 'human',
      content: `📷 Menganalisis gambar mesin...`,
      image: imagePreview
    }]);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);

      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        const mimeType = selectedImage.type;

        const response = await fetch(`${CONFIG.API_BASE_URL}/api/chat/analyze-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_base64: base64Data,
            machine_id: 'User Upload',
            mime_type: mimeType
          }),
        });

        if (!response.ok) {
          throw new Error(`[${response.status}] Gagal menganalisis gambar`);
        }

        const data = await response.json();
        setMessages(prev => [...prev, { type: 'ai', content: data.response }]);
        speakText(data.response);
        clearImage();
        setIsThinking(false);
      };

      reader.onerror = () => {
        throw new Error('Gagal membaca file gambar');
      };

    } catch (error) {
      setMessages(prev => [...prev, { type: 'error', content: `Gagal analisis: ${error.message}` }]);
      setIsThinking(false);
    }
  };

  const isSendDisabled = isThinking || (!input.trim() && !selectedImage);
  const sendButtonClass = isSendDisabled
    ? 'bg-cyan-600/50 cursor-not-allowed'
    : 'bg-accent-cyan hover:bg-cyan-400 text-black active:scale-95 shadow-md';

  return (
    <div className="flex flex-col h-full bg-dark-800 rounded-xl border border-dark-700 shadow-2xl text-white">

      {/* HEADER */}
      <div className="p-3 sm:p-4 border-b border-dark-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader2 size={18} className="text-accent-cyan animate-pulse" />
          <h3 className="font-bold text-base sm:text-lg">
            Predictive Maintenance Copilot
          </h3>
        </div>

        {/* TTS Toggle Button */}
        <button
          onClick={toggleTTS}
          title={isTTSEnabled ? "Matikan Text-to-Speech" : "Aktifkan Text-to-Speech"}
          className={`
            p-2 rounded-lg transition
            ${isTTSEnabled
              ? 'bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30'
              : 'bg-dark-700 text-gray-500 hover:text-gray-400'}
            ${isSpeaking ? 'animate-pulse' : ''}
          `}
        >
          {isTTSEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'human' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[85%] sm:max-w-md
                p-2.5 sm:p-3 rounded-xl shadow-lg whitespace-pre-wrap
                text-sm sm:text-base
                ${msg.type === 'human'
                  ? 'bg-accent-purple text-white rounded-br-none'
                  : msg.type === 'error'
                    ? 'bg-red-900/50 text-red-300 rounded-tl-none border border-red-700'
                    : 'bg-dark-700 text-gray-200 rounded-tl-none'
                }
                ${msg.type === 'error' && 'flex items-start gap-2'}
              `}
            >
              {msg.type === 'error' && <AlertTriangle size={16} />}
              {msg.content}

              {/* Speak button for AI messages */}
              {msg.type === 'ai' && isTTSEnabled && (
                <button
                  onClick={() => speakText(msg.content)}
                  className="mt-2 text-xs text-accent-cyan/70 hover:text-accent-cyan flex items-center gap-1"
                >
                  <Volume2 size={12} /> Putar
                </button>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-dark-700/70 text-gray-400 p-2.5 rounded-xl italic flex items-center gap-2 text-sm">
              <Loader2 size={16} className="animate-spin" />
              Agent is thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* IMAGE PREVIEW (shown above input when image selected) */}
      {imagePreview && (
        <div className="p-3 border-t border-dark-700 bg-dark-800">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-24 rounded-lg border border-dark-600"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Gambar siap dianalisis</p>
        </div>
      )}

      {/* INPUT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (selectedImage) {
            handleImageAnalysis();
          } else {
            handleSend(e);
          }
        }}
        className="p-3 sm:p-4 border-t border-dark-700 flex bg-dark-800 gap-2"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />

        {/* Camera Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Upload gambar mesin"
          className="p-2.5 sm:p-3 rounded-xl transition bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600"
        >
          <Camera size={18} />
        </button>

        {/* Mic Button */}
        <button
          type="button"
          onClick={toggleListening}
          title={isListening ? "Stop listening" : "Voice input"}
          className={`
            p-2.5 sm:p-3 rounded-xl transition
            ${isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'}
          `}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={selectedImage ? "📷 Klik Kirim untuk analisis gambar" : (isListening ? "🎤 Listening..." : "Tanyakan status mesin...")}
          disabled={isThinking || selectedImage}
          className="
            flex-1 p-2.5 sm:p-3
            bg-dark-900 text-white
            rounded-xl
            focus:ring-2 focus:ring-accent-cyan
            focus:outline-none
            placeholder-gray-500
            text-sm sm:text-base
          "
        />
        <button
          type="submit"
          disabled={isSendDisabled}
          className={`
            p-2.5 sm:p-3 rounded-xl font-bold transition
            flex items-center justify-center gap-1
            ${sendButtonClass}
          `}
        >
          <Send size={18} />
          <span className="hidden sm:inline">{selectedImage ? 'Analisis' : 'Kirim'}</span>
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
