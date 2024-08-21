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
    return <p className="text-center mt-4">没有找到匹配的仓库。</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">搜索结果</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {results.map((repo) => (
          <div key={repo.full_name} className="bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 w-56 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold mb-2 truncate text-blue-400">
                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {repo.name}
                </a>
              </h3>
              <p className="text-xs text-gray-300 mb-4 line-clamp-3">{repo.description}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {repo.stars}
              </span>
              <span className="bg-gray-700 px-2 py-1 rounded-full text-xxs">{repo.language || 'Unknown'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;