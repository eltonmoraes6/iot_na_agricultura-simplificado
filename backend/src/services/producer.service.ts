import { ReadlineParser } from '@serialport/parser-readline';
import config from 'config';
import { Kafka } from 'kafkajs';
import { SerialPort, SerialPortOpenOptions } from 'serialport';
require('dotenv').config();

const arduinoConfig = config.get<{ baudRate: string; comPort: string }>(
  'serialPortConfig'
);

const serialPortOptions: SerialPortOpenOptions<any> = {
  path: arduinoConfig.comPort,
  baudRate: parseInt(arduinoConfig.baudRate, 10),
};

const arduinoPort = new SerialPort(serialPortOptions);
const parser = new ReadlineParser({ delimiter: '\r\n' });

arduinoPort.pipe(parser);

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:19092'],
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
  console.log(`Connected to Arduino on ${arduinoConfig.comPort}`);
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

    if (!parsedData.temperature || !parsedData.humidity) {
      console.warn('Incomplete data:', parsedData);
      return;
    }

    const sensorData = {
      temperature: parseFloat(parsedData.temperature),
      humidity: parseFloat(parsedData.humidity),
      season: getBrazilianSeason(),
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
