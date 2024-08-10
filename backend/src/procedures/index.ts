import { SoilSample } from './models/SoilSample';
import { SoilService } from './services/SoilService';

const soilService = new SoilService();

// Exemplo de amostras de solo
const soilSamples: SoilSample[] = [
  {
    id: '1',
    soilType: 'terra+esterco (1:1)',
    initialWeight: 100,
    waterAdded: 100,
    drainedWater: 20,
    fieldCapacity: 0,
    weightAtFieldCapacity: 110,
    weightAfterDrying: 105,
    waterRetentionCapacity: 0,
  },
  // Adicione mais amostras conforme necessário
];

soilSamples.forEach((sample) => {
  const processedSample = soilService.processSoilSample(sample);
  console.log(`Tipo de Solo: ${processedSample.soilType}`);
  console.log(`Capacidade de Campo: ${processedSample.fieldCapacity}%`);
  console.log(
    `Capacidade de Retenção de Água: ${processedSample.waterRetentionCapacity}%`
  );
});
