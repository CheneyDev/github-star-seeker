"use client";

import { useState } from "react";
import SearchResults from './SearchResults';

export default function SearchForm() {
  const [githubId, setGithubId] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  

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
        throw new Error(data.error || "API request failed");
      }
      setSearchResults(data);
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
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
      {searchResults.length > 0 && <SearchResults results={searchResults} />}
    </div>
  );
}