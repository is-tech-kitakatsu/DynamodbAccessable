// lambdaからのレスポンスの型を定義
export default {
  type: 'object',
  required: ['body', 'statusCode'],
  properties: {
    body: {
      type: 'object',
    },
    statusCode: {
      type: 'number',
    },
  },
} as const;
