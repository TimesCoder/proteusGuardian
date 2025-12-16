import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertTriangle, Volume2, VolumeX, Mic, MicOff, Camera, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { CONFIG } from '../config';

const CHAT_AGENT_API_URL = CONFIG.ENDPOINTS.CHAT;

const initialMessages = [
  {
    type: 'ai',
    content: 'Halo! Saya adalah Predictive Maintenance Copilot Anda. Saya siap membantu memantau kesehatan mesin.'
  }
];

// Utility: Clean markdown
const cleanMarkdown = (text) => {
  if (!text) return text;
  return text
    .replace(/#{1,6}\s*/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/---+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export const Chatbot = () => {
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // --- SPEECH RECOGNITION ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'id-ID';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast("Browser tidak mendukung input suara.", { icon: '⚠️' });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
      toast.success('Mendengarkan...', { position: 'bottom-center' });
    }
  };

  // --- TTS ---
  const speakText = (text) => {
    if (!isTTSEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_`#]/g, '').replace(/\[.*?\]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id')) || voices[0];
    if (idVoice) utterance.voice = idVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleTTS = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsTTSEnabled(!isTTSEnabled);
  };

  // --- IMAGE HANDLING ---
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Maksimal 5MB');
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
    setMessages(prev => [...prev, { type: 'human', content: '📷 Menganalisis gambar...', image: imagePreview }]);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/chat/analyze-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_base64: base64Data, mime_type: selectedImage.type }),
        });
        if (!response.ok) throw new Error('Gagal analisis');
        const data = await response.json();
        const aiResponse = cleanMarkdown(data.response);
        setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
        speakText(aiResponse);
        clearImage();
      };
    } catch (error) {
      setMessages(prev => [...prev, { type: 'error', content: 'Gagal menganalisis gambar.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  // --- SEND MESSAGE ---
  const handleSend = async (e) => {
    e.preventDefault();
    const userInput = input.trim();
    if (!userInput || isThinking) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const newUserMessage = { type: 'human', content: userInput };
    setMessages([...messages, newUserMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await fetch(CHAT_AGENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_input: userInput,
          history: messages.map(msg => ({ type: msg.type, content: msg.content }))
        }),
      });

      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      const cleanedResponse = cleanMarkdown(data.response);
      setMessages(prev => [...prev, { type: 'ai', content: cleanedResponse }]);
      speakText(cleanedResponse);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'error', content: 'Gagal terhubung ke server.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    /* PERUBAHAN DI SINI:
       Gunakan 'h-full' agar container mengisi penuh area yang disediakan MainLayout.
       MainLayout sudah mengatur padding dan height, jadi 'h-full' akan pas mentok bawah.
    */
    <div className="flex flex-col h-full bg-dark-800 rounded-xl border border-dark-700 shadow-2xl overflow-hidden relative">
      <Toaster />

      {/* HEADER */}
      <div className="shrink-0 p-4 bg-dark-900/80 border-b border-dark-700 flex items-center justify-between backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-dark-800 p-2 rounded-lg border border-dark-600">
            {isThinking ? (
                <Loader2 size={20} className="text-accent-cyan animate-spin" />
            ) : (
                <span className="text-xl">🤖</span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-base text-white">Copilot Assistant</h3>
            <p className="text-xs text-accent-cyan/80 font-mono">
                {isThinking ? 'Processing...' : 'Online & Ready'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleTTS}
          className={`p-2 rounded-lg transition-all ${
            isTTSEnabled ? 'bg-accent-cyan text-black' : 'bg-dark-700 text-gray-400'
          }`}
        >
          {isTTSEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>

      {/* CHAT AREA (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-dark-800 to-dark-900 min-h-0">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'human' ? 'justify-end' : 'justify-start'}`}>
            
            {msg.type !== 'human' && (
                <div className="w-8 h-8 rounded-full bg-dark-700 border border-dark-600 flex items-center justify-center mr-2 shrink-0 self-start mt-1">
                    {msg.type === 'error' ? <AlertTriangle size={14} className="text-red-500"/> : <span className="text-sm">🤖</span>}
                </div>
            )}

            <div className={`relative max-w-[85%] md:max-w-[75%] p-3.5 rounded-2xl text-sm md:text-base shadow-md ${
                msg.type === 'human' 
                ? 'bg-accent-cyan text-black rounded-tr-none' 
                : msg.type === 'error'
                ? 'bg-red-900/30 text-red-200 border border-red-800 rounded-tl-none'
                : 'bg-dark-700 text-gray-100 border border-dark-600 rounded-tl-none pb-8'
            }`}>
              {msg.image && (
                <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                    <img src={msg.image} alt="Uploaded" className="max-w-full h-40 object-cover" />
                </div>
              )}
              
              <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.content}
              </div>

              {msg.type === 'ai' && isTTSEnabled && (
                  <button 
                      onClick={() => speakText(msg.content)} 
                      className="absolute bottom-2 right-2 text-xs font-medium text-gray-400 hover:text-white flex items-center gap-1 bg-dark-800/50 px-2 py-1 rounded transition-colors"
                  >
                      <Volume2 size={12} /> Read
                  </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA (Fixed at bottom) */}
      <div className="shrink-0 p-3 md:p-4 bg-dark-800 border-t border-dark-700 z-10">
        {imagePreview && (
            <div className="flex items-center gap-3 mb-3 bg-dark-900/50 p-2 rounded-lg border border-dark-600">
                <div className="relative">
                    <img src={imagePreview} alt="Preview" className="h-12 w-12 object-cover rounded border border-dark-500" />
                    <button onClick={clearImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={10} /></button>
                </div>
                <p className="text-xs text-accent-cyan truncate">Image Selected</p>
            </div>
        )}

        <form 
            onSubmit={(e) => {
                e.preventDefault();
                selectedImage ? handleImageAnalysis() : handleSend(e);
            }} 
            className="flex items-end gap-2"
        >
          <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />

          <div className="flex bg-dark-900 rounded-xl border border-dark-600 p-1 shrink-0">
             <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2.5 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition">
                <Camera size={20} />
             </button>
             <button type="button" onClick={toggleListening} className={`p-2.5 rounded-lg transition ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}>
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
             </button>
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedImage ? "Kirim gambar..." : (isListening ? "Mendengarkan..." : "Ketik pesan...")}
            disabled={isThinking || !!selectedImage}
            className="w-full bg-dark-900 text-white placeholder-gray-500 border border-dark-600 rounded-xl px-4 py-3 focus:border-accent-cyan focus:outline-none transition disabled:opacity-50 text-sm md:text-base flex-1 min-w-0"
          />

          <button
            type="submit"
            disabled={isThinking || (!input.trim() && !selectedImage)}
            className="p-3 bg-accent-cyan text-black rounded-xl hover:bg-cyan-400 disabled:bg-dark-700 disabled:text-gray-500 disabled:cursor-not-allowed transition shrink-0"
          >
            {isThinking ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;