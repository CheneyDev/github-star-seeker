import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SearchForm from '@/components/SearchForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 pt-36">  {/* 保持 pt-24 为顶栏留出空间 */}
        <Hero />
        <div className="mt-16">
          <SearchForm />
        </div>
      </main>
    </div>
  );
}