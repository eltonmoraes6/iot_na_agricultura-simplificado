import { number, object, TypeOf, z } from 'zod';
import { SoilType } from '../entities/soilType.enum';

export const createSoilSchema = object({
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
  }),
});

export type CreateSoilInput = TypeOf<typeof createSoilSchema>['body'];
