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
  if (results.length === 0) {
    return <p className="text-center text-gray-500 mt-4">没有找到匹配的仓库。</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">搜索结果</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((repo) => (
          <div key={repo.full_name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">
              <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {repo.name}
              </a>
            </h3>
            <p className="text-sm text-gray-600 mb-2">{repo.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-4">⭐ {repo.stars}</span>
              <span>{repo.language || '未知语言'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;