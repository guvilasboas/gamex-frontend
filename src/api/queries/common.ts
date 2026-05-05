// generated with @7nohe/openapi-react-query-codegen@2.1.0 

import { UseQueryResult } from "@tanstack/react-query";
import type { Options } from "../requests/sdk.gen";
import { getDebugInfo, getSession, login, signup } from "../requests/sdk.gen";
import { GetDebugInfoData, GetSessionData } from "../requests/types.gen";
export type GetSessionDefaultResponse = Awaited<ReturnType<typeof getSession>>["data"];
export type GetSessionQueryResult<TData = GetSessionDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGetSessionKey = "GetSession";
export const UseGetSessionKeyFn = (clientOptions: Options<GetSessionData, true> = {}, queryKey?: Array<unknown>) => [useGetSessionKey, ...(queryKey ?? [clientOptions])];
export type GetDebugInfoDefaultResponse = Awaited<ReturnType<typeof getDebugInfo>>["data"];
export type GetDebugInfoQueryResult<TData = GetDebugInfoDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useGetDebugInfoKey = "GetDebugInfo";
export const UseGetDebugInfoKeyFn = (clientOptions: Options<GetDebugInfoData, true> = {}, queryKey?: Array<unknown>) => [useGetDebugInfoKey, ...(queryKey ?? [clientOptions])];
export type SignupMutationResult = Awaited<ReturnType<typeof signup>>;
export const useSignupKey = "Signup";
export const UseSignupKeyFn = (mutationKey?: Array<unknown>) => [useSignupKey, ...(mutationKey ?? [])];
export type LoginMutationResult = Awaited<ReturnType<typeof login>>;
export const useLoginKey = "Login";
export const UseLoginKeyFn = (mutationKey?: Array<unknown>) => [useLoginKey, ...(mutationKey ?? [])];
