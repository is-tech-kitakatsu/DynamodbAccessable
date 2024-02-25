export class ErrorMessageMapping {
  private mapping: { [key: number]: string } = {};

  constructor() {
    this.mapping[400] = 'Bad Request';
    this.mapping[401] = 'Unauthorized';
    this.mapping[403] = 'Forbidden';
    this.mapping[404] = 'Not Found';
    this.mapping[422] = 'Unprocessable Entity';
    this.mapping[429] = 'Too Many Requests';
    this.mapping[500] = 'Internal Server Error';
  }

  public getErrorMessage(mapKey: number): string {
    return mapKey in this.mapping ? this.mapping[mapKey] : this.mapping[500];
  }
}
