import { number, object, TypeOf } from 'zod';

export const createHumiditySchema = object({
  body: object({
    humidity: number({
      required_error: 'humidity is required',
    }),
  }),
});

export type CreateHumidityInput = TypeOf<typeof createHumiditySchema>['body'];
