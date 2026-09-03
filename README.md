# Terrasense

Dispositivo de **medición** de parámetros del suelo y del ambiente que muestra los datos en una página web.

Terrasense lee humedad y temperatura del suelo, humedad y temperatura del aire, nivel de luz ambiental y pH del suelo mediante sensores conectados a un Arduino Uno. Los datos viajan por comunicación serial (cable) hacia un backend en Node + TypeScript, que los persiste y los expone al frontend.

Es un **proyecto de secundario**: el objetivo es que funcione de punta a punta y se entienda, no montar una arquitectura de producción. Por eso se usa Node + TypeScript sin frameworks ni base de datos, y se corre todo en una sola computadora.

> **Importante:** Terrasense **no** actúa sobre el cultivo. No riega, no ventila y no calefacciona. Lo único que hace es medir e informar.

---

## Problema que resuelve

Los granjeros y dueños de cultivos necesitan saber en qué estado está su tierra, pero medir cada variable a mano es lento y poco frecuente. Terrasense automatiza la toma de esos datos y los centraliza en una sola pantalla.

**Público objetivo:** productores agrícolas, huertas y cualquier persona que quiera monitorear una parcela.

---

## Estado del proyecto

Fase 2 en curso. **El backend ya funciona de punta a punta con datos simulados:** el mock genera una línea cada 5 segundos, el parser la convierte en objeto, el storage la guarda en `datos/mediciones.jsonl` y la API la sirve en `http://localhost:3000`. Falta reemplazar el mock por el Arduino real y que el frontend consuma la API.

| Área | Estado |
| :--- | :--- |
| Hardware — Fase 0 y 1 (selección, pinout, simulación) | Completado |
| Hardware — Fase 2 (protoboard físico, código real) | Pendiente |
| Frontend — Maquetado estructural (HTML + CSS gris) | Completado |
| Frontend — JS que consume la API | Pendiente |
| Frontend — CSS de alta fidelidad | Pendiente |
| Backend — Contrato del mensaje serial | **Cerrado** (CSV de 6 campos, ver [Contrato del mensaje](#contrato-del-mensaje)) |
| Backend — `package.json` y `tsconfig.json` | Completado |
| Backend — Tipos y modelo de datos (`back/tipos.ts`) | Completado |
| Backend — Mock de datos (`back/serial/mock.ts`) | Completado |
| Backend — Parser (`back/parser.ts`) | Completado |
| Backend — Storage JSON Lines + última en memoria (`back/storage.ts`) | Completado |
| Backend — API HTTP + servir el front (`back/api/rutas.ts`) | Completado |
| Backend — Comunicación serial real (`serialport`) | Pendiente |
| Backend — Usuarios y login | Pendiente (a propósito, va al final) |
| TIMI — Wireframes, paleta, UI Kit, modelado 3D base | Completado |

---

## Stack

- **Hardware:** Arduino Uno (C/C++ vía PlatformIO), simulación en Wokwi
- **Backend:** Node.js 24 + TypeScript 7 (Express para la API, `fs` para persistencia, `serialport` para leer el Arduino — todavía sin instalar)
- **Frontend:** HTML + CSS (sin framework por ahora)
- **Formato de intercambio:** CSV por el serial, JSON por HTTP
- **Diseño:** Figma (wireframes y UI Kit), Whimsical (mapa de navegación)

---

## Estructura del repositorio

### Hoy

```text
proyecto2026/
├── README.md
├── package.json
├── tsconfig.json           # configuración de TypeScript (solo chequeo, no compila)
├── front/
│   ├── index.html          # Maquetado principal (usa style.css)
│   ├── style.css
│   ├── wireframe.html      # Wireframe estructural (usa archivo.css)
│   ├── archivo.css
│   ├── wireframe1.html     # Wireframe alternativo (usa diseño.css)
│   ├── diseño.css
│   ├── pagina.html         # Pantalla en construcción (usa pagina.css, todavía vacío)
│   ├── pagina.css
│   └── images/
│       ├── imagenfondo.png                 # fondo del wireframe (11 MB, sin optimizar)
│       ├── Anotación 2026-08-18 153734.png # captura de trabajo (387 KB)
│       ├── 157038f1...594d8f4.png          # export de Figma (8 MB, sin optimizar)
│       ├── 67cd5ae0...5bb618c0.png         # export de Figma
│       └── a4a9a27a...9dc38c1e.png         # export de Figma
├── back/
│   ├── index.ts            # Arranque: conecta mock → parser → storage y levanta el server
│   ├── tipos.ts            # interfaces `medicion` y `usuario`
│   ├── parser.ts           # string CSV → medicion | null
│   ├── storage.ts          # fs: guarda en JSON Lines y mantiene la última en memoria
│   ├── serial/
│   │   └── mock.ts         # emite líneas falsas cada 5 s, para trabajar sin hardware
│   └── api/
│       └── rutas.ts        # Express: /api/actual, /api/historico y el estático de front/
├── datos/                  # lo genera el backend, está en .gitignore
│   └── mediciones.jsonl
└── firmware/               # proyecto PlatformIO, se abre aparte en VS Code
    ├── platformio.ini      # placa, framework y las 4 librerías
    ├── wokwi.toml          # rutas del binario para el simulador
    ├── diagram.json        # el circuito que simula Wokwi
    └── src/
        └── main.cpp        # el código del Arduino Uno
```

### Lo que falta agregar

La estructura de arriba ya sigue las cuatro capas descritas en [Arquitectura del backend](#arquitectura-del-backend). El único archivo que falta es el lector serial real, que va al lado del mock y expone la misma interfaz (un `EventEmitter` que emite `"data"` con un string por línea), para que `index.ts` pueda cambiar uno por otro sin tocar nada más:

```text
back/
└── serial/
    ├── lector.ts       # ← FALTA: abre el puerto COM con serialport, emite líneas
    └── mock.ts         # ya existe: emite líneas falsas
```

### Frontend (`front/`)

Cuatro páginas HTML, cada una con su propia hoja de estilos. No hay build, ni JS propio, ni assets compartidos: cada par HTML/CSS es independiente.

```text
front/
├── index.html ────────► style.css      # Maquetado principal. Único con contenido
│                                       # (<p> de humedad) y con un <script> roto
│                                       # apuntando a back/index.ts (ver Deuda técnica)
│
├── wireframe.html ────► archivo.css    # Wireframe estructural: 8 <section> grises
│   └── usa images/imagenfondo.png      # + una imagen de fondo
│
├── wireframe1.html ───► diseño.css     # Variante del mismo wireframe: 4 <section>
│
├── pagina.html ───────► pagina.css     # Pantalla en construcción: <body> y CSS
│                                       # los dos vacíos (0 bytes)
│
└── images/                             # Exports de Figma y capturas de trabajo
```

Los tres pares de arriba son versiones del mismo diseño, no pantallas distintas. La [Deuda técnica](#deuda-técnica-conocida) incluye unificarlos en un solo par antes de aplicar el CSS de alta fidelidad de Fase 2.

Desde que existe la API, esta carpeta ya no se abre con doble clic: el backend la sirve entera en `http://localhost:3000` (ver [API](#api)). Lo que todavía no existe es el JS del frontend que haga `fetch("/api/actual")` cada pocos segundos y escriba los valores en la pantalla — hoy el `<p>` de humedad está vacío y hay que mirar los datos entrando por `http://localhost:3000/api/actual`.

### Hardware (`firmware/`)

Todo el código del Arduino vive en `src/main.cpp`. Ya no es un `.ino` suelto: `firmware/` es un proyecto PlatformIO, con su configuración de placa y sus librerías declaradas (ver [Firmware y simulación](#firmware-y-simulación-platformio--wokwi)).

```text
firmware/
├── platformio.ini
├── wokwi.toml
├── diagram.json
└── src/
    └── main.cpp      # los 6 sensores y la línea que sale por serial
```

Cómo se conecta con el resto:

```text
                          firmware/src/main.cpp
                          ┌──────────────────────────────┐
  A0  Humedad de suelo ──►│                              │
  A1  LDR (luz)        ──►│  setup()                     │
  A2  pH (PH-4502C)    ──►│    Serial.begin(9600)        │
  D2  DS18B20 (OneWire)──►│    dht.begin() / sensors...  │
  D3  DHT11            ──►│                              │
                          │  loop()                      │
                          │    leer los 6 valores        │
                          │    Serial.println(linea) ────┼──► USB / serial ──► back/
                          │    delay(5000)               │
                          └──────────────────────────────┘
```

El formato exacto de `linea` ya está definido: es el [contrato del mensaje](#contrato-del-mensaje), y el mock y el parser del backend ya lo implementan. El código que produce esa línea ya está escrito y compila; lo que falta es [calibrarlo contra los sensores reales](#hardware-1).

### Firmware y simulación (PlatformIO + Wokwi)

El firmware dejó de ser un `.ino` suelto: `firmware/` es ahora un proyecto **PlatformIO**, así se compila desde VS Code y se simula sin tocar el hardware.

```text
firmware/
├── platformio.ini    # placa (uno), framework (arduino) y las 4 librerías
├── wokwi.toml        # le dice al simulador dónde están el .hex y el .elf
├── diagram.json      # el circuito que simula Wokwi (sensores y cableado)
├── .gitignore        # ignora .pio/ y la config de VS Code con rutas absolutas
└── src/
    └── main.cpp      # el código del Arduino Uno
```

**Abrir la carpeta `firmware/` en VS Code, no la raíz del repo.** PlatformIO busca el `platformio.ini` en la raíz del workspace: si abrís `proyecto2026/` no lo encuentra y no reconoce el proyecto.

Extensiones necesarias:

- **PlatformIO IDE** — compila, sube a la placa y abre el monitor serie.
- **Wokwi for VS Code** — el simulador. Pide una licencia, que para uso personal/educativo es gratuita (se saca desde la propia extensión).

Las 4 librerías (`DHT sensor library`, `Adafruit Unified Sensor`, `OneWire`, `DallasTemperature`) no están versionadas: PlatformIO las baja sola la primera vez que compilás y las deja en `.pio/libdeps/uno/`.

Flujo de trabajo:

```bash
pio run                 # compilar → genera .pio/build/uno/firmware.hex y .elf
pio run -t upload       # compilar y cargar en el Uno real
pio device monitor      # monitor serie a 9600 baudios
```

Para simular: `F1` → **Wokwi: Start Simulator**.

> **Hay que compilar antes de simular.** Wokwi no lee `main.cpp`: ejecuta el binario que dejó PlatformIO en `.pio/build/uno/`. Si cambiás el código y simulás sin correr `pio run`, vas a estar viendo la versión anterior — o un error de "firmware not found" si nunca compilaste.

El `main.cpp` tiene una constante `MODO_LEGIBLE` que elige el formato de salida: en `true` imprime cada variable con su nombre y unidad (para leer en el monitor serie), en `false` emite la línea CSV del [contrato del mensaje](#contrato-del-mensaje) que espera el backend.

---

## Hardware

### Entradas — variables medidas

| Variable | Sensor | Unidad | Señal |
| :--- | :--- | :--- | :--- |
| Humedad del suelo | Capacitive Soil Moisture Sensor v1.2 | % | Analógica |
| Temperatura del suelo | DS18B20 (sonda impermeable) | °C | Digital (OneWire) |
| Humedad del aire | DHT11 | % RH | Digital |
| Temperatura del aire | DHT11 | °C | Digital |
| Luz ambiental | LDR GL5528 | % (relativo) | Analógica |
| pH del suelo | Sonda de vidrio + placa PH-4502C | 0 – 14 | Analógica |

### Salidas

Ninguna. El dispositivo solo mide y envía; no actúa sobre el entorno.

### Consumo y ocupación de pines

| # | Modelo | Pines | Alimentación | Consumo |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Capacitive Soil Moisture v1.2 | 1 analógico | 3.3 – 5.5 V | ~5 mA |
| 2 | DS18B20 | 1 digital + pull-up 4.7 kΩ | 3.0 – 5.5 V | ~1.5 mA |
| 3 | DHT11 | 1 digital | 3.3 – 6 V | ~1.5 mA |
| 4 | LDR GL5528 + resistencia 10 kΩ | 1 analógico | pasivo | ~0.25 mA |
| 5 | PH-4502C + sonda BNC | 1 analógico | 5 V | ~10 mA |

**Total: 3 pines analógicos + 2 digitales.** El Uno tiene 6 analógicos y 12 digitales útiles (D2–D13), así que sobra margen.

**Pasivos y accesorios necesarios:** 1 resistencia de 4.7 kΩ (pull-up del DS18B20), 1 resistencia de 10 kΩ (divisor del LDR), protoboard y cables dupont.

### Pinout

Fijado en `firmware/src/main.cpp`. Si cambiás un pin acá, cambialo también allá.

| Componente | Pin | Nota |
| :--- | :--- | :--- |
| Humedad de suelo | A0 | |
| LDR | A1 | divisor con resistencia de 10 kΩ |
| pH (PH-4502C) | A2 | |
| DS18B20 | D2 | **pull-up de 4.7 kΩ entre datos y 5V** |
| DHT11 | D3 | |
| LED de actividad | D13 | el LED que ya trae la placa, parpadea en cada medición |

### Lista de compras

| Producto | Precio (ARS) |
| :--- | ---: |
| Sensor de humedad y temperatura de suelo | 2.394 |
| Sensor DHT11 (humedad y temperatura de aire) | 2.152 |
| Sensor de luz ambiental | 104 |
| Módulo sensor de pH PH-4502C | 57.500 |
| Kit de solución buffer para calibrar el pH | 36.137 |
| **Total aproximado** | **98.287** |

Precios relevados al momento de la investigación de Fase 0; pueden haber cambiado. No incluye resistencias, protoboard ni cables.

---

## Comunicación Hardware ↔ Backend

- **Medio:** cable (comunicación serial USB).
- **Librería del lado de Node:** `serialport`.
- **Velocidad:** 9600 baudios. Tiene que ser el mismo número en el sketch y en Node.

### Contrato del mensaje

Este es el punto donde se tocan Hardware y Backend. **Ya está cerrado** y es lo que implementan `back/serial/mock.ts` (lo produce) y `back/parser.ts` (lo consume):

1. **Un mensaje = una línea, terminada en `\n`.** El Arduino usa `Serial.println()` y Node usa el `ReadlineParser` con delimitador `\n`. Sin esto los datos llegan cortados en pedazos arbitrarios, porque el serial es un stream de bytes, no de mensajes.
2. **Formato: CSV**, no JSON. Armar JSON a mano en C++ con `Serial.print` es tedioso y propenso a errores; una línea CSV es mucho más simple del lado del Arduino, y Node la convierte a objeto igual de fácil.
3. **Seis campos numéricos, un decimal, en este orden:**

   ```text
   humedad_suelo,temperatura_suelo,humedad_aire,temperatura_aire,luz,ph
   52.3,20.2,59.1,28.7,65.3,6.8
   ```

   Ojo con el orden: primero van los dos del **suelo** y después los dos del **aire**. Es la fuente número uno de errores silenciosos, porque si se invierten el parser no se queja — los seis campos siguen siendo números válidos.

4. **Frecuencia: una línea cada 5 segundos.** Para parámetros de suelo sobra. Mandar cada 100 ms llena el disco y el frontend no lo puede seguir.
5. **Lecturas fallidas.** Del lado de Node ya está resuelto: `parsear()` devuelve `null` si la línea no trae exactamente 6 campos o si alguno no es un número, y `index.ts` descarta esas líneas sin guardarlas. Lo que **falta decidir del lado del Arduino** es qué manda cuando el DHT11 devuelve `NaN`: lo más simple es no mandar la línea, porque cualquier valor centinela (`-1`, `999`) pasa el parser y se guarda como si fuera una medición real.

### El timestamp lo pone Node, no el Arduino

El Arduino Uno **no tiene reloj de tiempo real**. No sabe qué hora es y no puede generar una fecha. El backend le pone el timestamp a cada lectura en el momento en que la recibe.

Ejemplo del objeto ya armado del lado de Node (el `timestamp` no viene por el cable, lo agrega el backend):

```json
{
  "timestamp": "2026-08-26T14:32:00Z",
  "suelo": {
    "humedad": 42.5,
    "temperatura": 18.3
  },
  "aire": {
    "humedad": 61.0,
    "temperatura": 22.7
  },
  "luz": 78.2,
  "ph": 6.4
}
```

### Trampas conocidas del serial en Windows

- **El puerto COM lo puede abrir un solo programa a la vez.** Si el monitor serie (`pio device monitor`) está abierto, Node falla con `Access denied`. Es la causa número uno de "no funciona": cerrar el monitor.
- **El número de COM cambia** según el puerto USB donde se enchufe la placa. No hardcodearlo: leerlo de una variable de entorno o listar los puertos disponibles al arrancar.
- **Abrir el puerto resetea el Arduino** (por DTR). Las primeras líneas pueden ser basura del arranque: descartar lo que no parsee en vez de crashear.
- **Si se desconecta el cable, el proceso Node no muere solo.** Hay que manejar el evento de error/cierre y reintentar, o el backend queda vivo pero mudo.

---

## Arquitectura del backend

Cuatro capas, cada una en su archivo. La regla es que ninguna sepa de la de al lado más de lo necesario. **Las cuatro están escritas y funcionando**, con el mock en el lugar del lector serial:

```text
Arduino ──serial──► [1 lector] ──► [2 parser] ──► [3 storage] ──► [4 API HTTP] ──► Frontend
                     mock.ts       parser.ts      storage.ts      api/rutas.ts
                     (falta el
                      lector real)
```

| # | Capa | Archivo | Responsabilidad | Lo que NO sabe |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Lector serial** | `serial/mock.ts` | Abrir el puerto, leer líneas, emitirlas como strings | Qué es un pH |
| 2 | **Parser + validador** | `parser.ts` | String → `medicion` válida, o `null` | Que existe un puerto serie |
| 3 | **Storage** | `storage.ts` | Guardar la `medicion` en disco con `fs` | De dónde vino el dato |
| 4 | **API HTTP** | `api/rutas.ts` | Leer del storage y servirlo al frontend | Que existe un Arduino |

La ventaja concreta ya se cobró: como la capa 1 emite strings y nada más, cambiar el mock por el lector serial real es cambiar una línea en `back/index.ts`. Las otras tres capas no se enteran.

`back/index.ts` es el único archivo que conoce a las cuatro, y es corto a propósito — engancha el mock al parser, el parser al storage, y levanta el server:

```ts
const fuente = crearMock();

fuente.on("data", (linea: string) => {
    const medicion = parsear(linea);
    if (medicion === null) return;   // línea corrupta: se descarta
    guardar(medicion);
});

crearServidor(3000);
```

### Persistencia

Un objeto JSON por línea (formato **JSON Lines**, `.jsonl`), y cada medición nueva es un `appendFile`.

La alternativa intuitiva —un array en un `mediciones.json` con ciclo `leer → push → escribir entero`— funciona con 50 registros y se vuelve lenta y frágil con 50.000: reescribe el archivo completo en cada medición, y si se corta a la mitad se pierde todo el histórico. Con JSON Lines se escribe solo lo nuevo, y una línea corrupta cuesta una lectura, no el archivo.

Aparte, `storage.ts` mantiene **la última medición en memoria**, en una variable. El endpoint que el frontend consulta cada pocos segundos lee de ahí, sin tocar el disco.

Está implementado así: `guardar()` hace `appendFile` sobre `datos/mediciones.jsonl` (creando la carpeta si no existe) y de paso actualiza la variable; `obtenerUltima()` devuelve esa variable; `obtenerHistorico()` lee el archivo entero y parsea línea por línea. Si el archivo todavía no existe, `obtenerHistorico()` devuelve `[]` en vez de romper.

### API

Ya está levantada con Express en `back/api/rutas.ts`, en el puerto 3000:

| Endpoint | Estado | Devuelve |
| :--- | :--- | :--- |
| `GET /api/actual` | Funcionando | La última medición — lo que el dashboard muestra en grande |
| `GET /api/historico` | Funcionando | El array completo de mediciones, para los gráficos |
| `GET /api/historico?desde=...` | Pendiente | El filtro por fecha todavía no está implementado: hoy devuelve todo |

`GET /api/actual` devuelve `null` durante los primeros 5 segundos, hasta que llega la primera medición del mock. El frontend tiene que contemplarlo.

El servidor también **sirve el `front/` desde el mismo origen** (`app.use(express.static("front"))`), en vez de abrir el HTML con doble clic. Si la página se abriera como archivo (`file://`) y hiciera `fetch` a `localhost:3000`, el navegador lo bloquearía por CORS. Sirviendo todo desde el mismo origen, el problema no existe.

Para actualizar la pantalla, un `fetch` cada N segundos (*polling*) alcanza. WebSockets es más elegante, pero es complejidad que este proyecto todavía no necesita.

### Orden de trabajo sugerido

Pensado para **no depender del hardware para avanzar**: el backend puede estar terminado antes de que el protoboard exista.

1. ~~Crear `package.json`.~~ **Hecho.**
2. ~~Definir las `interface` en `back/tipos.ts` y cerrar el contrato del mensaje serial.~~ **Hecho.**
3. ~~Escribir el **mock**: un módulo que emite líneas falsas con el formato acordado cada 5 segundos.~~ **Hecho.**
4. ~~Parser + storage, probados contra el mock.~~ **Hecho.**
5. ~~API HTTP + servir el front.~~ **Hecho a medias:** la API sirve datos y el front se sirve desde Node, pero la página todavía no los pide. Falta el JS del frontend.
6. **Acá estamos.** El lector serial real. Como todo lo demás ya funciona, si algo falla el problema está en el puerto o en el firmware, no en la lógica del backend.
7. Usuarios y login **al final**: no bloquean nada.

---

## Modelo de datos

### Mediciones

Definido en `back/tipos.ts` como `interface medicion`. Suelo y aire van anidados, así cada uno tiene su humedad y su temperatura sin que los nombres choquen:

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `timestamp` | string | Fecha ISO 8601, generada por el backend al recibir la lectura |
| `suelo.humedad` | number | Humedad del suelo en % |
| `suelo.temperatura` | number | Temperatura del suelo en °C |
| `aire.humedad` | number | Humedad del aire en % RH |
| `aire.temperatura` | number | Temperatura del aire en °C |
| `luz` | number | Nivel de luz ambiental (0 – 100) |
| `ph` | number | pH del suelo (0 – 14) |

### Usuarios

Definido en `back/tipos.ts` como `interface usuario`. Todavía no se usa en ningún lado: el login va al final del [orden de trabajo](#orden-de-trabajo-sugerido).

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `nombre` | string | Identificador del usuario |
| `contrasena` | string | Debe guardarse hasheada, nunca en texto plano |

Falta el campo `mail`, que estaba en el diseño original y todavía no está en la interfaz.

---

## Flujo de la información

```text
Sensores → Arduino → (serial, CSV) → Backend → (HTTP, JSON) → Frontend → Usuario
```

El Arduino manda CSV porque es lo más simple de escribir en C++; el backend lo convierte a JSON, lo guarda y lo entrega al frontend, que lo renderiza en pantalla. El único tramo que todavía no está escrito es el primero (Arduino real) y el último (render en pantalla): hoy el mock reemplaza al Arduino y la API devuelve JSON que nadie pide todavía.

---

## Cómo correr el proyecto

### Frontend

No se abre con doble clic: lo sirve el backend. Levantar el server con `npm run dev` y entrar a `http://localhost:3000`. No hay build ni dependencias del lado del front.

### Backend

Requiere **Node.js 24 o superior**. La primera vez, `npm install` (instala Express, TypeScript y los tipos de Node).

| Comando | Qué hace |
| :--- | :--- |
| `npm run dev` | Levanta todo: arranca el mock, guarda cada medición en `datos/mediciones.jsonl` y sirve la API y el front en `http://localhost:3000`. Corta con `Ctrl+C`. |
| `npm run check` | Chequea los tipos de todo `back/` con `tsc`. No genera archivos. |

Con el server levantado se puede verificar que la cadena entera funciona:

```text
GET http://localhost:3000/api/actual      → la última medición, o null los primeros 5 s
GET http://localhost:3000/api/historico   → el array completo
http://localhost:3000/                    → el front (todavía sin datos en pantalla)
```

Cada corrida agrega líneas a `datos/mediciones.jsonl`. Esa carpeta está en `.gitignore`: son datos generados, no código. Si se quiere empezar de cero, se borra el archivo.

#### Por qué no hace falta compilar

Node 24 ejecuta archivos `.ts` directamente: al leerlos **borra las anotaciones de tipo** y corre el JavaScript que queda. No los compila ni los verifica — un error de tipos no lo detiene.

Esa es la división de trabajo del proyecto: **Node ejecuta, TypeScript revisa**. Por eso hay dos comandos y no uno, y por eso `tsconfig.json` tiene `noEmit: true` — no existe un paso de build ni una carpeta `dist/`.

#### `tsconfig.json`

Configura el chequeo de tipos del backend (`include: ["back/**/*.ts"]`; el front es HTML/CSS y el firmware es C++, así que quedan afuera). Las opciones que importan:

| Opción | Por qué está |
| :--- | :--- |
| `noEmit` | No se compila nada: Node ya ejecuta los `.ts`. `tsc` solo revisa. |
| `erasableSyntaxOnly` | Prohíbe la sintaxis que Node **no** puede borrar (`enum`, `namespace`, parámetros con `private`). Sin esto, el código pasa el chequeo pero explota al ejecutarlo. |
| `verbatimModuleSyntax` | Obliga a escribir `import type` cuando se importa un tipo, para que Node sepa qué línea borrar. |
| `module` / `moduleResolution: nodenext` | El proyecto es ESM (`"type": "module"` en `package.json`); esto hace que TypeScript resuelva los imports igual que Node. |
| `allowImportingTsExtensions` | Permite `import { Medicion } from "./tipos.ts"` — en ESM la extensión va sí o sí, y como no se compila, es la del archivo real. |
| `strict` | El punto de usar TypeScript. Incluye `strictNullChecks`, que es lo que va a atajar los `NaN` del DHT11 descritos arriba. |
| `noUncheckedIndexedAccess` | Al partir la línea CSV del serial, `partes[5]` pasa a ser `string | undefined`. Obliga a contemplar la línea corta o corrupta antes de usarla. |

Las tres últimas son las que le dan sentido a definir las `interface` de `back/tipos.ts`: sin `strict`, el compilador acepta cualquier cosa y el contrato no sirve de nada.

### Hardware

Se trabaja con la carpeta `firmware/` abierta como workspace en VS Code, no la raíz del repo (ver [Firmware y simulación](#firmware-y-simulación-platformio--wokwi)).

#### Antes de tocar la placa: dos cambios en el código

1. **`TIPO_DHT` va en `DHT11`.** Está en `DHT22` porque es lo que simula Wokwi. Contra un DHT11 real el protocolo no coincide, `readHumidity()` y `readTemperature()` devuelven `nan` y las dos variables de aire salen en `-1`. El DHT11 además devuelve enteros: vas a ver `22.00` y `61.00` sin decimales, y eso es normal (su precisión es ±2 °C y ±5 %).
2. **`MODO_LEGIBLE` en `true`** hasta terminar de calibrar. Recién al final se pasa a `false`.

#### Armado

Además de los sensores hacen falta dos resistencias que no son opcionales:

- **4.7 kΩ entre el pin de datos del DS18B20 (D2) y 5V.** Sin el pull-up el bus OneWire no levanta y `getTempCByIndex(0)` devuelve `-127`, que el código convierte en `-1`. Es el error más común con este sensor.
- **10 kΩ para el divisor del LDR.** Acá importa la orientación: las constantes `LUZ_OSCURO = 1000` y `LUZ_CLARO = 100` asumen que más luz da lectura más baja, que es lo que pasa con el LDR a GND y la de 10 kΩ a 5V. Si queda al revés el porcentaje sale invertido — se da vuelta el divisor o se intercambian las dos constantes.

**Alimentación:** los 5 sensores suman ~18 mA y el USB entrega 500 mA. Alcanza de sobra, no hace falta fuente externa.

#### Subir el programa

```bash
pio device list          # ver qué COM agarró la placa
pio run -t upload        # compilar y subir
pio device monitor       # monitor serie a 9600 baudios
```

`upload` detecta el puerto solo. Si falla, se fija a mano en `platformio.ini`:

```ini
upload_port = COM3
```

Si Windows no reconoce la placa es el driver: los Uno originales usan el ATmega16U2 y andan de una, los clones usan **CH340** y hay que instalarlo aparte. Aparece en el Administrador de dispositivos como "USB-SERIAL CH340".

#### Calibración

Los valores de calibración del código son de ejemplo. Con `MODO_LEGIBLE = true` se anota lo que imprime el monitor y se reemplazan:

| Constante | Cómo obtenerla |
| :--- | :--- |
| `SUELO_SECO` | lectura del sensor al aire |
| `SUELO_MOJADO` | lectura sumergido hasta la línea marcada, **no más arriba** |
| `LUZ_OSCURO` / `LUZ_CLARO` | lectura tapando el LDR y con la luz de la sala |
| `PH_V_NEUTRO` / `PH_PENDIENTE` | con el kit de buffers, ver abajo |

El sensor de suelo es capacitivo (v1.2): seco lee **alto** y mojado lee **bajo**. La dirección del código ya contempla eso.

Para el pH se imprime el voltaje crudo en vez del pH, se mide en buffer 6.86 y en 4.01, y se calcula:

```text
PH_PENDIENTE = (volt_en_4.01 - volt_en_6.86) / (6.86 - 4.01)
PH_V_NEUTRO  = volt_en_6.86 - 0.14 * PH_PENDIENTE
```

Entre medición y medición hay que **enjuagar la sonda con agua destilada**. Y la sonda no se guarda al aire: va en solución KCl o se arruina. Es el componente más caro del proyecto.

> **Detalle del ADC:** el Uno tiene un solo conversor multiplexado entre A0, A1 y A2. Con fuentes de alta impedancia como el divisor del LDR queda carga residual de la lectura anterior y contamina el valor. Si los números saltan raro, se lee dos veces y se descarta la primera: `analogRead(pin); delay(10); return analogRead(pin);`

#### Conectar el backend

Con los 6 valores ya calibrados: `MODO_LEGIBLE = false`, `pio run -t upload` de nuevo, y la placa pasa a emitir la línea CSV del [contrato del mensaje](#contrato-del-mensaje).

**Cerrar el monitor serie antes de levantar Node.** En Windows el puerto COM es de acceso exclusivo: si `pio device monitor` lo tiene abierto, `serialport` no puede abrirlo y el backend falla con "Access denied" (ver [Trampas conocidas del serial en Windows](#trampas-conocidas-del-serial-en-windows)).

---

## Deuda técnica conocida

- Hay tres pares HTML/CSS distintos (`style.css`, `archivo.css`, `diseño.css`) que son versiones del mismo wireframe. Unificarlos antes de aplicar el CSS definitivo de Fase 2.
- `front/index.html` incluye `<script src="back/index.ts">`. Sigue roto por dos motivos: el navegador no ejecuta TypeScript, y `back/` no se sirve (Express solo publica `front/`). Reemplazarlo por un `front/app.js` propio que haga `fetch("/api/actual")`.
- El frontend todavía no consume la API. El backend sirve los datos, pero la página no los pide ni los muestra.
- `GET /api/historico` ignora el parámetro `?desde=`: siempre devuelve el archivo entero. Con pocas mediciones no molesta, pero crece sin límite.
- `obtenerHistorico()` lee y parsea el `.jsonl` completo en cada request. Sirve para el volumen actual; no para miles de líneas.
- `back/storage.ts` importa `json` de `node:stream/consumers` y no lo usa. Sacarlo.
- `back/index.ts` no espera al `guardar()` (es `async` y no se le hace `await`), así que un error de escritura queda como promesa rechazada sin manejar. Como `guardar()` ya atrapa sus propios errores no explota hoy, pero es frágil.
- Los valores de calibración de `firmware/src/main.cpp` son de ejemplo: hay que medirlos contra los sensores reales antes de darle sentido a los datos (ver [Hardware](#hardware-1)).
- `TIPO_DHT` está en `DHT22` porque es lo que simula Wokwi. Contra el DHT11 físico hay que cambiarlo o las dos variables de aire salen en `-1`.

---

## Equipo

| Rol | Integrante | Grupo |
| :--- | :--- | :--- |
| Frontend | Juan Ignacio Balenzuela | 4 |
| Backend | Salomon Mizrahi | 4 |
| TIMI | Sebastián Lifischtz | 2 |
| Hardware | Joaquín Nitkin | 4 |

---

## Links del proyecto

| Recurso | Link |
| :--- | :--- |
| Repositorio | https://github.com/juanignaciobalenzuela/proyecto2026 |
| Figma (diseño) | https://www.figma.com/design/LOfVQZUNdQiagKO3WrTWsm/Terrasense |
| Mapa de navegación (Whimsical) | https://whimsical.com/seba911/67-SGUzQjrn235iadRxaFBt8v |
| Tinkercad (simulación general) | https://www.tinkercad.com/things/8hIHPngK105-simulacion-proyecto |
| Tinkercad (diseño 3D) | https://www.tinkercad.com/things/8pvMpRjLoZF |
| Carpeta Drive compartida | https://drive.google.com/drive/folders/1iYzrdeP41GJWMEvDUcp_GPrCAFDjBN_9 |

### Simulaciones individuales

- [Humedad de suelo](https://www.tinkercad.com/things/gMeaHPNx0Oa-simulacion-sensor-humedad-suelo)
- [Temperatura de suelo](https://www.tinkercad.com/things/2sOLplP9QpR-copy-of-simulacion-sensor-temperatura-suelo)
- [Humedad de aire](https://www.tinkercad.com/things/6KYQubaLGYE-simulacion-sensor-aire)
- [Luz ambiental](https://www.tinkercad.com/things/4f4dBM66pOP-simulacion-sensor-luz)
- [pH](https://www.tinkercad.com/things/7x7wQgSI96c-simulacion-sensor-ph)
- [Conductividad eléctrica](https://www.tinkercad.com/things/jwHggfrYNdC-simulacion-sensor-conductividad-electrica) — simulado, pero no forma parte del set de sensores definido

---

## Próximos pasos

### Lo próximo

- [ ] **Escribir el JS del frontend** que haga `fetch("/api/actual")` cada 5 s y pinte los valores en pantalla. Es lo que falta para cerrar el circuito completo con datos simulados.
- [ ] **Implementar el lector serial real** (`back/serial/lector.ts`) con la misma interfaz que el mock, e instalar `serialport`.

### Backend

- [x] Crear `package.json`
- [x] Configurar TypeScript (`tsconfig.json` + `npm run check`)
- [x] Cerrar el formato del mensaje serial y documentarlo
- [x] Definir las `interface` en `back/tipos.ts`
- [x] Escribir el mock de datos para desarrollar sin hardware
- [x] Parser
- [x] Storage en JSON Lines + última medición en memoria
- [x] API HTTP (`/api/actual` y `/api/historico`)
- [x] Servir el `front/` desde el backend
- [ ] Implementar la comunicación serial con `serialport`
- [ ] Soportar `?desde=` en `/api/historico`
- [ ] Usuarios y login (al final, no bloquea nada)

### Hardware

- [x] Versionar el firmware (`firmware/`, proyecto PlatformIO — compila y simula en Wokwi)
- [x] Documentar el pinout definitivo en este README
- [x] Relevar la alimentación energética (~18 mA en total, alcanza con USB)
- [ ] Ensamblar el circuito en protoboard
- [ ] Cambiar `TIPO_DHT` a `DHT11` y verificar las lecturas de aire
- [ ] Calibrar los sensores analógicos (suelo, LDR y pH con el kit de buffers)
- [ ] Pasar `MODO_LEGIBLE` a `false` y conectar el backend por serial

### Frontend y diseño

- [ ] Unificar los wireframes duplicados en un solo par HTML/CSS
- [ ] Reemplazar el `<script src="back/index.ts">` de `index.html` por un `front/app.js` real
- [ ] Aplicar el CSS de alta fidelidad con el UI Kit de TIMI
- [ ] Calcular tolerancias y revisar el diseño 3D con el docente
