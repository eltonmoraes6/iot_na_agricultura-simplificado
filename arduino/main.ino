#define entradaDigital 12
#define entradaAnalogica 0

bool dSensor;
int aSensor;

int analogMin = 300;  // wet soil
int analogMax = 1000; // dry soil

#include <ArduinoJson.h>
#include <stdlib.h>

// Function to generate simulated temperature in Celsius
float generateTemperature() {
  // Generate a random temperature between 20°C and 30°C
  return rand() % 1100 / 100.0 + 20.0;
}

// Function to generate simulated humidity percentage
float generateHumidity() {
  // Generate a random humidity between 40% and 60%
  return rand() % 2100 / 100.0 + 40.0;
}

// Function to generate simulated water flow rate
float generateWaterFlowRate() {
  // Generate a random water flow rate
  return rand() % 200 + 100; // Example: between 100 and 300 liters/hour
}

// Function to simulate total water used
float generateTotalWaterUsed() {
  // Generate a random total water used
  return rand() % 5000 + 1000; // Example: between 1000 and 6000 liters
}

// Function to simulate irrigation status
bool isIrrigated() {
  return rand() % 2 == 0; // Randomly true or false
}

void setup() {
  Serial.begin(9600);
  pinMode(entradaDigital, INPUT);
}

void loop() {
  // Generate simulated temperature, humidity, water flow rate, total water used
  float temperature = generateTemperature();
  float humidity = generateHumidity();
  float waterFlowRate = generateWaterFlowRate();
  float totalWaterUsed = generateTotalWaterUsed();
  bool irrigated = isIrrigated();

  // Read the digital and analog sensors
  dSensor = digitalRead(entradaDigital);
  aSensor = analogRead(entradaAnalogica);

  // Map analog reading to percentage (0% to 100%)
  int moisturePercentage = map(aSensor, analogMin, analogMax, 0, 100);
  moisturePercentage = constrain(moisturePercentage, 0, 100);

  // Create a JSON object
  StaticJsonDocument<300> doc;

  // Add sensor data to the JSON object
  doc["temperature"] = temperature;
  doc["humidity"] = moisturePercentage;
  doc["flow"] = waterFlowRate;
  doc["totalWaterUsed"] = totalWaterUsed;
  doc["isIrrigated"] = irrigated;
  doc["startTime"] = millis(); // Example start time (can adjust as needed)

  // Convert JSON object to string
  String output;
  serializeJson(doc, output);

  // Send JSON string over the serial port
  Serial.println(output);
  delay(60000); // Send data every minute
}
