import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import httpErrorHandler from '@middy/http-error-handler';
import inputOutputLogger from '@middy/input-output-logger';
import validator from '@middy/validator';
import middy from '@middy/core';
import { Handler } from 'aws-lambda';
import responseSchema from '../../../lib/middleware/middy/responseSchema';
import { transpileSchema } from '@middy/validator/transpile';
import { ResponseModel } from './ResponseModel';

export type ValidatedRequestEventHandler<S extends JSONSchema> = Handler<
  FromSchema<S>,
  ResponseModel
>;

// バリデーションをオプションにする
// useで追加するミドルウェアの実行順は次のようになる
// https://middy.js.org/docs/intro/how-it-works/
export function middyfy<
  S extends JSONSchema,
  H extends ValidatedRequestEventHandler<S>,
>(opt: {
  handler: H;
  eventSchema?: S;
  unhandledErrorMessage?: string;
}): middy.MiddyfiedHandler {
  const { eventSchema, handler, unhandledErrorMessage } = opt;
  const m = middy()
    .use(httpErrorHandler({ fallbackMessage: unhandledErrorMessage }))
    .use(inputOutputLogger())
    .use(validator({ responseSchema: transpileSchema(responseSchema) }));
  if (typeof eventSchema === 'object') {
    m.use(validator({ eventSchema: transpileSchema(eventSchema) }));
  }
  m.handler(handler);
  return m;
}
