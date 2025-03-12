
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";

export function NavBar() {
  const [search, setSearch] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-full items-center">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/">
            <span className="font-bold cursor-pointer">MovieFlix</span>
          </Link>
          <div className="hidden gap-6 md:flex">
            <Link href="/">
              <span className="cursor-pointer">Home</span>
            </Link>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search movies..."
              className="md:w-[200px] lg:w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" size="sm" className="absolute right-0 top-0">
              Search
            </Button>
          </form>
        </div>
      </div>
    </nav>
  );
}
