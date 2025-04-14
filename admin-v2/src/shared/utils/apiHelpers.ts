import { AxiosResponse } from "axios";

export const wrapWithRefetch = async <T>(
  mutation: () => Promise<T>,
  refetchFn: () => Promise<
    AxiosResponse<
      | {
          status: string;
          result: unknown;
        }
      | Awaited<T>
    >
  >,
  refetch: boolean = true
) => {
  const result = await mutation();
  if (refetch) {
    return await refetchFn();
  }
  return result;
};
