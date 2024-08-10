import { SoilSample } from '../models/SoilSample';
import {
  calculateFieldCapacity,
  calculateWaterRetentionCapacity,
} from '../utils/calculations';

export class SoilService {
  public processSoilSample(sample: SoilSample): SoilSample {
    sample.fieldCapacity = calculateFieldCapacity(
      sample.waterAdded,
      sample.drainedWater
    );
    sample.waterRetentionCapacity = calculateWaterRetentionCapacity(
      sample.weightAtFieldCapacity,
      sample.weightAfterDrying,
      sample.initialWeight
    );

    return sample;
  }
}
