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
        <div className="mt-16 relative">
          <img src="https://images.unsplash.com/photo-1541417904950-b855846fe074" alt="App Screenshot" className="w-64 mx-auto" />
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
            <span className="text-4xl">✨</span>
          </div>
          <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2">
            <span className="text-4xl">🔥</span>
          </div>
          <div className="absolute top-1/2 right-0 transform translate-x-full">
            <span className="text-4xl">🎯</span>
          </div>
        </div>
      </div>
    );
  }