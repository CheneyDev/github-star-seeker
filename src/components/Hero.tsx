export default function Hero() {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="text-blue-500 dark:text-blue-400 font-semibold mb-4">
          Ideas Collection and Prioritization App
        </div>
        <h1 className="text-5xl font-bold mb-4 max-w-3xl text-black dark:text-white">
          Swipe Right on Your Next Big Idea
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
          Swipe to prioritize and organize your thoughts with ease.
        </p>
        <button className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-300">
          Use For Free
        </button>
      </div>
    );
  }