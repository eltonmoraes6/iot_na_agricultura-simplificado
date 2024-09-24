import { object, TypeOf, z } from 'zod';
import { SoilType } from '../entities/soilType.enum';

export const createSoilSchema = object({
  body: object({
    soilType: z.nativeEnum(SoilType),
  }),
});

export type CreateSoilInput = TypeOf<typeof createSoilSchema>['body'];
