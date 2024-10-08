import { Kafka } from 'kafkajs';
import { Humidity } from '../entities/humidity.entity';
import { Soil } from '../entities/soil.entity';
import { Temperature } from '../entities/temperature.entity';
import { predictPestsAndDiseases } from '../services/pestsPrediction.service';
import { AppDataSource } from '../utils/data-source';

import { DeepPartial } from 'typeorm';
import config from '../../config';
import { Metric } from '../entities/metric.entity';
import { Season } from '../entities/season.entity';
import { WaterFlowIndicator } from '../entities/waterFlowIndicator.entity';

require('dotenv').config();

const soilRepository = AppDataSource.getRepository(Soil);
const seasonRepository = AppDataSource.getRepository(Season);
const temperatureRepository = AppDataSource.getRepository(Temperature);
const humidityRepository = AppDataSource.getRepository(Humidity);
const waterFlowRepository = AppDataSource.getRepository(WaterFlowIndicator);

const metricRepository = AppDataSource.getRepository(Metric);

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

        // Find soil entity
        const soil = await soilRepository.findOne({
          where: { soilType: sensorData.soil },
        });
        if (!soil) {
          throw new Error('Soil not found');
        }

        // Find season entity
        const season = await seasonRepository.findOne({
          where: { season: sensorData.season },
        });
        if (!season) {
          throw new Error('Season not found');
        }

        const waterFlowIndicatorData: DeepPartial<WaterFlowIndicator> = {
          waterFlowRate: parseFloat(sensorData.flow), // Ensure this is a number
          totalWaterUsed: parseFloat(sensorData.totalWaterUsed), // Assuming this comes from your parsed data
          isIrrigated:
            sensorData.isIrrigated !== undefined
              ? sensorData.isIrrigated
              : false, // Default to false if not present
        };

        // Only add dates if they are present
        if (sensorData.startIrrigationTime) {
          waterFlowIndicatorData.startIrrigationTime = new Date(
            sensorData.startIrrigationTime
          );
        }

        if (sensorData.stopIrrigationTime) {
          waterFlowIndicatorData.stopIrrigationTime = new Date(
            sensorData.stopIrrigationTime
          );
        }

        const waterFlowIndicator = waterFlowRepository.create(
          waterFlowIndicatorData
        );
        await waterFlowRepository.save(waterFlowIndicator);

        // Insert temperature and humidity data
        const temperature = temperatureRepository.create({
          temperature: sensorData.temperature,
        });
        const humidity = humidityRepository.create({
          humidity: sensorData.humidity,
        });
        await temperatureRepository.save(temperature);
        await humidityRepository.save(humidity);

        // Get the min/max humidity values
        const humidityStats = await humidityRepository
          .createQueryBuilder('humidity')
          .select('MIN(humidity.humidity)', 'minHumidity')
          .addSelect('MAX(humidity.humidity)', 'maxHumidity')
          .getRawOne();

        const { minHumidity, maxHumidity } = humidityStats; // Correct destructuring

        // Get the min/max temperature values
        const temperatureStats = await temperatureRepository
          .createQueryBuilder('temperature')
          .select('MIN(temperature.temperature)', 'minTemperature')
          .addSelect('MAX(temperature.temperature)', 'maxTemperature')
          .getRawOne();

        const { minTemperature, maxTemperature } = temperatureStats; // Correct destructuring

        // Create and save Metric entity (fix here)
        const metric = metricRepository.create({
          minHumidity: minHumidity,
          maxHumidity: maxHumidity,
          minTemperature: minTemperature,
          maxTemperature: maxTemperature,
          soilType: soil.soilType,
          season: season.season,
        });

        await metricRepository.save(metric); // Saving the metric to the database

        // Prepare data for pest prediction
        const alerts = predictPestsAndDiseases();

        if ((await alerts).length > 0) {
          (await alerts).forEach((alert: { message: any }) =>
            console.log(alert.message)
          );
        }

        console.log('Data inserted into database from Kafka:', sensorData);
      } catch (err: any) {
        console.error('Error inserting data into the database:', err);
      }
    },
  });
};

connectConsumer().catch(console.error);
