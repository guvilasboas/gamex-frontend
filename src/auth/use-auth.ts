import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useGetSessionKey } from "../api/queries/common";
import { useGetSession, useLogin, useSignup } from "../api/queries";
import type {
  LoginRequestDto,
  LoginResponseDto,
  SessionResponseDto,
  SignupRequestDto,
  SignupResponseDto,
} from "../api/requests";
import {
  clearAccessToken,
  getAccessToken,
  getAuthHeaders,
  setAccessToken,
} from "./token";

function invalidateSession(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: [useGetSessionKey] });
}

export function useAuthSession() {
  const queryClient = useQueryClient();
  const token = getAccessToken();
  const hasToken = Boolean(token);

  const query = useGetSession<SessionResponseDto>(
    token ? { headers: getAuthHeaders(token) } : {},
    undefined,
    {
      enabled: hasToken,
      retry: false,
      staleTime: 60_000,
    },
  );

  useEffect(() => {
    if (!token || !query.isError) {
      return;
    }

    clearAccessToken();
    queryClient.removeQueries({ queryKey: [useGetSessionKey] });
  }, [query.isError, queryClient, token]);

  return {
    ...query,
    session: query.data ?? null,
    token,
    isLoading: hasToken ? query.isLoading : false,
    isPending: hasToken ? query.isPending : false,
    isFetching: hasToken ? query.isFetching : false,
    isAuthenticated: Boolean(token && query.data),
  };
}

export function useLoginAction() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useLogin(undefined, {
    onSuccess: async (result) => {
      const data = result.data as LoginResponseDto;
      setAccessToken(data.accessToken);
      await invalidateSession(queryClient);
      navigate("/lobby", { replace: true });
    },
  });
}

export function useSignupAction() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useSignup(undefined, {
    onSuccess: async (result) => {
      const data = result.data as SignupResponseDto;
      setAccessToken(data.accessToken);
      await invalidateSession(queryClient);
      navigate("/lobby", { replace: true });
    },
  });
}

export function useLogoutAction() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    clearAccessToken();
    queryClient.removeQueries({ queryKey: [useGetSessionKey] });
    navigate("/auth/login", { replace: true });
  };
}

export type LoginFormState = LoginRequestDto;
export type SignupFormState = SignupRequestDto;
