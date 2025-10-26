import React, { useState, useCallback, useMemo } from 'react';
import { ApiProvider, Niche, GEMINI_MODELS, CHATGPT_MODELS, GeminiModel, ChatGptModel } from './types';
import { findNiches, writeScript } from './services/aiService';
import { SparklesIcon, ClipboardIcon, CheckIcon, LightBulbIcon, FilmIcon, KeyIcon, ServerIcon } from './components/icons';

// Custom hook to sync state with localStorage for persistence
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}


const ApiConfigModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  geminiModel: GeminiModel;
  setGeminiModel: (model: GeminiModel) => void;
  chatGptApiKey: string;
  setChatGptApiKey: (key: string) => void;
  chatGptModel: ChatGptModel;
  setChatGptModel: (model: ChatGptModel) => void;
}> = ({ isOpen, onClose, geminiApiKey, setGeminiApiKey, geminiModel, setGeminiModel, chatGptApiKey, setChatGptApiKey, chatGptModel, setChatGptModel }) => {
  if (!isOpen) return null;

  const commonInputStyles = "w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";
  const commonSelectStyles = `${commonInputStyles} appearance-none`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg shadow-2xl animate-fade-in-scale-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Cấu hình API & Model</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">&times;</button>
        </div>
        <div className="p-6 space-y-6">
          {/* Gemini Config */}
          <div className="space-y-4 p-4 bg-gray-900/40 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-lg text-indigo-400">Cấu hình Gemini</h3>
            <div>
              <label htmlFor="gemini-key-modal" className="block text-sm font-medium text-gray-400 mb-1.5">Gemini API Key</label>
              <div className="relative">
                <KeyIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="gemini-key-modal" type="password" value={geminiApiKey} onChange={(e) => setGeminiApiKey(e.target.value)} placeholder="Nhập API key của bạn" className={commonInputStyles} />
              </div>
            </div>
            <div>
              <label htmlFor="gemini-model-modal" className="block text-sm font-medium text-gray-400 mb-1.5">Model</label>
              <div className="relative">
                <ServerIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select id="gemini-model-modal" value={geminiModel} onChange={(e) => setGeminiModel(e.target.value as GeminiModel)} className={commonSelectStyles}>
                   {GEMINI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
          
          {/* ChatGPT Config */}
          <div className="space-y-4 p-4 bg-gray-900/40 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-lg text-teal-400">ChatGPT (Mock)</h3>
            <div>
              <label htmlFor="chatgpt-key-modal" className="block text-sm font-medium text-gray-400 mb-1.5">ChatGPT API Key</label>
              <div className="relative">
                <KeyIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="chatgpt-key-modal" type="password" value={chatGptApiKey} onChange={(e) => setChatGptApiKey(e.target.value)} placeholder="Nhập API key của bạn" className={commonInputStyles} />
              </div>
            </div>
            <div>
              <label htmlFor="chatgpt-model-modal" className="block text-sm font-medium text-gray-400 mb-1.5">Model</label>
              <div className="relative">
                 <ServerIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select id="chatgpt-model-modal" value={chatGptModel} onChange={(e) => setChatGptModel(e.target.value as ChatGptModel)} className={commonSelectStyles}>
                  {CHATGPT_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-900/30 rounded-b-2xl flex justify-end">
          <button onClick={onClose} className="bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-500 transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [apiProvider, setApiProvider] = useState<ApiProvider>(ApiProvider.Gemini);
  const [topic, setTopic] = useState<string>('');
  const [niches, setNiches] = useState<Niche[]>([]);
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);
  const [script, setScript] = useState<string>('');
  const [isLoadingNiches, setIsLoadingNiches] = useState<boolean>(false);
  const [isLoadingScript, setIsLoadingScript] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // API and Model Configuration State
  const [geminiApiKey, setGeminiApiKey] = useLocalStorage<string>('geminiApiKey', '');
  const [chatGptApiKey, setChatGptApiKey] = useLocalStorage<string>('chatGptApiKey', '');
  const [geminiModel, setGeminiModel] = useState<GeminiModel>(GEMINI_MODELS[0]);
  const [chatGptModel, setChatGptModel] = useState<ChatGptModel>(CHATGPT_MODELS[0]);

  const isFindNichesDisabled = useMemo(() => {
    if (isLoadingNiches) return true;
    if (!topic.trim()) return true;
    if (apiProvider === ApiProvider.Gemini && !geminiApiKey) return true;
    if (apiProvider === ApiProvider.ChatGPT && !chatGptApiKey) return true;
    return false;
  }, [isLoadingNiches, apiProvider, geminiApiKey, chatGptApiKey, topic]);


  const handleFindNiches = useCallback(async () => {
    if (!topic.trim()) {
      setError('Vui lòng nhập một chủ đề.');
      return;
    }

    const apiKey = apiProvider === ApiProvider.Gemini ? geminiApiKey : chatGptApiKey;
    const model = apiProvider === ApiProvider.Gemini ? geminiModel : chatGptModel;

    if (!apiKey) {
      setError(`Vui lòng nhập API Key cho ${apiProvider === ApiProvider.Gemini ? 'Gemini' : 'ChatGPT'} trong phần cấu hình.`);
      setIsApiModalOpen(true);
      return;
    }

    setIsLoadingNiches(true);
    setError(null);
    setNiches([]);
    setScript('');
    setSelectedNiche(null);

    try {
      const result = await findNiches(topic, apiProvider, { apiKey, model });
      setNiches(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
      setIsLoadingNiches(false);
    }
  }, [topic, apiProvider, geminiApiKey, chatGptApiKey, geminiModel, chatGptModel]);

  const handleWriteScript = useCallback(async (niche: Niche) => {
    setSelectedNiche(niche);
    setIsLoadingScript(true);
    setError(null);
    setScript('');
    
    const apiKey = apiProvider === ApiProvider.Gemini ? geminiApiKey : chatGptApiKey;
    const model = apiProvider === ApiProvider.Gemini ? geminiModel : chatGptModel;

    if (!apiKey) {
      setError(`API Key cho ${apiProvider === ApiProvider.Gemini ? 'Gemini' : 'ChatGPT'} không được tìm thấy. Vui lòng kiểm tra lại.`);
      setIsLoadingScript(false);
      setIsApiModalOpen(true);
      return;
    }

    try {
      const result = await writeScript(niche, apiProvider, { apiKey, model });
      setScript(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
      setIsLoadingScript(false);
    }
  }, [apiProvider, geminiApiKey, chatGptApiKey, geminiModel, chatGptModel]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const providerGeminiClasses = useMemo(() => apiProvider === ApiProvider.Gemini ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600', [apiProvider]);
  const providerChatGPTClasses = useMemo(() => apiProvider === ApiProvider.ChatGPT ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600', [apiProvider]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12">
        
        <ApiConfigModal 
          isOpen={isApiModalOpen}
          onClose={() => setIsApiModalOpen(false)}
          geminiApiKey={geminiApiKey}
          setGeminiApiKey={setGeminiApiKey}
          geminiModel={geminiModel}
          setGeminiModel={setGeminiModel}
          chatGptApiKey={chatGptApiKey}
          setChatGptApiKey={setChatGptApiKey}
          chatGptModel={chatGptModel}
          setChatGptModel={setChatGptModel}
        />

        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            YouTube Niche & Script AI
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Công cụ tìm kiếm ngách và viết kịch bản video YouTube bằng trí tuệ nhân tạo.
          </p>
        </header>

        <main className="space-y-8">
          
          {/* Step 1: Configuration & Topic Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-lg space-y-6">
            
            {/* Part 1: Provider Selection & API Config */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
               <div>
                  <label className="block text-lg font-bold text-gray-300 mb-2">1. Chọn nhà cung cấp AI</label>
                  <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-full w-fit">
                    <button onClick={() => setApiProvider(ApiProvider.Gemini)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${providerGeminiClasses}`}>
                      Gemini
                    </button>
                    <button onClick={() => setApiProvider(ApiProvider.ChatGPT)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${providerChatGPTClasses}`}>
                      ChatGPT
                    </button>
                  </div>
              </div>
               <button onClick={() => setIsApiModalOpen(true)} className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors w-full sm:w-auto">
                 <KeyIcon className="w-5 h-5" />
                 <span>Quản lý API Key</span>
               </button>
            </div>


            {/* Part 2: Topic Input */}
            <div className="border-t border-gray-700 pt-6">
              <label htmlFor="topic" className="block text-lg font-bold text-gray-300 mb-3">2. Nhập chủ đề chính</label>
              <div className="relative">
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ví dụ: Nấu ăn, Lịch sử, Du lịch..."
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <button 
                  onClick={handleFindNiches}
                  disabled={isFindNichesDisabled}
                  className="absolute inset-y-0 right-0 flex items-center px-4 m-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 disabled:bg-indigo-800/80 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  <SparklesIcon className="w-5 h-5 mr-2"/>
                  <span>{isLoadingNiches ? 'Đang tìm...' : 'Tìm ngách'}</span>
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          </div>


          {/* Step 2: Display Niches */}
          {isLoadingNiches && <div className="text-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div><p className="mt-4">AI đang tư duy, xin chờ một lát...</p></div>}
          
          {niches.length > 0 && (
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><LightBulbIcon className="w-7 h-7 text-yellow-300"/> Các ngách tiềm năng đã tìm thấy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {niches.map((niche, index) => (
                  <div key={index} className={`p-4 rounded-lg flex flex-col justify-between transition-all duration-300 ${selectedNiche?.title === niche.title ? 'bg-indigo-900/50 ring-2 ring-indigo-500' : 'bg-gray-700/60 hover:bg-gray-700/90'}`}>
                    <div>
                      <h3 className="font-bold text-lg text-indigo-300">{niche.title}</h3>
                      <p className="text-gray-400 mt-2 text-sm">{niche.description}</p>
                    </div>
                    <button 
                      onClick={() => handleWriteScript(niche)}
                      disabled={isLoadingScript}
                      className="mt-4 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoadingScript && selectedNiche?.title === niche.title ? 'Đang viết...' : 'Viết kịch bản'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Display Script */}
          {isLoadingScript && !script && <div className="text-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto"></div><p className="mt-4">AI đang sáng tạo kịch bản, vui lòng chờ...</p></div>}
          
          {script && (
            <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-3"><FilmIcon className="w-7 h-7 text-teal-300"/> Kịch bản cho: <span className="text-teal-400">{selectedNiche?.title}</span></h2>
                <button 
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                >
                  {copied ? <CheckIcon className="w-5 h-5 text-green-400"/> : <ClipboardIcon className="w-5 h-5"/>}
                  {copied ? 'Đã sao chép!' : 'Sao chép'}
                </button>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg max-h-[60vh] overflow-y-auto">
                <pre className="text-gray-300 whitespace-pre-wrap font-sans text-base leading-relaxed">{script}</pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
