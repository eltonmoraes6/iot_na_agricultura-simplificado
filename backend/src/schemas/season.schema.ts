import { object, string, TypeOf } from 'zod';

export const createSeasonSchema = object({
  body: object({
    season: string({
      required_error: 'season is required',
    }),
  }),
});

export type CreateSeasonInput = TypeOf<typeof createSeasonSchema>['body'];
