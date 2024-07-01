import { Kafka } from 'kafkajs';
import { Soil } from '../entities/soil.entity';
import { AppDataSource } from '../utils/data-source';
import { createSensor } from './sensors.service';
require('dotenv').config();

const soilRepository = AppDataSource.getRepository(Soil);

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:19092'],
});

const consumer = kafka.consumer({ groupId: 'kafka' });

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
        const result = await soilRepository.save(soil);
        console.log('Result ========> ', result);
        console.log('Data inserted into database from Kafka:', sensorData);
      } catch (err: any) {
        console.error('Error inserting data into the database:', err);
      }
    },
  });
};

connectConsumer().catch(console.error);
