"use client";

import { useState } from "react";

export default function SearchForm() {
  const [githubId, setGithubId] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubId, description }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "API请求失败");
      }
      // 处理匹配的项目
      console.log(data);
    } catch (error) {
      console.error("错误:", error);
      setError(error instanceof Error ? error.message : "发生未知错误");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="flex-grow flex flex-col space-y-3">
          <input
            type="text"
            value={githubId}
            onChange={(e) => setGithubId(e.target.value)}
            placeholder="输入您的GitHub ID或邮箱"
            className="w-full p-3 border border-gray-200 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-base"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="描述您正在寻找的项目"
            className="w-full p-3 border border-gray-200 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-base h-24"
            required
          />
        </div>
        <button
          type="submit"
          className="w-32 bg-[#14162e] text-white rounded-lg transition duration-300 ease-in-out text-base font-semibold hover:bg-[#1c1f3d] disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "搜索中..." : "AI 搜索项目"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}