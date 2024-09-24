export interface ISeason {
  id: string;
  season: string;
  created_at: string;
  updated_at: string;
}

export interface ISeasonResponse {
  seasons: ISeason[];
}
