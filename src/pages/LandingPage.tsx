import { Link } from "react-router-dom";
import { Rss, ArrowRight } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between mx-auto w-full max-w-7xl">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
            <Rss size={20} />
          </div>
          Frontpage
        </div>
        <nav className="flex gap-4">
          <button className="px-4 py-2 font-medium text-gray-600 hover:text-gray-900">Log in</button>
          <Link to="/app" className="px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700">
            Try as Guest
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
          Your personalized front page for tech content.
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          Pull your favorite RSS and Atom feeds into a single, well-designed reading dashboard. The calm way to keep up.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 rounded-lg font-medium text-lg text-white bg-gray-900 hover:bg-gray-800 transition">
            Start Reading
          </button>
          <Link to="/app" className="px-6 py-3 rounded-lg font-medium text-lg text-gray-900 bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center gap-2">
            Try as Guest <ArrowRight size={20} />
          </Link>
        </div>
      </main>
    </div>
  );
}
