import { configureStore } from "@reduxjs/toolkit";
import { lyricPaletteApi } from "@/integrations/lyric-palette";

export function makeStore() {
  return configureStore({
    reducer: {
      [lyricPaletteApi.reducerPath]: lyricPaletteApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(lyricPaletteApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
