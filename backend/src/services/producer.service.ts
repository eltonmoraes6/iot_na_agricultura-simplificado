import { ReadlineParser } from '@serialport/parser-readline';
import { Kafka } from 'kafkajs';
import { SerialPort, SerialPortOpenOptions } from 'serialport';
import config from '../../config';
import { Season } from '../entities/season.entity';
import { Soil } from '../entities/soil.entity';
import { AppDataSource } from '../utils/data-source';
require('dotenv').config();

const soilRepository = AppDataSource.getRepository(Soil);
const seasonRepository = AppDataSource.getRepository(Season);

const serialPortOptions: SerialPortOpenOptions<any> = {
  path: config.serialPortConfig.comPort,
  baudRate: parseInt(config.serialPortConfig.baudRate, 10),
};

const arduinoPort = new SerialPort(serialPortOptions);
const parser = new ReadlineParser({ delimiter: '\r\n' });

arduinoPort.pipe(parser);

const kafka = new Kafka({
  clientId: config.kafkaConfig.clientId,
  brokers: config.kafkaConfig.brokers,
  connectionTimeout: 3000,
});

const producer = kafka.producer();

const getBrazilianSeason = (date = new Date()) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (
    (month === 12 && day >= 21) ||
    (month >= 1 && month <= 2) ||
    (month === 3 && day <= 20)
  ) {
    return 'Summer';
  } else if (
    (month === 3 && day >= 21) ||
    (month >= 4 && month <= 5) ||
    (month === 6 && day <= 20)
  ) {
    return 'Fall';
  } else if (
    (month === 6 && day >= 21) ||
    (month >= 7 && month <= 8) ||
    (month === 9 && day <= 22)
  ) {
    return 'Winter';
  } else {
    return 'Spring';
  }
};

arduinoPort.on('open', () => {
  console.log(`Connected to Arduino on ${config.serialPortConfig.comPort}`);
});

parser.on('data', async (data: any) => {
  data = data.trim();

  if (data === '') {
    console.warn('Received empty data');
    return;
  }

  console.log('Raw data received:', data);

  try {
    const parsedData = JSON.parse(data);

    // Validate required data
    const requiredFields = ['temperature', 'humidity', 'flow', 'startTime'];
    for (const field of requiredFields) {
      if (!parsedData[field]) {
        console.warn(`Incomplete data: missing ${field}`, parsedData);
        return;
      }
    }

    const soil = await soilRepository.findOneBy({ soilType: 'Argissolos' });

    if (!soil) {
      console.warn('Soil value required:', soil);
      return;
    }

    const season = await seasonRepository.findOneBy({
      season: getBrazilianSeason(),
    });

    if (!season) {
      console.warn('season value required:', season);
      return;
    }

    const sensorData = {
      temperature: parseFloat(parsedData.temperature),
      humidity: parseFloat(parsedData.humidity),
      season: season.season,
      soil: soil.soilType,
      flow: parseFloat(parsedData.flow),
      startTime: parsedData.startTime,
      totalWaterUsed: parseFloat(parsedData.totalWaterUsed), // Ensure to add this line
      isIrrigated: parsedData.isIrrigated, // Make sure to handle this field properly
    };

    if (isNaN(sensorData.temperature) || isNaN(sensorData.humidity)) {
      console.warn('Parsed NaN values:', sensorData);
      return;
    }

    await producer.connect();
    await producer.send({
      topic: 'sensor',
      messages: [{ value: JSON.stringify(sensorData) }],
    });
    console.log('Data sent to Kafka:', sensorData);
  } catch (err: any) {
    console.error('Error processing data from Arduino:', err);
  }
});

arduinoPort.on('error', (err) => {
  console.error('Serial port error:', err);
});
