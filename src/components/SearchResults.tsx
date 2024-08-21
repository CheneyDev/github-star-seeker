import React from 'react';

interface Repo {
  name: string;
  full_name: string;
  description: string;
  url: string;
  stars: number;
  language: string;
}

interface SearchResultsProps {
  results: Repo[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">搜索结果</h2>
      {results.map((repo, index) => (
        <div key={index} className="bg-white shadow rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold">
            <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {repo.full_name}
            </a>
          </h3>
          <p className="text-gray-600 mt-1">{repo.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span className="mr-4">⭐ {repo.stars}</span>
            <span>{repo.language}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;