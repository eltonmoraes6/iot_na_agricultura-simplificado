import { number, object, TypeOf } from 'zod';

export const createTemperatureSchema = object({
  body: object({
    temperature: number({
      required_error: 'temperature is required',
    }),
  }),
});

export type CreateTemperatureInput = TypeOf<
  typeof createTemperatureSchema
>['body'];
