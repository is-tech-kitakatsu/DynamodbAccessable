import { ErrorMessageMapping } from './ErrorMessageMapping';

// https://go-to-k.hatenablog.com/entry/typescript-custom-error-class
export abstract class HttpBaseException extends Error {
  abstract statusCode(): number;

  // 一部middy@http-error-handlerのプロパティに合わせている
  constructor(
    message?: string,
    public details?: Record<string, string>[],
  ) {
    super(message);

    this.name = this.constructor.name;
    this.describeMessage();
  }

  private describeMessage() {
    const errorType = this.constructor.name;
    const errorMessage = `${this.getMessageByErrorCode()}: ${this.message}`;
    const details = this.details;

    console.error('StatusCode: ' + `${this.statusCode()}`);
    console.error('ErrorType: ' + errorType);
    console.error('ErrorMessage: ' + errorMessage);
    console.error('Details: ' + details);
  }

  private getMessageByErrorCode(): string {
    // メンバ変数にしてコンストラクタ内での初期化などもOK
    const errorMessageMapping = new ErrorMessageMapping();

    return errorMessageMapping.getErrorMessage(this.statusCode());
  }
}
