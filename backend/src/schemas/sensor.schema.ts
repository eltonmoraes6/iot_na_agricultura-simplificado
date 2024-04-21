import { number, object, string, TypeOf } from 'zod';

export const createSensorSchema = object({
  body: object({
    temperature: number({
      required_error: 'temperature is required',
    }),
    humidity: number({
      required_error: 'humidity address is required',
    }),
    season: string({
      required_error: 'season is required',
    }),
  }),
});

export type CreateSensorInput = TypeOf<typeof createSensorSchema>['body'];
