// よく使うものだけ揃えておく
// https://developer.mozilla.org/ja/docs/Web/HTTP/Status
export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  REDIRECT: 301,
  BAD_REQUEST: 400,
  AN_AUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;
