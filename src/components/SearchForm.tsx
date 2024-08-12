"use client";

import { useState } from "react";

export default function SearchForm() {
  const [githubId, setGithubId] = useState("");
  const [description, setDescription] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubId, description }),
      });
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const matchedProjects = await response.json();
      setResults(matchedProjects);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={githubId}
          onChange={(e) => setGithubId(e.target.value)}
          placeholder="Enter your GitHub ID or Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the project you're looking for"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-black text-white rounded hover:bg-gray-800"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Results:</h2>
          {results.map((project: any, index: number) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-300 rounded"
            >
              <h3 className="text-xl font-bold">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {project.full_name}
                </a>
              </h3>
              <p className="mt-2">{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
