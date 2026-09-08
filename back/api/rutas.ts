//abrimos eel servidor localhost y creamos dos apis que nos permiten saber datos actuales e historicos 

import express from "express";
import { obtenerUltima, obtenerHistorico } from "../storage.ts";
import { readFile } from "fs/promises";
import { timeStamp } from "console";

export function crearServidor(puerto: number) {
  const app = express();
  app.use(express.static("front"));
  
  app.get("/api/actual", (req, res) => {
    res.json(obtenerUltima());
  });

  app.get("/api/historico", async (req, res) => {
    const desde = req.query.desde as string | undefined;
    const hasta = req.query.hasta as string | undefined;
  
    const contenido = await readFile("datos/mediciones.jsonl", "utf-8");
    const mediciones = contenido
      .split("\n")
      .filter(l => l.trim() !== "")
      .map(l => JSON.parse(l));
  
    const resultado = mediciones.filter(m => {
      const fecha = m.timestamp.slice(0, 10);
      if (desde && fecha < desde) return false;
      if (hasta && fecha > hasta) return false;
      return true;
    });
  
    res.json(resultado);
  });
  
  app.listen(puerto, () => {
    console.log(`Servidor en http://localhost:${puerto}`);
  });
}