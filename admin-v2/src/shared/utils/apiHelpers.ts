export const wrapWithRefetch = async <T>(
  mutation: () => Promise<T>,
  refetchFn: () => Promise<unknown>,
  refetch: boolean = true
): Promise<T | unknown> => {
  const result = await mutation();
  if (refetch) {
    return await refetchFn();
  }
  return result;
};
