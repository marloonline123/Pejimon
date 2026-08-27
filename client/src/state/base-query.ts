import { toast } from "@/components/ui/toast";
import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { authClient } from "@/lib/auth-client";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
});

export const baseQueryWithToast: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  // Successful response
  if (result.data) {
    const data = result.data as {
      flash?: {
        success?: string;
        error?: string;
        info?: string;
        warning?: string;
      };
    };
    const successMessage = data.flash?.success;
    const errorMessage = data.flash?.error;
    const infoMessage = data.flash?.info;
    const warningMessage = data.flash?.warning;

    if (successMessage) {
      toast.add({
        type: "success",
        description: successMessage,
      });
    }
  }

  // Error response
  if (result.error) {
    if (result.error.status === 401) {
      // If 401 Unauthorized, sign out and redirect to login page
      if (typeof window !== "undefined") {
        await authClient.signOut();
        window.location.href = "/login";
      }
    }
    
    // You could also show an error toast here if you uncommented the toast logic
  }

  return result;
};
