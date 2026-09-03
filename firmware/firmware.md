# Terrasense — firmware

Proyecto **PlatformIO** del Arduino Uno. Lee 6 variables y las manda por serial al backend.

**Abrí esta carpeta (`firmware/`) en VS Code, no la raíz del repo:** PlatformIO busca el
`platformio.ini` en la raíz del workspace.

## Extensiones

| Extensión | Para qué |
|---|---|
| PlatformIO IDE | compilar, cargar en la placa, monitor serie |
| Wokwi for VS Code | simular el circuito (licencia gratuita para uso personal) |

## Comandos

```bash
pio run                 # compilar → .pio/build/uno/firmware.hex y .elf
pio run -t upload       # compilar y cargar en el Uno
pio device monitor      # monitor serie, 9600 baudios
```

Simular: `F1` → **Wokwi: Start Simulator**.

> Hay que correr `pio run` **antes** de simular: Wokwi ejecuta el binario de
> `.pio/build/uno/`, no lee `src/main.cpp`.

## Archivos

- `platformio.ini` — placa, framework y las 4 librerías (las baja PlatformIO sola).
- `wokwi.toml` — rutas del `.hex` y el `.elf` que consume el simulador.
- `diagram.json` — el circuito: sensores, cableado y pines.
- `src/main.cpp` — el código.

`.pio/` no se versiona: son artefactos de compilación y las librerías descargadas.

## Pines

| Pin | Sensor |
|---|---|
| A0 | humedad de suelo |
| A1 | LDR (luz) |
| A2 | pH (PH-4502C) |
| D2 | DS18B20 (OneWire, pull-up 4.7k) |
| D3 | DHT |
| D13 | LED de actividad |

## Formato de salida

La constante `MODO_LEGIBLE` en `src/main.cpp` elige el formato:

- `true` — una línea por variable con nombre y unidad, para leer en el monitor serie.
- `false` — una línea CSV `humSuelo,tempSuelo,humAire,tempAire,luz,ph`, que es lo que
  parsea el backend. Lectura fallida = `-1`. El timestamp lo pone Node.
