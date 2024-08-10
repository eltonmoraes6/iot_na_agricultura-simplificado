export const calculateFieldCapacity = (
  waterAdded: number,
  drainedWater: number
): number => {
  const retainedWater = waterAdded - drainedWater;
  return (retainedWater / waterAdded) * 100;
};

export const calculateWaterRetentionCapacity = (
  weightAtFieldCapacity: number,
  weightAfterDrying: number,
  initialWeight: number
): number => {
  const waterRetained = weightAtFieldCapacity - weightAfterDrying;
  return (waterRetained / initialWeight) * 100;
};
