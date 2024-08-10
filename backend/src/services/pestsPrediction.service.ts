import { v4 as uuidv4 } from 'uuid';
import { IAlert } from '../interfaces/alert.interface';
import { ISensorData } from '../interfaces/sensor.interface';

export const predictPestsAndDiseases = (
  sensorData: ISensorData[]
): IAlert[] => {
  const alerts: IAlert[] = [];

  sensorData.forEach((data) => {
    const existingAlertPragas = alerts.find(
      (alert) => alert.data_id === data.id && alert.type === 'pragas'
    );

    const existingAlertDoencas = alerts.find(
      (alert) => alert.data_id === data.id && alert.type === 'doenças'
    );

    if (
      data.temperature >= 20 &&
      data.temperature <= 30 &&
      data.humidity > 60 &&
      !existingAlertPragas
    ) {
      alerts.push({
        id: uuidv4(),
        data_id: data.id,
        type: 'pragas',
        message: `Condições favoráveis para pragas: Temperatura ${data.temperature}°C, Umidade ${data.humidity}%,`,
      });
    }

    if (data.humidity > 70 && !existingAlertDoencas) {
      alerts.push({
        id: uuidv4(),
        data_id: data.id,
        type: 'doenças',
        message: `Condições favoráveis para doenças fúngicas: Umidade ${data.humidity}%`,
      });
    }
  });

  return alerts;
};
