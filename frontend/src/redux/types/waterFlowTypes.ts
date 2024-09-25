export interface IWaterFlow {
  id: string;
  waterFlowRate: number;
  totalWaterUsed: number;
  isIrrigated: boolean;
  startIrrigationTime: string;
  stopIrrigationTime: string;
  created_at: string;
  updated_at: string;
}

export interface IWaterFlowResponse {
  temperatures: IWaterFlow[];
}
