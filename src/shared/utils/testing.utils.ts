export class NoErrorThrownError extends Error {}

export const getAsyncError = async <TError>(
  call: () => unknown
): Promise<TError> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};
