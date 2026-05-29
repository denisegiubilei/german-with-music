import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/entities/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  hydrated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
    },
    setAuthHydrated(state) {
      state.hydrated = true;
    },
  },
});

export const { setCredentials, clearCredentials, setAuthHydrated } =
  authSlice.actions;
export default authSlice.reducer;
