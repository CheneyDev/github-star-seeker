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
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors duration-300">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Search GitHub Projects</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={githubId}
              onChange={(e) => setGithubId(e.target.value)}
              placeholder="Enter your GitHub ID or Email"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white"
              required
            />
          </div>
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project you're looking for"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-black dark:text-white h-32"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search Projects"}
            </button>
          </div>
        </form>
      </div>

      {results.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-700 p-8">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Results:</h2>
          {results.map((project: any, index: number) => (
            <div
              key={index}
              className="mb-4 p-4 bg-white dark:bg-gray-600 rounded-md shadow"
            >
              <h3 className="text-xl font-bold">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {project.full_name}
                </a>
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}