import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NavBar } from "@/components/NavBar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import MoviePage from "@/pages/movie";
import TVShowPage from "@/pages/tv-show";
import WatchPage from "@/pages/watch";
import SearchPage from "@/pages/search";

function Router() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/movie/:id" component={MoviePage} />
        <Route path="/tv/:id" component={TVShowPage} />
        <Route path="/watch/:id" component={WatchPage} />
        <Route path="/search" component={SearchPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavBar />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;