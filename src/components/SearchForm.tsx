"use client";

import { useState, useEffect, useRef } from "react";
import SearchResults from './SearchResults';

export default function SearchForm() {
  const [githubId, setGithubId] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [streamedResults, setStreamedResults] = useState<string[]>([]);
const [finalResults, setFinalResults] = useState<any[]>([]);
const [gptStream, setGptStream] = useState<string>('');
  const gptStreamRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (gptStreamRef.current) {
      gptStreamRef.current.scrollTop = gptStreamRef.current.scrollHeight;
    }
  }, [gptStream]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setStreamedResults([]);
    setFinalResults([]);
    setGptStream('');

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubId, description }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("API 请求失败");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("无法读取响应流");
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.type === 'stream') {
                setStreamedResults(prev => [...prev, data.content]);
              } else if (data.type === 'gpt_stream') {
                setGptStream(prev => prev + data.content);
              } else if (data.type === 'final') {
                setFinalResults(data.content);
              }
            } catch (parseError) {
              console.error("JSON 解析错误:", parseError);
            }
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('请求被取消');
      } else {
        console.error("错误:", error);
        setError(error instanceof Error ? error.message : "发生未知错误");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the project you're looking for"
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-base h-24"
          required
        />
        <div className="flex space-x-3">
          <input
            type="text"
            value={githubId}
            onChange={(e) => setGithubId(e.target.value)}
            placeholder="Enter your GitHub ID or email"
            className="flex-grow p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-base"
            required
          />
          <button
            type="submit"
            className="w-32 bg-[#14162e] text-white rounded-lg transition duration-300 ease-in-out text-base font-semibold hover:bg-[#1c1f3d] disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "AI Search"}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {isLoading && <div className="mt-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2">正在搜索中...</p>
      </div>}
      {streamedResults.length > 0 && (
  <div className="mt-4 bg-gray-100 p-4 rounded">
    <h3 className="font-semibold mb-2">原始数据流：</h3>
    {streamedResults.map((result, index) => (
      <pre key={index} className="whitespace-pre-wrap">{result}</pre>
    ))}
  </div>
)}
{gptStream && (
  <div className="mt-4 bg-gray-100 p-4 rounded">
    <h3 className="font-semibold mb-2">GPT 分析流：</h3>
    <div 
      ref={gptStreamRef}
      className="h-64 w-full overflow-auto border border-gray-300 rounded p-2 bg-white hide-scrollbar"
    >
      <pre className="whitespace-pre-wrap">{gptStream}</pre>
    </div>
  </div>
)}
{finalResults.length > 0 && <SearchResults results={finalResults} />}
    </div>
  );
}