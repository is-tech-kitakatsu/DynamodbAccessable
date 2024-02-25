import { BaseException } from './BaseException';
export class KeyNullException extends BaseException {
  constructor(message?: string) {
    super(message);
  }

  getMessageByError(): string {
    return 'Id is undefined.';
  }
}
