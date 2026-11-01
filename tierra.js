

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
    console.log("Ejecutando dibujar(), métrica actual:", metricaActual);
  const cfg = METRICAS[metricaActual];
  if (!cfg) return;

  grafico.data.labels = historial.map(d => {
    const tiempo = d.timestamp || d.fecha;
    return new Date(tiempo).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  });
  grafico.data.labels = historial.map(d =>
    new Date(d.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  );

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
  grafico.options.scales.y.ticks.callback = v => v + cfg.unidad;

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
        historial = datos;
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

