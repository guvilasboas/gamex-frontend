// generated with @7nohe/openapi-react-query-codegen@2.1.0 

import { useSuspenseQuery, UseSuspenseQueryOptions } from "@tanstack/react-query";
import type { Options } from "../requests/sdk.gen";
import { getDebugInfo, getSession } from "../requests/sdk.gen";
import { GetDebugInfoData, GetSessionData } from "../requests/types.gen";
import * as Common from "./common";
export const useGetSessionSuspense = <TData = NonNullable<Common.GetSessionDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(clientOptions: Options<GetSessionData, true> = {}, queryKey?: TQueryKey, options?: Omit<UseSuspenseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGetSessionKeyFn(clientOptions, queryKey), queryFn: () => getSession({ ...clientOptions }).then(response => response.data as TData) as TData, ...options });
export const useGetDebugInfoSuspense = <TData = NonNullable<Common.GetDebugInfoDefaultResponse>, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(clientOptions: Options<GetDebugInfoData, true> = {}, queryKey?: TQueryKey, options?: Omit<UseSuspenseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useSuspenseQuery<TData, TError>({ queryKey: Common.UseGetDebugInfoKeyFn(clientOptions, queryKey), queryFn: () => getDebugInfo({ ...clientOptions }).then(response => response.data as TData) as TData, ...options });
