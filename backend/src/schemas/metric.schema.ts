import { number, object, string, TypeOf, z } from 'zod';
import { SoilType } from '../entities/soilType.enum';

export const createMetricSchema = object({
  body: object({
    minTemperature: number({
      required_error: 'minTemperature is required',
    }),
    maxTemperature: number({
      required_error: 'maxTemperature is required',
    }),
    soilType: z.nativeEnum(SoilType),
    minHumidity: number({
      required_error: 'minHumidity is required',
    }),
    maxHumidity: number({
      required_error: 'maxHumidity is required',
    }),
    season: string({
      required_error: 'season is required',
    }),
  }),
});

export type CreateMetricInput = TypeOf<typeof createMetricSchema>['body'];
