"use client";

import { useMemo } from "react";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { makeStore } from "@/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => {
    const s = makeStore();
    setupListeners(s.dispatch);
    return s;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
