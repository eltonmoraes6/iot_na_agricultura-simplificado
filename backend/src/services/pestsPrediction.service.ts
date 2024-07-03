import { IAlert } from '../interfaces/alert.interface';
import { ISensorData } from '../interfaces/sensor.interface';

export const predictPestsAndDiseases = (
  sensorData: ISensorData[]
): IAlert[] => {
  const alerts: IAlert[] = [];

  sensorData.forEach((data) => {
    if (
      data.temperature >= 20 &&
      data.temperature <= 30 &&
      data.humidity > 60
    ) {
      alerts.push({
        id: data.id,
        type: 'pragas',
        message: `Condições favoráveis para pragas: Temperatura ${data.temperature}°C, Umidade ${data.humidity}%`,
      });
    }
    if (data.humidity > 70) {
      alerts.push({
        id: data.id,
        type: 'doenças',
        message: `Condições favoráveis para doenças fúngicas: Umidade ${data.humidity}%`,
      });
    }
  });

  return alerts;
};
