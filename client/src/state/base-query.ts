import { toast } from "@/components/ui/toast";
import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

// or your toast library

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
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
  //   if (result.error) {
  //     const errorData = result.error.data as {
  //       message?: string;
  //     };

  //     if (errorData?.message) {
  //       toast.add({
  //         type: "error",
  //         description: errorData.message,
  //       });
  //     } else {
  //       toast.add({
  //         type: "error",
  //         description: "Something went wrong",
  //       });
  //     }
  //   }

  return result;
};
