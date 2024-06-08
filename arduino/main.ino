#define entradaDigital 12
#define entradaAnalogica 0

bool dSensor;
int aSensor;

int analogMin = 300;  // wet soil
int analogMax = 1000; // dry soil

#include <ArduinoJson.h>
#include <stdlib.h>

// Function to generate simulated temperature in Celsius
float generateTemperature()
{
  // Generate a random temperature between 20°C and 30°C
  float temperature = rand() % 1100 / 100.0 + 20.0;
  return temperature;
}

// Function to generate simulated humidity percentage
float generateHumidity()
{
  // Generate a random humidity between 40% and 60%
  float humidity = rand() % 2100 / 100.0 + 40.0;
  return humidity;
}

void setup()
{
  Serial.begin(9600);
  pinMode(entradaDigital, INPUT);
}

void loop()
{
  // Generate simulated temperature and humidity
  float temperature = generateTemperature();
  float humidity = generateHumidity();

  // Send temperature and humidity data to serial port
  // Serial.print(temperature);
  // Serial.print(',');
  // Serial.println(humidity);
  dSensor = digitalRead(entradaDigital);
  aSensor = analogRead(entradaAnalogica);

  // Serial.print("Leitura entrada digital: ");
  // Serial.println(dSensor);

  // Serial.print("Leitura entrada analógica: ");
  // Serial.println(aSensor);
  // Serial.println();

  // Map analog reading to percentage (0% to 100%)
  int moisturePercentage = map(aSensor, analogMin, analogMax, 0, 100);

  // Ensure percentage stays within 0-100% range
  moisturePercentage = constrain(moisturePercentage, 0, 100);

  // Create a JSON object
  StaticJsonDocument<200> doc;

  // Add sensor data to the JSON object
  doc["temperature"] = temperature;
  doc["humidity"] = moisturePercentage;
  // Add data to the JSON object
  // doc["soil_moisture_percentage"] = moisturePercentage;

  // Convert JSON object to string
  String output;
  serializeJson(doc, output);

  // Send JSON string over the serial port
  Serial.println(output);
  delay(600000);
}
