import middy from '@middy/core';

export function responseModelConverter(): middy.MiddlewareObj {
  return {
    // handlerがreturnした後に適用される処理
    after: (request) => {
      const response = request.response;

      request.response = {
        statusCode: response.statusCode,
        body: JSON.stringify(response.body),
      };
    },
  };
}
