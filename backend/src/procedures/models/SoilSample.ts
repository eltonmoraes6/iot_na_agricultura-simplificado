export interface SoilSample {
  id: string;
  soilType: string;
  initialWeight: number; // em gramas
  waterAdded: number; // em mL (normalmente 100mL)
  drainedWater: number; // em mL
  fieldCapacity: number; // em porcentagem
  weightAtFieldCapacity: number; // em gramas
  weightAfterDrying: number; // em gramas
  waterRetentionCapacity: number; // em porcentagem
}
