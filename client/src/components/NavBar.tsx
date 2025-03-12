import { Link, useLocation } from "wouter";
import { SearchBox } from "./SearchBox";

export function NavBar() {
  const [location] = useLocation();
  
  const isWatchPage = location.startsWith("/watch");
  if (isWatchPage) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-background/90 to-background/0 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <a className="text-2xl font-bold text-primary">NetflixClone</a>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/">
              <a className="text-sm hover:text-primary transition-colors">Home</a>
            </Link>
            <Link href="/movies">
              <a className="text-sm hover:text-primary transition-colors">Movies</a>
            </Link>
          </div>
        </div>
        <SearchBox />
      </div>
    </nav>
  );
}
