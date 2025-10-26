
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ApiProvider, AnalyzedNiche, GEMINI_MODELS, CHATGPT_MODELS, GeminiModel, ChatGptModel, ApiKey, ApiKeyStatus, SavedSession, Score } from './types';
import { findNiches, writeScript, validateApiKey } from './services/aiService';
import { SparklesIcon, ClipboardIcon, CheckIcon, LightBulbIcon, FilmIcon, KeyIcon, ServerIcon, PlusIcon, TrashIcon, SpinnerIcon, XCircleIcon, QuestionMarkCircleIcon, DollarSignIcon, UsersIcon, ClipboardDocumentListIcon, BookmarkSquareIcon, TagIcon } from './components/icons';

// Custom hook to sync state with localStorage for persistence
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
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

const ApiKeyManagerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  apiKeys: ApiKey[];
  setApiKeys: (keys: ApiKey[] | ((keys: ApiKey[]) => ApiKey[])) => void;
}> = ({ isOpen, onClose, apiKeys, setApiKeys }) => {
  const [newKeyData, setNewKeyData] = useState<{ provider: ApiProvider | null, name: string, key: string }>({ provider: null, name: '', key: '' });

  const handleValidateKey = useCallback(async (keyId: string) => {
    const keyToValidate = apiKeys.find(k => k.id === keyId);
    if (!keyToValidate) return;

    setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, status: ApiKeyStatus.Validating } : k));
    
    const isValid = await validateApiKey(keyToValidate.provider, keyToValidate.key);

    setApiKeys(prev => prev.map(k => k.id === keyId ? { ...k, status: isValid ? ApiKeyStatus.Valid : ApiKeyStatus.Invalid } : k));
  }, [apiKeys, setApiKeys]);

  const handleAddKey = () => {
    if (!newKeyData.provider || !newKeyData.key.trim()) {
      alert("Vui lòng nhập API Key.");
      return;
    }
    const newId = crypto.randomUUID();
    const keyToAdd: ApiKey = {
      id: newId,
      provider: newKeyData.provider,
      key: newKeyData.key.trim(),
      name: newKeyData.name.trim() || `Key ${newKeyData.provider} #${apiKeys.filter(k => k.provider === newKeyData.provider).length + 1}`,
      status: ApiKeyStatus.Unvalidated
    };
    setApiKeys(prev => [...prev, keyToAdd]);
    setNewKeyData({ provider: null, name: '', key: '' });
    
    // Auto-validate after adding
    setTimeout(() => handleValidateKey(newId), 100);
  };
  
  const handleDeleteKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== keyId));
  };

  const StatusIcon = ({ status }: { status: ApiKeyStatus }) => {
    switch (status) {
      case ApiKeyStatus.Valid:
        return <CheckIcon className="w-5 h-5 text-green-400" />;
      case ApiKeyStatus.Invalid:
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      case ApiKeyStatus.Validating:
        return <SpinnerIcon className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <QuestionMarkCircleIcon className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const renderKeyList = (provider: ApiProvider) => (
    <div className="space-y-3">
        {apiKeys.filter(k => k.provider === provider).map(apiKey => (
            <div key={apiKey.id} className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <StatusIcon status={apiKey.status} />
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{apiKey.name}</p>
                        <p className="text-gray-400 font-mono">{`${apiKey.key.substring(0, 4)}...${apiKey.key.substring(apiKey.key.length - 4)}`}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleValidateKey(apiKey.id)} className="text-gray-400 hover:text-white transition-colors" title="Xác thực lại">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.18-3.185m-3.181 9.995-3.182-3.182m0 0-3.182 3.182M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" /></svg>
                    </button>
                    <button onClick={() => handleDeleteKey(apiKey.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Xóa Key">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        ))}
        {newKeyData.provider === provider ? (
            <div className="bg-gray-700/50 p-3 rounded-lg space-y-3">
                <input type="text" placeholder="Tên gợi nhớ (ví dụ: Key cá nhân)" value={newKeyData.name} onChange={e => setNewKeyData({...newKeyData, name: e.target.value})} className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1.5 text-sm" />
                <input type="password" placeholder="Dán API Key vào đây" value={newKeyData.key} onChange={e => setNewKeyData({...newKeyData, key: e.target.value})} className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1.5 text-sm" />
                <div className="flex gap-2 justify-end">
                    <button onClick={() => setNewKeyData({provider: null, name: '', key: ''})} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded text-sm transition-colors">Hủy</button>
                    <button onClick={handleAddKey} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1 px-3 rounded text-sm transition-colors">Lưu & Xác thực</button>
                </div>
            </div>
        ) : (
            <button onClick={() => setNewKeyData({provider, name: '', key: ''})} className="w-full flex items-center justify-center gap-2 bg-gray-700/80 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                <PlusIcon className="w-5 h-5" /> Thêm Key mới
            </button>
        )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg shadow-2xl animate-fade-in-scale-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Quản lý API Key</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4 p-4 bg-gray-900/40 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-lg text-indigo-400">Cấu hình Gemini</h3>
            {renderKeyList(ApiProvider.Gemini)}
          </div>
          <div className="space-y-4 p-4 bg-gray-900/40 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-lg text-teal-400">ChatGPT (Mock)</h3>
            {renderKeyList(ApiProvider.ChatGPT)}
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

const LibraryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  sessions: SavedSession[];
  onLoad: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
}> = ({ isOpen, onClose, sessions, onLoad, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-2xl shadow-2xl animate-fade-in-scale-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <BookmarkSquareIcon className="w-6 h-6 text-purple-400"/>
            Thư viện phiên làm việc
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {sessions.length === 0 ? (
            <p className="text-center text-gray-400 py-8">Thư viện của bạn trống. Hãy tìm kiếm và lưu lại kết quả!</p>
          ) : (
            <div className="space-y-4">
              {sessions.map(session => (
                <div key={session.id} className="bg-gray-700/50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-lg text-white">{session.name}</p>
                    <p className="text-sm text-gray-400 mt-1">Chủ đề: <span className="font-semibold text-gray-300">{session.topic}</span></p>
                    <p className="text-xs text-gray-500 mt-2">Đã lưu: {new Date(session.timestamp).toLocaleString('vi-VN')}</p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button onClick={() => onLoad(session.id)} className="w-full sm:w-auto flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">Tải lại</button>
                    <button onClick={() => onDelete(session.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors" title="Xóa phiên">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
  const [apiProvider, setApiProvider] = useState<ApiProvider>(ApiProvider.ChatGPT);
  const [topic, setTopic] = useState<string>('');
  const [niches, setNiches] = useState<AnalyzedNiche[]>([]);
  const [selectedNiche, setSelectedNiche] = useState<AnalyzedNiche | null>(null);
  const [script, setScript] = useState<string>('');
  const [isLoadingNiches, setIsLoadingNiches] = useState<boolean>(false);
  const [isLoadingScript, setIsLoadingScript] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // State for saved sessions
  const [savedSessions, setSavedSessions] = useLocalStorage<SavedSession[]>('savedSessions', []);

  // API Key Management State
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKey[]>('apiKeys', []);
  const [geminiModel, setGeminiModel] = useState<GeminiModel>(GEMINI_MODELS[0]);
  const [chatGptModel, setChatGptModel] = useState<ChatGptModel>(CHATGPT_MODELS[0]);

  const hasValidKeyForProvider = useMemo(() => {
    return apiKeys.some(k => k.provider === apiProvider && k.status === ApiKeyStatus.Valid);
  }, [apiKeys, apiProvider]);

  const isFindNichesDisabled = useMemo(() => {
    if (isLoadingNiches) return true;
    if (!topic.trim()) return true;
    return !hasValidKeyForProvider;
  }, [isLoadingNiches, topic, hasValidKeyForProvider]);

  const getApiKeyForProvider = useCallback((provider: ApiProvider): string | null => {
      const validKey = apiKeys.find(k => k.provider === provider && k.status === ApiKeyStatus.Valid);
      return validKey ? validKey.key : null;
  }, [apiKeys]);


  const handleFindNiches = useCallback(async () => {
    if (!topic.trim()) {
      setError('Vui lòng nhập một chủ đề.');
      return;
    }

    const apiKey = getApiKeyForProvider(apiProvider);
    const model = apiProvider === ApiProvider.Gemini ? geminiModel : chatGptModel;

    if (!apiKey) {
      setError(`Vui lòng thêm và xác thực một API Key cho ${apiProvider === ApiProvider.Gemini ? 'Gemini' : 'ChatGPT'}.`);
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
  }, [topic, apiProvider, getApiKeyForProvider, geminiModel, chatGptModel]);

  const handleWriteScript = useCallback(async (niche: AnalyzedNiche) => {
    setSelectedNiche(niche);
    setIsLoadingScript(true);
    setError(null);
    setScript('');
    
    const apiKey = getApiKeyForProvider(apiProvider);
    const model = apiProvider === ApiProvider.Gemini ? geminiModel : chatGptModel;

    if (!apiKey) {
      setError(`API Key hợp lệ cho ${apiProvider === ApiProvider.Gemini ? 'Gemini' : 'ChatGPT'} không được tìm thấy.`);
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
  }, [apiProvider, getApiKeyForProvider, geminiModel, chatGptModel]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSession = () => {
    if (niches.length === 0) {
      alert("Không có gì để lưu. Vui lòng tìm kiếm ngách trước.");
      return;
    }
    const sessionName = prompt("Nhập tên cho phiên làm việc này:", `Chủ đề: ${topic}`);
    if (sessionName && sessionName.trim()) {
      const newSession: SavedSession = {
        id: crypto.randomUUID(),
        name: sessionName.trim(),
        timestamp: new Date().toISOString(),
        topic,
        niches,
        selectedNiche,
        script,
        provider: apiProvider,
      };
      setSavedSessions(prev => [newSession, ...prev]);
      alert(`Đã lưu phiên làm việc "${sessionName.trim()}"!`);
    }
  };

  const handleLoadSession = (sessionId: string) => {
    const sessionToLoad = savedSessions.find(s => s.id === sessionId);
    if (sessionToLoad) {
      setTopic(sessionToLoad.topic);
      setNiches(sessionToLoad.niches);
      setSelectedNiche(sessionToLoad.selectedNiche);
      setScript(sessionToLoad.script);
      setApiProvider(sessionToLoad.provider);
      setError(null);
      setIsLibraryOpen(false);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa phiên làm việc này không?")) {
      setSavedSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  const ScoreDisplay: React.FC<{
    icon: React.ReactNode;
    title: string;
    scoreData: Score;
    isCompetition?: boolean;
  }> = ({ icon, title, scoreData, isCompetition = false }) => {
    const { score, explanation } = scoreData;
    let progressBarColor = 'bg-blue-500'; // Default
  
    if (isCompetition) {
      if (score <= 3) progressBarColor = 'bg-green-500'; // Low competition is good
      else if (score <= 7) progressBarColor = 'bg-yellow-500'; // Medium
      else progressBarColor = 'bg-red-500'; // High competition is bad
    } else {
       if (score >= 8) progressBarColor = 'bg-green-500'; // High potential is good
      else if (score >= 4) progressBarColor = 'bg-yellow-500'; // Medium
      else progressBarColor = 'bg-red-500'; // Low potential is bad
    }

    return (
      <div>
        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-1.5">
          {icon}
          {title}
        </h4>
        <div className="flex items-center gap-3">
          <div className="w-full bg-gray-600/50 rounded-full h-2">
            <div className={`${progressBarColor} h-2 rounded-full`} style={{ width: `${score * 10}%` }}></div>
          </div>
          <span className="font-bold text-base w-10 text-right">{score}/10</span>
        </div>
        <p className="text-gray-400 mt-1.5 text-xs">{explanation}</p>
      </div>
    );
  };
  
  const providerGeminiClasses = useMemo(() => apiProvider === ApiProvider.Gemini ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600', [apiProvider]);
  const providerChatGPTClasses = useMemo(() => apiProvider === ApiProvider.ChatGPT ? 'bg-teal-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600', [apiProvider]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-8 md:py-12">
        
        <ApiKeyManagerModal
          isOpen={isApiModalOpen}
          onClose={() => setIsApiModalOpen(false)}
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
        />

        <LibraryModal
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          sessions={savedSessions}
          onLoad={handleLoadSession}
          onDelete={handleDeleteSession}
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
               <div className="flex flex-col sm:flex-row gap-3">
                 <button onClick={() => setIsLibraryOpen(true)} className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors w-full sm:w-auto">
                    <BookmarkSquareIcon className="w-5 h-5" />
                    <span>Thư viện</span>
                  </button>
                 <button onClick={() => setIsApiModalOpen(true)} className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors w-full sm:w-auto">
                   <KeyIcon className="w-5 h-5" />
                   <span>Quản lý API Key</span>
                 </button>
               </div>
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
                  title={isFindNichesDisabled && !topic.trim() ? "Vui lòng nhập chủ đề" : isFindNichesDisabled ? `Vui lòng thêm và xác thực API Key ${apiProvider}`: ""}
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-3"><LightBulbIcon className="w-7 h-7 text-yellow-300"/> Phân tích các ngách tiềm năng</h2>
                <button onClick={handleSaveSession} className="flex-shrink-0 flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                    <BookmarkSquareIcon className="w-5 h-5" />
                    <span>Lưu phiên</span>
                </button>
              </div>
              <div className="space-y-6">
                {niches.map((niche, index) => (
                  <div key={index} className={`p-5 rounded-lg transition-all duration-300 ${selectedNiche?.title === niche.title ? 'bg-indigo-900/40 ring-2 ring-indigo-500' : 'bg-gray-700/30'}`}>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      <div className="flex-1">
                          <h3 className="font-bold text-xl text-indigo-300">{niche.title}</h3>
                          <p className="text-gray-400 mt-2 text-sm">{niche.description}</p>
                           <div className="mt-4 pt-4 border-t border-gray-600/50 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                              <ScoreDisplay
                                icon={<DollarSignIcon className="w-5 h-5 text-green-400" />}
                                title="Tiềm năng kiếm tiền"
                                scoreData={niche.monetization_potential}
                              />
                               <ScoreDisplay
                                icon={<UsersIcon className="w-5 h-5 text-blue-400" />}
                                title="Tiềm năng khán giả"
                                scoreData={niche.audience_potential}
                              />
                               <ScoreDisplay
                                icon={<UsersIcon className="w-5 h-5 text-orange-400" />}
                                title="Mức độ cạnh tranh"
                                scoreData={niche.competition_level}
                                isCompetition={true}
                              />
                           </div>
                           <div className="mt-4 pt-4 border-t border-gray-600/50">
                             <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                                <ClipboardDocumentListIcon className="w-5 h-5 text-purple-400" />
                                Định hướng nội dung
                              </h4>
                              <p className="text-gray-400 mt-1 text-sm">{niche.content_direction}</p>
                           </div>
                           <div className="mt-4 pt-4 border-t border-gray-600/50">
                              <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-200 mb-2">
                                <TagIcon className="w-5 h-5 text-cyan-400" />
                                Từ khóa chính
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {niche.keywords?.map((keyword, kwIndex) => (
                                  <span key={kwIndex} className="bg-gray-600/70 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                           </div>
                      </div>
                      <div className="w-full md:w-40 flex-shrink-0">
                         <button 
                            onClick={() => handleWriteScript(niche)}
                            disabled={isLoadingScript}
                            className="w-full h-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-center"
                          >
                            {isLoadingScript && selectedNiche?.title === niche.title ? 
                              <SpinnerIcon className="w-5 h-5 animate-spin"/> : 
                              'Viết kịch bản cho ngách này'}
                          </button>
                      </div>
                    </div>
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