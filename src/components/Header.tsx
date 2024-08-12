export default function Header() {
    return (
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-md mr-2"></div>
            <span className="font-bold text-xl text-black dark:text-white">sliidea</span>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Benefits</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">How it works</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Upcoming features</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Download</a></li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1 rounded-full text-sm">
              #3 Product of the Day
            </div>
            <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200">
              Use now for free
            </button>
          </div>
        </div>
      </header>
    );
  }