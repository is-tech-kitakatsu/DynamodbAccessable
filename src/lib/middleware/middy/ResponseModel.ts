import { FromSchema } from 'json-schema-to-ts';
import responseSchema from './responseSchema';

// Lambda関数の戻り値のclass
export type ResponseModel = FromSchema<typeof responseSchema>;
