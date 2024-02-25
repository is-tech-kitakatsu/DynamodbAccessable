import { BaseException } from './BaseException';

export class InvalidAttributeException extends BaseException {
  constructor(message?: string) {
    super(message);
  }

  getMessageByError(): string {
    return 'Assign attribute is invalid';
  }
}
