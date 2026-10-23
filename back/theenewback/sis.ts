import express from 'express';
import type { Express, Request, Response } from 'express';
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

const app: Express = express();
app.use(express.static("C:/Users/51215217/Documents/GitHub/proyecto2026/front"))
const PUERTO: number = Number(process.env.PORT ?? 3000);

app.use(express.json());

/** Ruta de control: responde 200 con el texto OK. */
app.get('/health', (req: Request, res: Response): void => {
  res.status(200).type('text/plain').send('OK');
});

// [TODO] Registrar acá todas sus rutas de la API
interface medicion {
  timestamp: string;
  suelo: {
    humedad: number | null;
    temperatura: number | null;
  };
  aire: {
    humedad: number | null;
    temperatura: number | null;
  };
  luz: number | null;
  ph: number | null;
}

interface login {
  nombre: string;
  correo: string;
  contraseña: string;
}

interface signin {
  correo1: string;
  contraseña1: string;
}

const carpeta: string = 'datos';
const archivo: string = carpeta + '/mediciones.json';
const archivosusuarios = carpeta + '/usuarios.json';

let ultima: medicion | null = null;

export function guardar(medicion: medicion) {
  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }

  let historico: medicion[] = obtenerHistorico();
  historico.push(medicion);
  writeFileSync(archivo, JSON.stringify(historico), 'utf-8');

  ultima = medicion;
}

export function obtenerUltima(): medicion | null {
  if (ultima === null) {
    let historico = obtenerHistorico();
    if (historico.length > 0) {
      ultima = historico[historico.length - 1];
    }
  }
  return ultima;
}

export function obtenerHistorico(): medicion[] {
  if (!existsSync(archivo)) {
    return [];
  }
  let texto: string = readFileSync(archivo, 'utf-8');
  return JSON.parse(texto);
}

type pedidologin = Request<unknown, unknown, login>;
type pedidosignin = Request<unknown, unknown, signin>;

function crearcuenta(pedido: pedidologin, respuesta: Response) {
  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }
  if (!existsSync(archivosusuarios)) {
    writeFileSync(archivosusuarios, '[]', 'utf-8');
  }
  let usuarios: login[] = JSON.parse(readFileSync(archivosusuarios, 'utf-8'));

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo == pedido.body.correo) {
      respuesta.status(404).send('ya se registro esa cuenta');
      return;
    }
  }

  usuarios.push(pedido.body);
  writeFileSync(archivosusuarios, JSON.stringify(usuarios), 'utf-8');
  respuesta.status(200).send('cuenta creada');
}

export function entrar(pedido: pedidosignin, respuesta: Response) {
  if (!existsSync(archivosusuarios)) {
    respuesta.status(404).send('correo o contraseña incorrecta');
    return;
  }
  let usuarios: login[] = JSON.parse(readFileSync(archivosusuarios, 'utf-8'));
  let usuarioencontrado;

  for (let i = 0; i < usuarios.length; i++) {
    let usuario = usuarios[i];
    if (usuario.correo == pedido.body.correo1 && usuario.contraseña == pedido.body.contraseña1) {
      usuarioencontrado = usuario;
    }
  }

  if (usuarioencontrado == undefined) {
    respuesta.status(404).send('el correo o la contraseña son incorrectos');
  } else {
    respuesta.send('es correcto');
  }
}

function actual(pedido: Request, respuesta: Response) {
  let ultima = obtenerUltima();
  if (ultima === null) {
    respuesta.status(404).send({ error: 'todavía no hay mediciones' });
    return;
  }
  respuesta.send(ultima);
}

function historico(pedido: Request, respuesta: Response) {
  respuesta.send(obtenerHistorico());
}
app.get('/api/actual', actual);
app.get('/api/historico', historico);
app.post('/api/login', crearcuenta);
app.post('/api/signin', entrar);

app.listen(PUERTO, (): void => {
  console.log(`Servidor abierto en http://localhost:${PUERTO}`);
});
