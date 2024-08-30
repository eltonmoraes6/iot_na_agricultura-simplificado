import { Kafka } from 'kafkajs';
import { Soil } from '../entities/soil.entity';
import { IAlert } from '../interfaces/alert.interface';
import { predictPestsAndDiseases } from '../services/pestsPrediction.service';
import { AppDataSource } from '../utils/data-source';
import { createSensor } from './sensors.service';

import config from '../../config';

require('dotenv').config();

const soilRepository = AppDataSource.getRepository(Soil);

const kafka = new Kafka({
  clientId: config.kafkaConfig.clientId,
  brokers: config.kafkaConfig.brokers,
  connectionTimeout: 3000,
});

const consumer = kafka.consumer({ groupId: 'kafka', retry: { retries: 5 } });

const connectConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'sensor', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('****************** Arrived in Consumer ******************');
      if (!message.value) {
        console.warn('Incomplete data');
        return;
      }
      try {
        const sensorData = JSON.parse(message.value.toString());
        const sensor = await createSensor(sensorData);
        if (!sensor) {
          console.warn('Sensor: error on creating');
          return;
        }
        const soil = await soilRepository.findOne({
          where: { id: sensorData.soil },
          relations: { sensor: true }, // Certificar-se de que a relação é carregada
        });

        if (!soil) {
          throw new Error('Soil not found');
        }

        // Inicializar a lista de sensores se estiver undefined
        if (!soil.sensor) {
          soil.sensor = [];
        }

        // Adicionar o sensor à lista de sensores do Soil
        soil.sensor.push(sensorData);

        // Salvar a entidade Soil com o novo sensor
        await soilRepository.save(soil);

        const alerts: IAlert[] = predictPestsAndDiseases(
          soil.sensor.map((s) => ({
            id: s.id,
            temperature: s.temperature,
            humidity: s.humidity,
          }))
        );

        if (alerts.length > 0) {
          alerts.forEach((alert) => console.log(alert.message));
        }

        console.log('Data inserted into database from Kafka:', sensorData);
      } catch (err: any) {
        console.error('Error inserting data into the database:', err);
      }
    },
  });
};

connectConsumer().catch(console.error);
