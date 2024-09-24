export interface ISoil {
  id: string;
  soilType: string;
  created_at: string;
  updated_at: string;
}

export interface ISoilResponse {
  soils: ISoil[];
}
