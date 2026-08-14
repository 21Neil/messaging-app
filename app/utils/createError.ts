export interface customError extends Error {
  statusCode?: number;
  message: string;
  code?: string;
}

const createError = (statusCode: number, message: string, code?: string) => {
  const err: customError = new Error(message);

  err.statusCode = statusCode;
  err.code = code

  return err
};

export default createError;
