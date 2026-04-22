import React, { useState, useEffect, useRef } from 'react';
import ensureAuth from '../features/ensureAuth';

const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const getQueryResponse = async(query)=>{
    await ensureAuth();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat`,{
      method:"POST",
      headers: { "Content-Type": 'application/json' },
      credentials:'include',
      body:JSON.stringify({query}),
    })
    const data = await response.json();
    setIsLoading(false)
    setResponse(data?.explanation)
  }



  // Auto-scroll textarea as text populates
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [response]);

  const handleSearch = async(e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    await getQueryResponse(query.trim())

  };

  return (
    <div className="max-w-2xl mx-auto p-6 transition-colors duration-300 bg-white border shadow-lg dark:bg-slate-900 dark:border-slate-800 rounded-xl mt-10">
      <h2 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">
        AI Assistant
      </h2>
      
      {/* Search Box Section */}
      <form onSubmit={handleSearch} className="relative flex items-center gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
          className="w-full px-4 py-3 transition-all border rounded-lg outline-none bg-slate-50 border-slate-300 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 whitespace-nowrap"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></span>
              Thinking...
            </span>
          ) : 'Ask'}
        </button>
      </form>

      {/* Response Section */}
      <div className="space-y-2">
        <label className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
          Response
        </label>
        <textarea
          ref={textareaRef}
          readOnly
          value={response}
          placeholder="I'm ready to help..."
          className="w-full h-64 p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800"
        />
      </div>
    </div>
  );
};

export default Chatbot;
