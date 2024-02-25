import { HttpBaseException } from './HttpBaseException';
export class UnprocessableEntityException extends HttpBaseException {
  statusCode() { return 422 }
}
