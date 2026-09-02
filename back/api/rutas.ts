//abrimos eel servidor localhost y creamos dos apis que nos permiten saber datos actuales e historicos 

import express from "express";
import { obtenerUltima, obtenerHistorico } from "../storage.ts";

export function crearServidor(puerto: number) {
  const app = express();
  app.use(express.static("front"));
  
  app.get("/api/actual", (req, res) => {
    res.json(obtenerUltima());
  });

  app.get("/api/historico", async (req, res) => {
    res.json(await obtenerHistorico());
  });

  app.listen(puerto, () => {
    console.log(`Servidor en http://localhost:${puerto}`);
  });
}