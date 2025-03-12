import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { NavBar } from "@/components/NavBar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import MoviePage from "@/pages/movie";
import WatchPage from "@/pages/watch";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/movie/:id" component={MoviePage} />
      <Route path="/watch/:id" component={WatchPage} />
      <Route component={NotFound} />
    </Switch>
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
