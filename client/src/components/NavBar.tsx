import { Link } from "wouter";
import { SearchBox } from "@/components/SearchBox";

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-indigo-600/20">
      <div className="container h-full mx-auto px-4 flex items-center">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/">
            <span className="text-xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              MovieStreamHub
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <span className="text-sm hover:text-indigo-400 transition-colors duration-300">Home</span>
            </Link>
            <Link href="/movies">
              <span className="text-sm hover:text-indigo-400 transition-colors duration-300">Movies</span>
            </Link>
            <Link href="/tv-shows">
              <span className="text-sm hover:text-indigo-400 transition-colors duration-300">TV Shows</span>
            </Link>
          </div>
        </div>
        <div className="ml-auto">
          <SearchBox />
        </div>
      </div>
    </nav>
  );
}