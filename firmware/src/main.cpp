#include <Arduino.h>   
#include <OneWire.h>
#include <DallasTemperature.h>
#include <DHT.h>

#define TIPO_DHT DHT22    

const bool MODO_LEGIBLE = true;  

const uint8_t PIN_HUM_SUELO = A0, PIN_LUZ = A1, PIN_PH = A2, PIN_DHT = 3, PIN_LED = 13;

const int SUELO_SECO = 620, SUELO_MOJADO = 310, LUZ_OSCURO = 1000, LUZ_CLARO = 100;
const float PH_NEUTRO = 7.0, PH_V_NEUTRO = 2.5, PH_PENDIENTE = 0.18;

const char* NOMBRES[6]  = { "Humedad suelo", "Temp suelo", "Humedad aire",
                            "Temp aire", "Luz", "pH" };
const char* UNIDADES[6] = { "%", "°C", "%", "°C", "%", "(0-14)" };

OneWire oneWire(2);
DallasTemperature suelo(&oneWire);
DHT dht(PIN_DHT, TIPO_DHT);

float pct(uint8_t pin, int cero, int cien) {
  float p = (analogRead(pin) - cero) * 100.0 / (cien - cero);
  return p <= 0 ? 0 : (p >= 100 ? 100 : p);
}

float leerPh() {
  float volt = analogRead(PIN_PH) * 5.0 / 1023;
  return constrain(PH_NEUTRO + (PH_V_NEUTRO - volt) / PH_PENDIENTE, 0, 14);
}

void setup() {
  Serial.begin(9600);
  pinMode(PIN_LED, OUTPUT);
  suelo.begin();
  dht.begin();
  delay(1500);            
}

void loop() {
  suelo.requestTemperatures();
  float v[6] = { pct(PIN_HUM_SUELO, SUELO_SECO, SUELO_MOJADO),
  suelo.getTempCByIndex(0),
  dht.readHumidity(),
  dht.readTemperature(),
  pct(PIN_LUZ, LUZ_OSCURO, LUZ_CLARO),
  leerPh() };

  for (uint8_t i = 0; i < 6; i++) {
    if (isnan(v[i]) || v[i] < -100) v[i] = -1;   // DHT en NaN o DS18B20 ausente (-127)
    if (MODO_LEGIBLE) {
      Serial.print(NOMBRES[i]);  Serial.print(": ");
      Serial.print(v[i], 2);     Serial.print(' ');
      Serial.println(UNIDADES[i]);
    } else {
      Serial.print(v[i], 2);
      Serial.print(i < 5 ? ',' : '\n');          // coma entre campos, salto al final
    }
  }
  if (MODO_LEGIBLE) Serial.println();            // renglon en blanco entre mediciones

  digitalWrite(PIN_LED, HIGH); delay(80); digitalWrite(PIN_LED, LOW);
  delay(5000);
}
