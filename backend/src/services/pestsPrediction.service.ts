import { v4 as uuidv4 } from 'uuid';
import { Humidity } from '../entities/humidity.entity';
import { Temperature } from '../entities/temperature.entity';
import { IAlert } from '../interfaces/alert.interface';
import { AppDataSource } from '../utils/data-source';

const humidityRepository = AppDataSource.getRepository(Humidity);
const temperatureRepository = AppDataSource.getRepository(Temperature);

// Fetch the latest sensor data for processing
const fetchSensorData = async () => {
  const humidities = await humidityRepository.find({
    order: { created_at: 'DESC' },
    take: 100, // Assuming you want to process the latest 100 records
  });

  const temperatures = await temperatureRepository.find({
    order: { created_at: 'DESC' },
    take: 100,
  });

  // Combine humidity and temperature data by matching timestamps or IDs (adjust as per your schema)
  const sensorData = humidities.map((humidity, index) => ({
    id: humidity.id,
    humidity: humidity.humidity,
    temperature: temperatures[index]?.temperature || null,
    created_at: humidity.created_at,
  }));

  return sensorData;
};

// Main function to predict pests and diseases based on humidity and temperature data
export const predictPestsAndDiseases = async (): Promise<IAlert[]> => {
  const sensorData = await fetchSensorData();
  const alerts: IAlert[] = [];

  sensorData.forEach((data) => {
    // Check for existing alerts in the current batch
    const existingAlertPragas = alerts.find(
      (alert) => alert.data_id === data.id && alert.type === 'pragas'
    );

    const existingAlertDoencas = alerts.find(
      (alert) => alert.data_id === data.id && alert.type === 'doenças'
    );

    // Conditions for pest alerts (Pragas)
    if (
      data.temperature !== null &&
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

    // Conditions for fungal disease alerts (Doenças)
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
