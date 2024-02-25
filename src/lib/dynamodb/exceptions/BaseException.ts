// middyのhttp-error-handlerを利用する前提でプロパティを設計する
// lib/dynamodb以下は影響範囲をそのディレクトリ以下に抑えているつもりで、呼び出し元のインターフェースの中身を
// 実装し直せば脱着の負荷は高くならないようになっているはずだが、エラーの設計だけはmiddyに依存させる
// lib/exception/http以下はapiとしてのステータスコードを意識させるが、こちらはバッチなどから呼び出したり
// するので500系のエラーで良いと思う。(そう決める)
// その代わりエラーメッセージはきちんと残す必要があるが、ライブラリのつもりで書いているので一度書けば他の実装者は触らなくて良いはずなので気にしない

export abstract class BaseException extends Error {
  statusCode: 500;

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
    const statusCode = this.statusCode;
    const errorType = this.constructor.name;
    const errorMessage = `${this.getMessageByError()}: ${this.message}`;
    const details = this.details;

    console.error('StatusCode: ' + statusCode);
    console.error('ErrorType: ' + errorType);
    console.error('ErrorMessage: ' + errorMessage);
    console.error('Details: ' + details);
  }

  abstract getMessageByError(): string;
}
