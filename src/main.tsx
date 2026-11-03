
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// TanStack Router
import { RouterProvider } from "@tanstack/react-router";

// React Query
import { QueryClientProvider } from "@tanstack/react-query";

// FX Quest router and shared QueryClient
import { router, queryClient } from "./router";

// Original FX Quest design system
import "./styles.css";

// ----------------------------------------------------
// FX QUEST - APPLICATION ENTRY POINT
// ----------------------------------------------------
// Connects:
// 1. React
// 2. TanStack Router
// 3. React Query
// 4. Original Lovable styling
// ----------------------------------------------------

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("FX Quest root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
