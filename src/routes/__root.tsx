
import { useEffect } from "react";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";

import type { QueryClient } from "@tanstack/react-query";

// ----------------------------------------------------
// FX QUEST - 404 PAGE
// ----------------------------------------------------
// Displayed when the player visits a route that does
// not exist in Currency Kingdom.
// ----------------------------------------------------

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-sky-gradient px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-primary">
          404
        </h1>

        <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
          This island isn't on the map
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          Looks like you've wandered beyond Currency Kingdom!
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// FX QUEST - ERROR PAGE
// ----------------------------------------------------
// Handles unexpected errors while rendering a route.
// ----------------------------------------------------

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("FX Quest route error:", error);
  }, [error]);

  const handleRetry = () => {
    router.invalidate();
    reset();
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-sky-gradient px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          This page didn't load
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong. You can try again or return to Currency Kingdom.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="min-h-11 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
          >
            Try again
          </button>

          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-full border-2 border-border bg-card px-6 py-3 text-sm font-bold text-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// FX QUEST - ROOT ROUTE
// ----------------------------------------------------
// TanStack Router context provides access to the
// shared React Query client.
//
// Unlike TanStack Start, standard Vite renders into
// the existing HTML document through main.tsx.
// ----------------------------------------------------

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// ----------------------------------------------------
// ROOT COMPONENT
// ----------------------------------------------------
// The Outlet renders the currently selected page:
// Welcome, Characters, Map, Missions, and so on.
// ----------------------------------------------------

function RootComponent() {
  return <Outlet />;
}
