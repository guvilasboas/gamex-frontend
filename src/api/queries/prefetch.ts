// generated with @7nohe/openapi-react-query-codegen@2.1.0 

import { type QueryClient } from "@tanstack/react-query";
import type { Options } from "../requests/sdk.gen";
import { getDebugInfo, getSession } from "../requests/sdk.gen";
import { GetDebugInfoData, GetSessionData } from "../requests/types.gen";
import * as Common from "./common";
export const prefetchUseGetSession = (queryClient: QueryClient, clientOptions: Options<GetSessionData, true> = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGetSessionKeyFn(clientOptions), queryFn: () => getSession({ ...clientOptions }).then(response => response.data) });
export const prefetchUseGetDebugInfo = (queryClient: QueryClient, clientOptions: Options<GetDebugInfoData, true> = {}) => queryClient.prefetchQuery({ queryKey: Common.UseGetDebugInfoKeyFn(clientOptions), queryFn: () => getDebugInfo({ ...clientOptions }).then(response => response.data) });
