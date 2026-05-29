import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "@/entities/user";
import {
  setCredentials,
  clearCredentials,
  setAuthHydrated,
} from "@/features/auth";

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  login: string;
  password: string;
  name?: string;
  newsletter?: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/auth" }),
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          dispatch(clearCredentials());
        } finally {
          dispatch(setAuthHydrated());
        }
      },
    }),

    register: build.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          dispatch(clearCredentials());
        } finally {
          dispatch(setAuthHydrated());
        }
      },
    }),

    refresh: build.mutation<AuthResponse, void>({
      query: () => ({
        url: "/refresh",
        method: "POST",
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          dispatch(clearCredentials());
        } finally {
          dispatch(setAuthHydrated());
        }
      },
    }),

    logout: build.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearCredentials());
          dispatch(setAuthHydrated());
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;
