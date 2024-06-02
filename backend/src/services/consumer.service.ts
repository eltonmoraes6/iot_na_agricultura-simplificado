import { Kafka } from 'kafkajs';
import { createSensor } from './sensors.service';
require('dotenv').config();

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
        await createSensor(sensorData);
        console.log('Data inserted into database from Kafka:', sensorData);
      } catch (err: any) {
        console.error('Error inserting data into the database:', err);
      }
    },
  });
};

connectConsumer().catch(console.error);
