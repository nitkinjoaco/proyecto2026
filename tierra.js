



let historial = [];
let metricaActual = 'humedad';
let horasActual = 24;
const API_URL = 'http://localhost:3000';












const METRICAS = {
  humedad: {
    series: [
      { campo: 'aire', subcampo: 'humedad', nombre: 'Aire', color: '#c7d9f5' },
      { campo: 'suelo', subcampo: 'humedad', nombre: 'Suelo', color: '#4caf2a' },
    ],
    min: 40, max: 100, unidad: '%',
  },
  temperatura: {
    series: [
      { campo: 'aire', subcampo: 'temperatura', nombre: 'Aire', color: '#c7d9f5' },
      { campo: 'suelo', subcampo: 'temperatura', nombre: 'Suelo', color: '#4caf2a' },
    ],
    min: 0, max: 40, unidad: '°',
  },
  luz: {
    series: [{ campo: 'luz', nombre: 'Luz', color: '#f5c542' }],
    min: 0, max: 100, unidad: '',
  },
  ph: {
    series: [{ campo: 'ph', nombre: 'pH', color: '#e0705a' }],
    min: 0, max: 14, unidad: '',
  },
};






const grafico = new Chart(document.getElementById('grafico'), {
  type: 'line',
  data: {
    labels: ['Cargando...'],
    datasets: [
      { label: 'Aire', data: [0], borderColor: '#c7d9f5' },
      { label: 'Suelo', data: [0], borderColor: '#4caf2a' }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
  ticks: {
    color: '#aaa',
    maxRotation: 0,
    minRotation: 0,
    autoSkip: true,
    maxTicksLimit: 8,
  },
      },
      y: {
        min: 40,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.15)' },
        ticks: { color: '#aaa', callback: v => v + '%' },
      },
    },
  },
});




function dibujar() {
  const cfg = METRICAS[metricaActual];
  if (!cfg) return;


grafico.data.labels = historial.map(d => {
  const f = new Date(d.timestamp);
  const hora = f.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (horasActual > 24) {
    const dia = f.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
    return `${dia} ${hora}`;
  }
  return hora;
});


  grafico.data.datasets = cfg.series.map(s => ({
    label: s.nombre,
    data: historial.map(d => {
      return s.subcampo ? d[s.campo][s.subcampo] : d[s.campo];
    }),
    borderColor: s.color,
    tension: 0.35,
    pointRadius: 0,
    borderWidth: 2,
  }));


  grafico.options.scales.y.min = undefined;
grafico.options.scales.y.max = undefined;
grafico.options.scales.y.ticks.callback = v => Number(v.toFixed(1)) + cfg.unidad;


  document.querySelector('.leyenda').innerHTML = cfg.series
    .map(s => `<span style="--c:${s.color}">${s.nombre}</span>`)
    .join('');


  grafico.update();
 
}


function cargarDatos(){
fetch(`${API_URL}/api/historico`)
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("Error HTTP: " + respuesta.status);
      }
      return respuesta.json();
    })
    .then((datos) => {
      console.log("Historial recibido", datos);


     if (datos && datos.length > 0) {
  const desde = Date.now() - horasActual * 60 * 60 * 1000;
  historial = datos.filter(d => new Date(d.timestamp).getTime() >= desde);
  dibujar();
} else {
        console.warn("La API devolvió datos vacíos. Esperando registros...");
      }
    })
    .catch((error) => {
      console.error("Error al cargar el historial:", error);
    });




}


document.querySelectorAll('[data-horas]').forEach(btn => {
  btn.addEventListener('click', () => {
    horasActual = Number(btn.dataset.horas);


    document.querySelectorAll('[data-horas]').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');


   cargarDatos();
  });
});


document.querySelectorAll('[data-metrica]').forEach(btn => {
  btn.addEventListener('click', () => {
    metricaActual = btn.dataset.metrica;


    document.querySelectorAll('[data-metrica]').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');


    dibujar();
  });
});
 




cargarDatos();


setInterval(cargarDatos, 10000);






const fmt = v => (v == null ? '--' : Math.round(v * 10) / 10);


function actualizarTarjetas(d) {
  document.getElementById('hum-aire').textContent   = fmt(d.aire?.humedad);
  document.getElementById('hum-suelo').textContent  = fmt(d.suelo?.humedad);
  document.getElementById('temp-aire').textContent  = fmt(d.aire?.temperatura);
  document.getElementById('temp-suelo').textContent = fmt(d.suelo?.temperatura);



  const luz = d.luz;
  document.getElementById('luz-valor').textContent = fmt(luz);
  const luzBadge = document.getElementById('luz-badge');
  if (luz != null) {
    const tipo = luz >= 50 ? 'dia' : luz >= 20 ? 'tarde' : 'noche';
    const texto = { dia: 'Luz de día', tarde: 'Luz de tarde', noche: 'Luz de noche' }[tipo];
    luzBadge.className = 'badge ' + tipo;
    luzBadge.textContent = texto;
    document.getElementById('luz-marcador').style.left =
      Math.min(100, Math.max(0, luz)) + '%';
  }



  const ph = d.ph;
  document.getElementById('ph-valor').textContent = fmt(ph);
  const phBadge = document.getElementById('ph-badge');
  if (ph != null) {
    const tipo = ph < 6.5 ? 'acido' : ph <= 7.5 ? 'neutro' : 'alcalino';
    const texto = { acido: 'Ácido', neutro: 'Neutro', alcalino: 'Alcalino' }[tipo];
    phBadge.className = 'badge ' + tipo;
    phBadge.textContent = texto;
    document.getElementById('ph-marcador').style.left =
      (Math.min(14, Math.max(0, ph)) / 14 * 100) + '%';
  }
}


function cargarActual() {
  fetch(`${API_URL}/api/actual`)
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("Error HTTP: " + respuesta.status);
      }
      return respuesta.json();
    })
    .then((datos) => {
      console.log("Ultima medicion:", datos);
      const d = Array.isArray(datos) ? datos.at(-1) : datos;
      actualizarTarjetas(d);
      ultimoTimestamp = d.timestamp;
actualizarUltimaLectura();
aplicarEstado();
    })
    .catch((error) => {
      console.error("Error:", error);
      ultimoTimestamp = null;
aplicarEstado();
    });
}


cargarActual();
setInterval(() => {
  actualizarUltimaLectura();
  aplicarEstado();
}, 30000);






let ultimoTimestamp = null;


function textoHace(ts) {
  const seg = Math.max(0, Math.floor((Date.now() - new Date(ts)) / 1000));
  if (seg < 60) return 'hace unos segundos';
  const min = Math.floor(seg / 60);
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const dias = Math.floor(h / 24);
  return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
}


function actualizarUltimaLectura() {
  if (!ultimoTimestamp) return;
  document.getElementById('ultima-lectura').textContent = textoHace(ultimoTimestamp);
  const viejo = (Date.now() - new Date(ultimoTimestamp)) > 5 * 60 * 1000;
  document.getElementById('punto-estado').classList.toggle('viejo', viejo);
}


const LIMITE_MS = 2 * 60 * 1000;


function estaConectado() {
  return ultimoTimestamp && (Date.now() - new Date(ultimoTimestamp)) < LIMITE_MS;
}


function aplicarEstado() {
  const ok = estaConectado();
  document.body.classList.toggle('desconectado', !ok);
  if (ok) return;
  ['hum-aire', 'hum-suelo', 'temp-aire', 'temp-suelo', 'luz-valor', 'ph-valor', 'ultima-lectura']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '?';
    });
}


setInterval(actualizarUltimaLectura, 30000);




const boton = document.querySelector('.boton5');
const cuadrado = document.querySelector('.cuadrado15');


boton.addEventListener('click', () => {
    if (cuadrado.classList.contains('mostrar')) {
        cuadrado.classList.remove('mostrar');
    } else {
        cuadrado.classList.add('mostrar');
    }
});  
cuadrado.addEventListener('mouseleave', () => {
    cuadrado.classList.remove('mostrar');
});


const botoncuadrado = document.querySelector('.boton1');


botoncuadrado.addEventListener("click", () => {


    window.location.href = "ayuda.html";
});


const botoncuadrado1 = document.querySelector('.boton');


botoncuadrado1.addEventListener("click", () => {


    window.location.href = "gestionar.html";
});


const botoncuadrado13 = document.querySelector('.boton6');

botoncuadrado13.addEventListener("click", () => {

window.location.href = "cambiar.html"
});

const botoncuadrado14 = document.querySelector('.boton7');

botoncuadrado14.addEventListener("click", () => {

    window.location.href = "wireframe.html"
})


const nombreGuardado = localStorage.getItem("nombreUsuario");
  if (nombreGuardado) {
    document.getElementById("nombre-usuario").textContent = nombreGuardado;
  }


