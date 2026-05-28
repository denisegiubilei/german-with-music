"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { makeStore, type AppStore } from "@/store";
import { authApi } from "@/integrations/lyric-palette";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (storeRef.current === null) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }

  useEffect(() => {
    const store = storeRef.current!;
    // Attempt to rehydrate auth state using the httpOnly refresh cookie.
    // The browser sends the cookie automatically — no JS token handling needed.
    // If no cookie exists the Route Handler returns 401 and clearCredentials is dispatched.
    const promise = store.dispatch(
      authApi.endpoints.refresh.initiate(),
    );
    return () => {
      promise.abort();
    };
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
