import { getReasonPhrase } from 'http-status-codes';

class ResponseError extends Error {
  error: string;
  statusCode: number;
  detail: string | object;

  constructor(_statusCode: number, _detail: string | object) {
    super();
    this.statusCode = _statusCode;
    this.error = getReasonPhrase(_statusCode);
    this.detail = _detail;
  }

  getError(): object {
    const error = {
      statusCode: this.statusCode,
      error: this.error,
      detail: this.detail
    };

    return error;
  }
}

export { ResponseError };
