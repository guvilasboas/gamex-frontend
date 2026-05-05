import { BrowserRouter } from "react-router";
import { AppRouter } from "./app-router.component";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../config";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
