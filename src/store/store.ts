import { configureStore } from "@reduxjs/toolkit";
import { lyricPaletteApi, authApi } from "@/integrations/lyric-palette";
import { authReducer } from "@/features/auth";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      [lyricPaletteApi.reducerPath]: lyricPaletteApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(lyricPaletteApi.middleware)
        .concat(authApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
